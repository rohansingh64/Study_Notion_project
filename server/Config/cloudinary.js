

const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("cloudinary").v2;

const cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});

		console.log("Cloudinary is connected successfully");
	} catch (error) {
		console.log("Cloudinary is not connected", error.message);
	}
};

module.exports = cloudinaryConnect;
