const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getRecentActivity,
  getUserReviews,
  updateLastActive
} = require("../controllers/userController");

router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.get("/:id/activity", getRecentActivity);
router.get("/:id/reviews", getUserReviews);
router.put("/:id/active", updateLastActive);

module.exports = router;