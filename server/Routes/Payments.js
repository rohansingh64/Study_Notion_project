// Import the required modules
const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../Controllers/payments");
const { authenticate,isStudent } = require("../Middlewares/auth");
router.post("/capturePayment", authenticate, isStudent, capturePayment);
router.post("/verifyPayment",authenticate, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", authenticate, isStudent, sendPaymentSuccessEmail);

module.exports = router;