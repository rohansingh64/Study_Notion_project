const express = require("express")
const router = express.Router()
const { authenticate, isInstructor } = require("../Middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../Controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************


// Delet User Account
router.delete("/deleteProfile",authenticate, deleteAccount)
router.put("/updateProfile", authenticate, updateProfile)
router.get("/getUserDetails", authenticate, getAllUserDetails)


// Get Enrolled Courses
router.get("/getEnrolledCourses", authenticate, getEnrolledCourses)
router.put("/updateDisplayPicture", authenticate, updateDisplayPicture)
router.get("/instructorDashboard", authenticate,isInstructor, instructorDashboard)


module.exports = router;