const User = require("../Models/User");
const OTP = require("../Models/OTP");
const { isValidEmail, isValidPassword } = require("../Utils/checkFormate");
const bcrypt = require("bcrypt");
const Profile = require("../Models/Profile");

const signUp = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			otp,
		} = req.body;

		// validate that any field is not empty

		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).json({
				success: false,
				message: "please fill all the fields",
			});
		}

		// validate that email formate is corrected
		if (!isValidEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "email formate is not corrected",
			});
		}

		// validate that Password is in given formate
		if (!isValidPassword(password)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be 8 to 15 characters , At least 1 uppercase , 1 lowercase letter , At least 1 number , At least 1 special character , No spaces",
			});
		}
		// validate that pwd and confirmPwd same
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password must be same",
			});
		}

		// now check for that user[email] is already exists or not
		// if user exists already then return with message already exists

		let existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists with this email",
			});
		}

		// comapare otp with latest otp stored in db

		let recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

		if (recentOtp.length === 0) {
            // no otp available for provided email
			return res.status(400).json({
				success: false,
				message: "Otp is not found",
			});
		}

		if (otp !== recentOtp[0].otp) {
			return res.status(400).json({
				success: false,
				message: "Otp is incorrect",
			});
		}

		// hash password
		let hashedPassword;

		try {
			hashedPassword = await bcrypt.hash(password, 10);
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "error while  hashing password",
			});
		}

		const additionalDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});

        const image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;

		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		let user = await User.create({
			firstName,
			lastName,
			email,
			accountType,
            additionalDetails,
			approved,
			password: hashedPassword,
            image,
		});

		// ######## Important #####
		// convert your user of database into a plane object for making pass undefined
		// I send user data into respond so before sending data make password undefined

		user = user.toObject();

		user.password = undefined;

		res.status(201).json({
			success: true,
			message: "You are registered successfully",
			userData: user,
		});
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message: "You are not registered due to server error , Please try again later !",
			error: error.message,
		});
	}
};

module.exports = signUp;
