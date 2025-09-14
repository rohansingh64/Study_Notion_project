// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const { changePassword } = require("../Controllers/changePassword");

const login = require("../Controllers/logIn");

const signUp = require("../Controllers/signUp");

const sendOtp = require("../Controllers/otpSignUp");

const {
	resetPasswordToken,
	resetPassword,
} = require("../Controllers/ResetPassword");

const { authenticate } = require("../Middlewares/auth");

const { contactUs } = require("../Controllers/contactUs");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOtp);

// Route for Changing the password
router.post("/changepassword", authenticate, changePassword);


// Route for contact Us
router.post("/contactUs", authenticate, contactUs);



// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);



// Export the router for use in the main application
module.exports = router;
