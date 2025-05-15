const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/userController");
const router = express.Router();

router.post(
	"/register",
	[
		body("username", "Username is required and must be at least 3 characters")
			.trim()
			.isLength({ min: 3 }),
		body(
			"password",
			"Password is required and must be at least 6 characters",
		).isLength({ min: 6 }),
	],
	register,
);

router.post(
	"/login",
	[
		body("username", "Username is required").notEmpty(),
		body("password", "Password is required").notEmpty(),
	],
	login,
);

module.exports = router;
