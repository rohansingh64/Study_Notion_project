const nodemailer = require("nodemailer");
require("dotenv").config();

const sendingMail = async (email, title, body) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: `${process.env.MAIL_USER}`,
				pass: `${process.env.MAIL_PASS}`,
			},
		});

		const info = await transporter.sendMail({
			from: `"StudyNotion" <${process.env.MAIL_USER}>`,
			to: `${email}`,
			subject: `${title}`,
			html: `${body}`,
		});

		console.log("mail info --> ", info);

		return info;
	} catch (error) {
		throw error;
	}
};

module.exports = sendingMail;
