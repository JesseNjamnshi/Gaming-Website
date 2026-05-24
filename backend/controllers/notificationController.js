const db = require("../config/db");

//////////////////////////////
// 🔔 GET NOTIFICATIONS
//////////////////////////////
exports.getNotifications = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
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

//////////////////////////////
// 🔔 CREATE NOTIFICATION
//////////////////////////////
exports.createNotification = (req, res) => {
  const { user_id, message } = req.body;

  const sql = `
    INSERT INTO notifications (user_id, message)
    VALUES (?, ?)
  `;

  db.query(sql, [user_id, message], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });
  });
};

//////////////////////////////
// 🔔 MARK AS READ
//////////////////////////////
exports.markAsRead = (req, res) => {
  const id = req.params.id;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE notification_id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });
  });
};