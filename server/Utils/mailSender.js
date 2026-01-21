const nodemailer = require("nodemailer");
require("dotenv").config();

const sendingMail = async (email,title,body,) => {
	try {
		const transporter = nodemailer.createTransport({
			service:"gmail",
			auth: {
				user: "rohansinghrohansingh64@gmail.com",
				pass: process.env.MAIL_PASS,
			},
		});

		const info = await transporter.sendMail({
			from: "rohansinghrohansingh64@gmail.com",
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
