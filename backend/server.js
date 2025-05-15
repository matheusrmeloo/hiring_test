const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const memoryRoutes = require("./routes/memoryRoutes");

dotenv.config({ path: "./config/.env" });

if (!process.env.MONGODB_URI) {
	console.error("Error: MONGODB_URI is not defined in .env");
	process.exit(1);
}

if (!process.env.JWT_SECRET) {
	console.error("Error: JWT_SECRET is not defined in .env");
	process.exit(1);
}

const app = express();

const allowedOrigins = ["http://localhost:5173"];
if (process.env.NODE_ENV !== "production") {
	// allowedOrigins.push('http://other-dev-host:port');
}

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			console.warn(`CORS blocked for origin: ${origin}`);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/memory", memoryRoutes);

connectDB();

app.get("/", (req, res) => {
	res.send("Backend server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
