const nodemailer = require("nodemailer");
require("dotenv").config();

const sendingMail = async (email, title, body) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: `${process.env.MAIL_USER}`,
				pass: `${process.env.MAIL_PASS}`,
			},
		});

		transporter.verify((error, success) => {
			if (error) {
				console.error("SMTP CONNECTION FAILED:", error);
			} else {
				console.log("SMTP CONNECTION READY");
			}
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
