

// // for using node mailer  --->>

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendingMail = async (email, title, body) => {
// 	try {
// 		const transporter = nodemailer.createTransport({
// 			service: "gmail",
// 			auth: {
// 				user: `${process.env.MAIL_USER}`,
// 				pass: `${process.env.MAIL_PASS}`,
// 			},
// 		});

// 		const info = await transporter.sendMail({
// 			from: `"StudyNotion" <${process.env.MAIL_USER}>`,
// 			to: `${email}`,
// 			subject: `${title}`,
// 			html: `${body}`,
// 		});

// 		console.log("mail info --> ", info);

// 		return info;
// 	} catch (error) {
// 		throw error;
// 	}
// };

// module.exports = sendingMail;





//  //  using resend  , i need it because render blocks smtp gmail


const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend('re_bZcGnjtn_MRamjJSwYZosf8xc4V2Rs8m9');

const sendingMail = async (email, title, body) => {
	try {
		const info = await resend.emails.send({
			from: "StudyNotion <onboarding@resend.dev>",
			to: [email],
			subject: title,
			html: body,
		});

		console.log("mail info --> ", info);
		return info;
	} catch (error) {
		console.error("EMAIL SEND ERROR:", error);
		throw error;
	}
};

module.exports = sendingMail;



