const request = require("supertest");
const express = require("express");
const memoryRoutes = require("../../routes/memoryRoutes");
const Save = require("../../models/save");

jest.mock("../../models/save");

jest.mock("../../middleware/auth", () => (req, res, next) => {
	req.user = { id: "mockedUserId" };
	next();
});

const app = express();
app.use(express.json());
app.use("/memory", memoryRoutes);

describe("Memory Routes with Mocked Database", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("POST /save", () => {
		it("should save game data successfully", async () => {
			Save.prototype.save = jest.fn().mockResolvedValue();

			const res = await request(app).post("/memory/save").send({
				gameDate: "2025-05-13T10:00:00Z",
				failed: 2,
				difficulty: "Easy",
				completed: 1,
				timeTaken: 120,
			});

			expect(res.statusCode).toBe(201);
			expect(res.body.message).toBe("Game data saved successfully");
			expect(Save.prototype.save).toHaveBeenCalled();
		});

		it("should return validation errors for invalid input", async () => {
			const res = await request(app).post("/memory/save").send({
				gameDate: "invalid-date",
				failed: -1,
				difficulty: "Invalid",
				completed: 2,
				timeTaken: -10,
			});

			expect(res.statusCode).toBe(400);
			expect(res.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ msg: "Game date is required" }),
					expect.objectContaining({
						msg: "Failed attempts must be a non-negative number",
					}),
					expect.objectContaining({
						msg: "Difficulty must be Easy, Normal, or Hard",
					}),
					expect.objectContaining({
						msg: "Completed status must be 0 or 1",
					}),
					expect.objectContaining({
						msg: "Time taken must be a non-negative number",
					}),
				]),
			);
		});
	});

	describe("GET /history", () => {
		it("should fetch game history successfully", async () => {
			Save.find.mockImplementation(() => ({
				sort: jest.fn().mockReturnValue({
					lean: jest.fn().mockResolvedValue([
						{
							_id: "mockedSaveId1",
							userID: "mockedUserId",
							gameDate: "2025-05-13T10:00:00Z",
							failed: 2,
							difficulty: "Easy",
							completed: 1,
							timeTaken: 120,
						},
						{
							_id: "mockedSaveId2",
							userID: "mockedUserId",
							gameDate: "2025-05-12T10:00:00Z",
							failed: 3,
							difficulty: "Normal",
							completed: 0,
							timeTaken: 150,
						},
					]),
				}),
			}));

			const res = await request(app).get("/memory/history");

			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual([
				{
					_id: "mockedSaveId1",
					userID: "mockedUserId",
					gameDate: "2025-05-13T10:00:00Z",
					failed: 2,
					difficulty: "Easy",
					completed: 1,
					timeTaken: 120,
				},
				{
					_id: "mockedSaveId2",
					userID: "mockedUserId",
					gameDate: "2025-05-12T10:00:00Z",
					failed: 3,
					difficulty: "Normal",
					completed: 0,
					timeTaken: 150,
				},
			]);
		});

		it("should handle errors when fetching game history", async () => {
			Save.find.mockImplementation(() => ({
				sort: jest.fn().mockReturnValue({
					lean: jest.fn().mockRejectedValue(new Error("Database error")),
				}),
			}));

			const res = await request(app).get("/memory/history");

			expect(res.statusCode).toBe(500);
			expect(res.body.message).toBe(
				"Internal server error fetching game history",
			);
		});
	});
});
