const User = require("../Models/User");
const OTP = require("../Models/OTP");

const { isValidEmail } = require("../Utils/checkFormate");

const otpGenerator = require("otp-generator");

const sendOtp = async (req, res) => {
	try {
		const { email } = req.body;

		//validate email

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Fill all fields carefully",
			});
		}

		if (!isValidEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Email formate is not matched",
			});
		}

		// check user exists

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				success: false,
				message: "User is already registered",
			});
		}

		// OTP generation

		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		// generate otp untill it gives unique otp

		let ans = await OTP.findOne({ otp });

		while (ans) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});

			ans = await OTP.findOne({ otp });
		}

		// insert/save/create otp into OTP model

		const otpInfo = OTP.create({
			email:email,
			otp:otp,
		});

		res.status(200).json({
			success: true,
			message: "OTP is successfully send",
		});

	} catch (error) {

        console.log("error -> ",error.message);

		return res.status(400).json({
			success: false,
			message: "Internal Server Error",
            error:error.message,
		});
	}
};


module.exports = sendOtp;