const db = require("../config/db");

// ⭐ ADD OR UPDATE REVIEW
exports.addReview = (req, res) => {
    const { user_id, game_id, rating, comment } = req.body;

    const sql = `
        INSERT INTO reviews (user_id, game_id, rating, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        comment = VALUES(comment)
    `;

    db.query(sql, [user_id, game_id, rating, comment], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        // 🔔 NOTIFICATION
        db.query(
            "SELECT title FROM games WHERE game_id = ?",
            [game_id],
            (err, result) => {
                if (!err && result.length > 0) {
                    const message = `⭐ You reviewed ${result[0].title}`;

                    db.query(
                        "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
                        [user_id, message]
                    );
                }
            }
        );

        res.json({
            success: true,
            message: "Review saved"
        });
    });
};


// 📥 GET REVIEWS FOR A GAME
exports.getGameReviews = (req, res) => {
    const gameId = req.params.gameId;

    const sql = `
        SELECT r.*, u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.game_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [gameId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// 🤖 RECOMMENDED GAMES
exports.getRecommendedGames = (req, res) => {
    const sql = `
        SELECT g.game_id, g.title, g.price, AVG(r.rating) AS avg_rating
        FROM games g
        JOIN reviews r ON g.game_id = r.game_id
        GROUP BY g.game_id
        ORDER BY avg_rating DESC
        LIMIT 5
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};