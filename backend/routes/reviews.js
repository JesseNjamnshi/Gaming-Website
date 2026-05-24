const express = require("express");
const router = express.Router();

const {
    addReview,
    getGameReviews,
    getRecommendedGames
} = require("../controllers/reviewController");

router.post("/", addReview);
router.get("/:gameId", getGameReviews);
router.get("/recommended/all", getRecommendedGames);

module.exports = router;