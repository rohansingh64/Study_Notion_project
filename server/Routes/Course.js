// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../Controllers/course")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../Controllers/categories")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../Controllers/section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../Controllers/subSection")

// Rating Controllers Import
const {
  createRatingAndReview,
  getAverageRating,
  getAllRatingAndReview,
} = require("../Controllers/ratingAndReviews")

const {
  updateCourseProgress
}
  = require("../Controllers/courseProgress")

// Importing Middlewares
const { authenticate, isInstructor, isStudent, isAdmin } = require("../Middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", authenticate, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", authenticate, isInstructor, createSection)
// Update a Section
router.post("/updateSection", authenticate, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", authenticate, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", authenticate, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", authenticate, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", authenticate, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", authenticate, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", authenticate, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", authenticate, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)


router.post("/updateCourseProgress",authenticate, isStudent, updateCourseProgress)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", authenticate, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", authenticate, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReview)

module.exports = router;