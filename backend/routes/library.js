const express = require("express");
const router = express.Router();

const { getLibrary } = require("../controllers/libraryController");

// GET USER LIBRARY
router.get("/:userId", getLibrary);

module.exports = router;