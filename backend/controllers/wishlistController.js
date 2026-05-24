const db = require("../config/db");

// ✅ GET
exports.getWishlist = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      g.game_id,
      g.title,
      g.price,
      g.image_url,
      g.release_date,
      GROUP_CONCAT(ge.name) AS genres
    FROM wishlist w
    JOIN games g ON w.game_id = g.game_id
    LEFT JOIN game_genres gg ON g.game_id = gg.game_id
    LEFT JOIN genres ge ON gg.genre_id = ge.genre_id
    WHERE w.user_id = ?
    GROUP BY g.game_id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, data: results });
  });
};

// ✅ ADD
exports.addToWishlist = (req, res) => {
  const { user_id, game_id } = req.body;

  const insertSql = "INSERT INTO wishlist (user_id, game_id) VALUES (?, ?)";

  db.query(insertSql, [user_id, game_id], (err) => {
    if (err) return res.status(500).json({ success: false });

    // 🔔 GET GAME NAME + CREATE NOTIFICATION
    db.query(
      "SELECT title FROM games WHERE game_id = ?",
      [game_id],
      (err, result) => {
        if (!err && result.length > 0) {
          const message = `💖 Added ${result[0].title} to wishlist`;

          db.query(
            "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
            [user_id, message]
          );
        }
      }
    );

    res.json({ success: true });
  });
};

// ✅ REMOVE
exports.removeFromWishlist = (req, res) => {
  const { user_id, game_id } = req.body;

  const sql = "DELETE FROM wishlist WHERE user_id = ? AND game_id = ?";

  db.query(sql, [user_id, game_id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};