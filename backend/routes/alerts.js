const express = require("express");
const router = express.Router();

const {
    setPriceAlert,
    getUserAlerts,
    checkAlerts
} = require("../controllers/alertController");

// create/update alert
router.post("/", setPriceAlert);

// ⚠️ IMPORTANT: specific route FIRST
router.get("/check/:userId", checkAlerts);

// get all alerts for a user
router.get("/:userId", getUserAlerts);

module.exports = router;
