const db = require("../config/db");


// CREATE OR UPDATE ALERT
exports.setPriceAlert = (req, res) => {
    const { user_id, game_id, target_price } = req.body;

    const sql = `
        INSERT INTO price_alerts (user_id, game_id, target_price)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE target_price = VALUES(target_price)
    `;

    db.query(sql, [user_id, game_id, target_price], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Alert saved successfully"
        });
    });
};


// GET USER ALERTS
exports.getUserAlerts = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT pa.*, g.title, g.price
        FROM price_alerts pa
        JOIN games g ON pa.game_id = g.game_id
        WHERE pa.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "User alerts fetched",
            data: results
        });
    });
};


// CHECK ALERTS + CREATE NOTIFICATIONS
exports.checkAlerts = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT pa.*, g.title, g.price
        FROM price_alerts pa
        JOIN games g ON pa.game_id = g.game_id
        WHERE pa.user_id = ? AND g.price <= pa.target_price
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        // 🔔 insert notifications
        results.forEach(alert => {
            const message = `Price dropped for ${alert.title}!`;

            db.query(
                "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
                [userId, message]
            );
        });

        res.json({
            success: true,
            message: "Checked alerts",
            data: results
        });
    });
};