const express = require("express");
const router = express.Router();

const {
    searchGames,
    getGameById
} = require("../controllers/gameController");

// 🔍 Search (must come first)
router.get("/", searchGames);

// 🎮 Game details (IMPORTANT: after "/")
router.get("/:id", getGameById);

module.exports = router;