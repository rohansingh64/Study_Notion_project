const mongoose = require("mongoose");
const sendingMail = require("../Utils/mailSender");
const otpTemplate = require("../Templates/otpVerificationTemplate");

const otpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
	},

	otp: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
		expires: 5 * 60,
	},
});

otpSchema.pre("save", async function(next) {
	try {
		const title = "Verification Email From StudyNotion";

		const body = otpTemplate(this.otp);

		const info = await sendingMail(this.email, title, body);

        console.log("Email sent:", info.messageId);

        next();
	}
    
    catch (error) {

        console.error("Error while sending OTP to email:", error.message);
    }
});

module.exports = mongoose.model("OTP", otpSchema);
