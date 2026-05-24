const db = require("../config/db");


// 🛒 CREATE ORDER + CONFIRMATION + NOTIFICATION
exports.createOrder = (req, res) => {
    const { user_id, games } = req.body;

    if (!user_id || !games || games.length === 0) {
        return res.status(400).json({
            success: false,
            message: "user_id and games are required"
        });
    }

    const gameIds = games.map(g => g.game_id);

    const sqlPrices = `
        SELECT game_id, price, title 
        FROM games 
        WHERE game_id IN (?)
    `;

    db.query(sqlPrices, [gameIds], (err, priceResults) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        let total = 0;
        const priceMap = {};
        const gameTitles = [];

        priceResults.forEach(g => {
            priceMap[g.game_id] = g.price;
            total += parseFloat(g.price);
            gameTitles.push(g.title);
        });

        const insertOrder = `
            INSERT INTO orders (user_id, total_amount, status)
            VALUES (?, ?, 'paid')
        `;

        db.query(insertOrder, [user_id, total], (err, orderResult) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            const orderId = orderResult.insertId;

            const items = games.map(g => [
                orderId,
                g.game_id,
                priceMap[g.game_id]
            ]);

            const insertItems = `
                INSERT INTO order_items (order_id, game_id, price)
                VALUES ?
            `;

            db.query(insertItems, [items], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                // 🔔 Notification
                const message = `🎮 Purchase successful: ${gameTitles.join(", ")}`;

                db.query(
                    `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                    [user_id, message]
                );

                // ✅ ORDER CONFIRMATION RESPONSE
                res.status(201).json({
                    success: true,
                    message: "Order confirmed",
                    data: {
                        order_id: orderId,
                        games: gameTitles,
                        total_amount: total,
                        status: "paid"
                    }
                });
            });
        });
    });
};


// 📄 GET RECEIPT (FULL ORDER DETAILS)
exports.getReceipt = (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT 
            o.order_id,
            o.total_amount,
            o.status,
            o.created_at,
            g.title,
            oi.price
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN games g ON oi.game_id = g.game_id
        WHERE o.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
            success: true,
            data: results
        });
    });
};


// 📜 PURCHASE HISTORY (NEW)
exports.getUserOrders = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            o.order_id,
            o.total_amount,
            o.status,
            o.created_at,
            GROUP_CONCAT(g.title) AS games
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN games g ON oi.game_id = g.game_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
            success: true,
            data: results
        });
    });
};


// 💸 REQUEST REFUND (BETTER SYSTEM)
exports.requestRefund = (req, res) => {
    const orderId = req.params.id;

    const sql = `
        UPDATE orders
        SET status = 'refund_requested'
        WHERE order_id = ?
    `;

    db.query(sql, [orderId], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
            success: true,
            message: "Refund request submitted"
        });
    });
};


// 💰 APPROVE REFUND (ADMIN / AUTO)
exports.refundOrder = (req, res) => {
    const orderId = req.params.id;

    const sql = `
        UPDATE orders
        SET status = 'refunded'
        WHERE order_id = ?
    `;

    db.query(sql, [orderId], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
            success: true,
            message: "Order refunded successfully"
        });
    });
};


// 🎮 USER LIBRARY
exports.getUserLibrary = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            g.game_id,
            g.title,
            g.image_url,
            g.release_date,
            GROUP_CONCAT(ge.name) AS genres
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN games g ON oi.game_id = g.game_id
        LEFT JOIN game_genres gg ON g.game_id = gg.game_id
        LEFT JOIN genres ge ON gg.genre_id = ge.genre_id
        WHERE o.user_id = ?
        AND o.status = 'paid'
        GROUP BY g.game_id
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
            success: true,
            data: results
        });
    });
};