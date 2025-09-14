const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config();

// Authentication -->

exports.authenticate = (req, res, next) => {
	try {
		
		const token =
			req.header("Authorization").replace("Bearer ", "") ||
			req.cookies.token ||
			req.body.token;

		console.log("token --->  ",token);

		if (!token) {
			return res.status(400).json({
				success: false,
				message: "token is missing",
			});
		}

		//verifying token

		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET);
			// for valid token it return payload/body of jwt
			// for inValid token it throws an error

			// store payload/body of token in req for further use in authorisation

			req.user = payload;
		} catch (error) {
			// invalid token

			return res.status(401).json({
				success: false,
				message: "token is not valid",
			});
		}

		next();

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Some Error occurs while token verification",
		});
	}
};

// student authorisation

exports.isStudent = (req, res, next) => {
	try {
		if (req.user.accountType != "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a protected route for Student only",
			});
		}

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Some Error occurs while role verifivation for student",
		});
	}
};

// admin authorisation

exports.isAdmin = (req, res, next) => {
	try {
		if (req.user.accountType != "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a protected route for Admin only",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Some Error occurs while role verifivation for Admin",
		});
	}
};

// Instructor authorisation

exports.isInstructor = (req, res, next) => {
	try {
		if (req.user.accountType != "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a protected route for Instructor only",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Some Error occurs while role verifivation for Instructor",
		});
	}
};
