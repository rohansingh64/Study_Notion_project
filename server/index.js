const express = require("express");
const app = express();
const userRoutes = require("./Routes/User");
const profileRoutes = require("./Routes/Profile");
const paymentRoutes = require("./Routes/Payments");
const courseRoutes = require("./Routes/Course");

const DBConnect = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinaryConnect = require("./Config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database

DBConnect();

//middleware

app.use(express.json());
app.use(cookieParser());
app.use(
	cors()

	// cors({
	// 	origin: "http://localhost:3000",
	// 	credentials: true,
	// })
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
);

//cloudinary connectino

cloudinaryConnect();

//routes ko mounte kran
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//default route

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running.....",
	});
});

app.listen(PORT, () => {
	console.log(`App is running  at ${PORT}`);
});
