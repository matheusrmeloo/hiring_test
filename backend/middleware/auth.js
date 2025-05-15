const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

module.exports = function (req, res, next) {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	const tokenParts = token.split(" ");
	if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
		return res
			.status(401)
			.json({ message: "Token is not valid (format error)" });
	}
	const actualToken = tokenParts[1];

	try {
		const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		console.error("Token verification failed:", err.message);
		res.status(401).json({ message: "Token is not valid" });
	}
};
