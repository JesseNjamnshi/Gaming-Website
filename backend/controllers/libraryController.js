const db = require("../config/db");

exports.getLibrary = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      g.game_id,
      g.title,
      g.price,
      g.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN games g ON oi.game_id = g.game_id
    WHERE o.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      data: results
    });
  });
};