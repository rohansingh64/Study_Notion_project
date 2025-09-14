
const User = require("../Models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();;

const { isValidEmail, isValidPassword } = require("../Utils/checkFormate");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// validate that any field is not empty
		if (!email || !password) {
			return res.status(400).json({
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

		// now check for that user[email] is exists or not
		// if user not exists then return with message not exists

		let user = await User.findOne({ email })
								.populate("additionalDetails").exec();

		if (!user) {
			return res.status(409).json({
				success: false,
				message: "User does not exists with this email",
			});
		}

		// now check for password verification

		if (await bcrypt.compare(password, user.password)) {
			//password matched --> login successfully

			// crete a jwt token --> 3 things body/payload , secret , options

			//jwt body or payload
			const payload = {
				id: user._id,
				email: user.email,
				accountType: user.accountType,
			};

			const secret = process.env.JWT_SECRET;

			const options = {
				expiresIn: "24h",
			};

			const token = jwt.sign(payload, secret, options);

			user = user.toObject();

			user.password = undefined;
			user.token = token;

			// create a cookie ---> 3 things  name , body , options

			const cookieOptions = {
				httpOnly: true,
				maxAge: 2 * 60 * 60 * 1000, // 2 hrs
			};

			console.log("user  -> ",user);

			return res
				.cookie("token", token, cookieOptions)
				.status(200)
				.json({
					success: true,
					message: "User Logged in successfully",
					token: token,
					user: user,
				});
		} 
        
        else {
			//password not matched
			return res.status(401).json({
				success: false,
				message: "Incorrect password",
			});
		}
	}
    
    
    catch (error) {
		console.log("error -> ", error, message);

		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

module.exports = login;
