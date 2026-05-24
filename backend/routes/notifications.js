const express = require("express");
const router = express.Router();

const {
  getNotifications,
  createNotification,
  markAsRead
} = require("../controllers/notificationController");

router.get("/:userId", getNotifications);
router.post("/", createNotification);
router.put("/:id/read", markAsRead);

module.exports = router;