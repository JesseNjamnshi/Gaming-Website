const db = require("../config/db");

//////////////////////////////
// 🔹 GET PROFILE
//////////////////////////////
exports.getProfile = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      u.user_id,
      u.username,
      u.profile_picture,
      u.bio,
      u.last_active,
      COUNT(DISTINCT oi.game_id) AS total_games
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result[0]
    });
  });
};

//////////////////////////////
// 🔹 UPDATE PROFILE (PIC + BIO)
//////////////////////////////
exports.updateProfile = (req, res) => {
  const userId = req.params.id;
  const { profile_picture, bio } = req.body;

  const sql = `
    UPDATE users
    SET profile_picture = ?, bio = ?
    WHERE user_id = ?
  `;

  db.query(sql, [profile_picture, bio, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};

//////////////////////////////
// 🔹 RECENT ACTIVITY
//////////////////////////////
exports.getRecentActivity = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT g.title, g.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN games g ON oi.game_id = g.game_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    LIMIT 5
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true, data: results });
  });
};

//////////////////////////////
// 🔹 USER REVIEWS ⭐
//////////////////////////////
exports.getUserReviews = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT g.title, r.rating, r.comment
    FROM reviews r
    JOIN games g ON r.game_id = g.game_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true, data: results });
  });
};

//////////////////////////////
// 🔹 UPDATE LAST ACTIVE (ONLINE SYSTEM)
//////////////////////////////
exports.updateLastActive = (req, res) => {
  const userId = req.params.id;

  const sql = `
    UPDATE users
    SET last_active = NOW()
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};