const User = require("../Models/User");
const { isValidPassword, isValidEmail } = require("../Utils/checkFormate");

const sendingMail = require("../Utils/mailSender");

const crypto = require("crypto");

const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
	try {
		const { email } = req.body;

		if (!isValidEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email formate",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User is not registered",
			});
		}

		const resetPassToken = crypto.randomUUID();

		const updatedUser = await User.findOneAndUpdate(
			{ email },
			{
				resetPassToken,
				resetPasswordExpires: Date.now() + 5 * 60 * 1000,
			},
			{ new: true }
		);

		const link = `http://localhost:3000/update-password/${resetPassToken}`;
		//const link = `https://studynotion-edtech-project.vercel.app/update-password/${resetPassToken}`

		try {
			const title = "Password reset for Study Notion";

			const body = `link for password reset : ${link} click for reset password`;

			const info = await sendingMail(email, title, body);

			console.log("email send info -> ", info);

			return res.status(200).json({
				success: true,
				message: "Password reset mail send , Check Mail",
				user: updatedUser,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: " Error! Password reset mail not send",
			});
		}
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message: "Server errror Try again after some time",
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, resetPassToken } = req.body;

		if(!password || !confirmPassword || !resetPassToken){
			return res.status(400).json({
				success: false,
				message: "All the fields are required.",
			});
		}

		if (!isValidPassword(password) || !isValidPassword(confirmPassword)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be 8 to 15 characters , At least 1 uppercase , 1 lowercase letter , At least 1 number , At least 1 special character , No spaces",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password must be same",
			});
		}

		const user = await User.findOne({ resetPassToken });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "token is invalid",
			});
		}

		const date = user.resetPasswordExpires;

		if (Date.now() > date) {
			return res.status(400).json({
				success: false,
				message: "token / reset pass link expires please! resend  link",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const userPasswordUpdate = await User.findOneAndUpdate(
			{ resetPassToken },
			{
				password: hashedPassword,
				resetPassToken: null, // clear token and expire time after use
				resetPasswordExpires: null,
			},
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "Password reset successfully",
			user: userPasswordUpdate,
		});
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message: "Server Error while reset password",
		});
	}
};
