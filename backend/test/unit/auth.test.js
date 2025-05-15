const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");

jest.mock("jsonwebtoken");

describe("Auth Middleware - Unit Tests", () => {
	let req, res, next;

	beforeEach(() => {
		req = { header: jest.fn() };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
	});

	it("should return 401 if no token is provided", () => {
		req.header.mockReturnValue(null);

		authMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "No token, authorization denied",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("should return 401 if token format is invalid", () => {
		req.header.mockReturnValue("InvalidTokenFormat");

		authMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Token is not valid (format error)",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("should return 401 if token verification fails", () => {
		req.header.mockReturnValue("Bearer invalidToken");
		jwt.verify.mockImplementation(() => {
			throw new Error("Invalid token");
		});

		authMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Token is not valid",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("should call next and set req.user if token is valid", () => {
		const mockDecoded = { id: "mockedUserId" };
		req.header.mockReturnValue("Bearer validToken");
		jwt.verify.mockReturnValue(mockDecoded);

		authMiddleware(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			"validToken",
			process.env.JWT_SECRET,
		);
		expect(req.user).toEqual(mockDecoded);
		expect(next).toHaveBeenCalled();
	});
});
