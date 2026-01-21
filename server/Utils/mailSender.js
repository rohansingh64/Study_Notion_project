const nodemailer = require("nodemailer");
require("dotenv").config();

const sendingMail = async (email,title,body,) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			secure: false, // true for port 465, false for 587
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		const info = await transporter.sendMail({
			from: `"StudyNotion" <no-reply@brevo.com>`,
			to: `${email}`,
			subject: `${title}`,
			html: `${body}`,
		});

		console.log("mail info --> ",info);

		return info;
	} 
	
	catch (error) {
        throw error;
	}
};

module.exports = sendingMail;
