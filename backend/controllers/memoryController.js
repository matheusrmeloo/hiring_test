const { validationResult } = require("express-validator");
const Save = require("../models/save");

exports.saveGameData = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.error("Validation errors saving game data:", errors.array());
		return res.status(400).json({ errors: errors.array() });
	}
	const { gameDate, failed, difficulty, completed, timeTaken } = req.body;
	const userID = req.user.id;

	console.log("Received validated data to save:", {
		userID,
		gameDate,
		failed,
		difficulty,
		completed,
		timeTaken,
	});

	try {
		const newSave = new Save({
			userID,
			gameDate: gameDate || new Date(),
			failed,
			difficulty,
			completed,
			timeTaken,
		});

		await newSave.save();
		res.status(201).json({ message: "Game data saved successfully" });
	} catch (error) {
		console.error("Error saving game data:", error);
		res.status(500).json({ message: "Internal server error saving game data" });
	}
};

exports.getGameHistory = async (req, res) => {
	try {
		const userID = req.user.id;

		const history = await Save.find({ userID: userID })
			.sort({ gameDate: -1 })
			.lean();

		res.status(200).json(history);
	} catch (error) {
		console.error("Error fetching game history:", error);
		res
			.status(500)
			.json({ message: "Internal server error fetching game history" });
	}
};
