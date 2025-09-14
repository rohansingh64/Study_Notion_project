const User = require("../Models/User");

const bcrypt = require("bcrypt");

const sendingMail = require("../Utils/mailSender");
const { passwordUpdated } = require("../Templates/passwordChangeTemplate");

const {isValidPassword} = require("../Utils/checkFormate");

exports.changePassword = async (req, res) => {
	try {


		const id = req.user.id;

		const { oldPassword , newPassword } = req.body;

		if (!oldPassword || !newPassword ) {
			return res.status(400).json({
				success: false,
				message: "Please fill all the fields",
			});
		}

		if (
			!isValidPassword(oldPassword) ||
			!isValidPassword(newPassword)
		) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be 8 to 15 characters , At least 1 uppercase , 1 lowercase letter , At least 1 number , At least 1 special character , No spaces",
			});
		}

		// user available
		const existingUser = await User.findById(id);

		if (!existingUser) {
			return res.status(400).json({
				success: false,
				message: "user does not exists",
			});
		}

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			existingUser.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		const hashNewPass = await bcrypt.hash(newPassword, 10);

		const user = await User.findByIdAndUpdate(
			id,
			{
				password: hashNewPass,
			},
			{ new: true }
		);

		try {

			const title = `Password change mail for Study Notion`;

			const name = `${user.firstName} ${user.lastName}`;

			const body = passwordUpdated(user.email,name);

			const info = sendingMail(user.email, title, body);
			console.log("change password mail send ", info);

			return res.status(200).json({
				success: true,
				message: "Password changed Successfully",
				user:user,
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: "Password change but Mail not send",
			});
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};
