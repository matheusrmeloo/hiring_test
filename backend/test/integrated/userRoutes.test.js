const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRoutes = require("../../routes/userRoutes");
const User = require("../../models/user");

jest.mock("../../models/user");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes with Mocked Database", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("POST /register", () => {
		it("should register a new user successfully", async () => {
			User.findOne.mockResolvedValue(null);

			User.prototype.save = jest.fn().mockResolvedValue();

			const res = await request(app).post("/users/register").send({
				username: "testuser",
				password: "password123",
			});

			expect(res.statusCode).toBe(201);
			expect(res.body.message).toBe("User registered successfully");
			expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
			expect(User.prototype.save).toHaveBeenCalled();
		});

		it("should return an error if username already exists", async () => {
			User.findOne.mockResolvedValue({ username: "testuser" });

			const res = await request(app).post("/users/register").send({
				username: "testuser",
				password: "password123",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body.message).toBe("Username already exists");
			expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
		});

		it("should return validation errors for invalid input", async () => {
			const res = await request(app).post("/users/register").send({
				username: "ab",
				password: "123",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						msg: "Username is required and must be at least 3 characters",
					}),
					expect.objectContaining({
						msg: "Password is required and must be at least 6 characters",
					}),
				]),
			);
		});
	});

	describe("POST /login", () => {
		it("should log in a user successfully", async () => {
			const hashedPassword = await bcrypt.hash("password123", 10);
			User.findOne.mockResolvedValue({
				_id: "mockedUserId",
				username: "testuser",
				password: hashedPassword,
			});

			jest.spyOn(jwt, "sign").mockReturnValue("mocked-jwt-token");

			const res = await request(app).post("/users/login").send({
				username: "testuser",
				password: "password123",
			});

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty("token", "mocked-jwt-token");
			expect(res.body).toHaveProperty("userID", "mockedUserId");
			expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
		});

		it("should return an error for invalid credentials", async () => {
			User.findOne.mockResolvedValue(null);

			const res = await request(app).post("/users/login").send({
				username: "nonexistentuser",
				password: "wrongpassword",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body.message).toBe("Invalid credentials");
			expect(User.findOne).toHaveBeenCalledWith({
				username: "nonexistentuser",
			});
		});

		it("should return validation errors for missing fields", async () => {
			const res = await request(app).post("/users/login").send({
				username: "",
				password: "",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						msg: "Username is required",
					}),
					expect.objectContaining({
						msg: "Password is required",
					}),
				]),
			);
		});
	});
});
