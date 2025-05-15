const express = require("express");
const { body } = require("express-validator");
const {
	saveGameData,
	getGameHistory,
} = require("../controllers/memoryController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post(
	"/save",
	auth,
	[
		body("gameDate", "Game date is required")
			.optional({ checkFalsy: true })
			.isISO8601()
			.toDate(),
		body("failed", "Failed attempts must be a non-negative number").isInt({
			min: 0,
		}),
		body("difficulty", "Difficulty must be Easy, Normal, or Hard").isIn([
			"Easy",
			"Normal",
			"Hard",
		]),
		body("completed", "Completed status must be 0 or 1").isInt({
			min: 0,
			max: 1,
		}),
		body("timeTaken", "Time taken must be a non-negative number").isInt({
			min: 0,
		}),
	],
	saveGameData,
);

router.get("/history", auth, getGameHistory);

module.exports = router;
