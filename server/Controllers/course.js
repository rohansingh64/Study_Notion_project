const Course = require("../Models/Course");
const User = require("../Models/User");
const Category = require("../Models/Categories");
const CourseProgress = require("../Models/CourseProgress");
const Section = require("../Models/Section");
const SubSection = require("../Models/SubSection");
const { uploadFileToCloudinary } = require("../Utils/fileUploader");
const { convertSecondsToDuration } = require("../Utils/secToDuration");
const dotenv = require("dotenv");
dotenv.config();

exports.createCourse = async (req, res) => {
	try {
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag: _tag,
			category,
			status,
			instructions: _instructions,
		} = req.body;

		const thumbnail = req.files.thumbnailImage;

		// Convert the tag and instructions from stringified Array to Array
		const tag = JSON.parse(_tag);
		const instructions = JSON.parse(_instructions);

		// Validation for null or empty
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag.length ||
			!category ||
			!instructions.length ||
			!thumbnail
		) {
			return res.status(400).json({
				success: false,
				message: "Fill All the Fields.",
			});
		}

		if (!status || status === undefined) {
			status = "Draft";
		}

		const user = req.user;

		const categoryDetails = await Category.findById(category);

		// validation for a valid category or not
		if (!categoryDetails) {
			return res.status(400).json({
				success: false,
				message: "Invalid Category",
			});
		}

		// Check if the user is an instructor or not
		const instructorDetails = await User.findOne({
			_id: user.id,
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		//uploading image to cloudinary
		const thumbnailImage = await uploadFileToCloudinary(
			thumbnail,
			process.env.Folder_Name
		);

		// create course entryin db
		const courseDetails = await Course.create({
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructor: user.id,
			thumbnail: thumbnailImage.secure_url,
			instructions,
		});

		// updating category db entry for courses array
		const result = await Category.findByIdAndUpdate(
			category,
			{
				$push: {
					courses: courseDetails._id,
				},
			},
			{ new: true }
		);

		// updating instructor (user) courses array
		const userDetails = await User.findByIdAndUpdate(
			user.id,
			{
				$push: {
					courses: courseDetails._id,
				},
			},
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "Course is Created Succussessfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Course is Not Created",
			error: error.message,
		});
	}
};

//   more controllers -------> pending

// Edit Course Details
exports.editCourse = async (req, res) => {
	try {
		const { courseId } = req.body;
		const updates = req.body;
		const course = await Course.findById(courseId);

		const oldCategory = course.category;

		if (!course) {
			return res.status(404).json({ error: "Course not found" });
		}

		// If Thumbnail Image is found, update it
		if (req.files) {
			console.log("thumbnail update");
			const thumbnail = req.files.thumbnailImage;
			const thumbnailImage = await uploadFileToCloudinary(
				thumbnail,
				process.env.FOLDER_NAME
			);
			course.thumbnail = thumbnailImage.secure_url;
		}

		// Update only the fields that are present in the request body
		// Update only the fields that are present in the request body
		Object.keys(updates).forEach((key) => {
			if (key === "tag" || key === "instructions") {
				try {
					course[key] = JSON.parse(updates[key]); // parse JSON arrays/objects
				} catch {
					course[key] = updates[key]; // fallback if not valid JSON
				}
			} else {
				course[key] = updates[key];
			}
		});

		//if updates contain change category then from above updates for loop --> category changes
		// but in prev category we need to remove course and add course to new category

		const { category } = req.body; //new category

		if (category) {
			await Category.findByIdAndUpdate(oldCategory, {
				$pull: { courses: courseId },
			});

			await Category.findByIdAndUpdate(category, {
				$push: { courses: courseId },
			});
		}

		await course.save();

		const updatedCourse = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		res.json({
			success: true,
			message: "Course updated successfully",
			data: updatedCourse,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// Get Course List
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{ status: "Published" },
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
			}
		)
			.populate("instructor")
			.exec();

		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

exports.getCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body;
		const courseDetails = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
					select: "-videoUrl",
				},
			})
			.exec();

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			});
		}

		// if (courseDetails.status === "Draft") {
		//   return res.status(403).json({
		//     success: false,
		//     message: `Accessing a draft course is forbidden`,
		//   });
		// }

		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration);
				totalDurationInSeconds += timeDurationInSeconds;
			});
		});

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getFullCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body;
		const userId = req.user.id;
		const courseDetails = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		let courseProgressCount = await CourseProgress.findOne({
			courseId: courseId,
			userId: userId,
		});

		console.log("courseProgressCount : ", courseProgressCount);

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			});
		}

		// if (courseDetails.status === "Draft") {
		//   return res.status(403).json({
		//     success: false,
		//     message: `Accessing a draft course is forbidden`,
		//   });
		// }

		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration);
				totalDurationInSeconds += timeDurationInSeconds;
			});
		});

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos
					? courseProgressCount?.completedVideos
					: [],
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
	try {
		// Get the instructor ID from the authenticated user or request body
		const instructorId = req.user.id;

		// Find all courses belonging to the instructor
		let instructorCourses = await Course.find({
			instructor: instructorId,
		})
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
					select: "timeDuration",
				},
			})
			.sort({ createdAt: -1 });

		// Calculate total duration for each course
		instructorCourses = instructorCourses.map((course) => {
			let totalDurationInSeconds = 0;

			course.courseContent.forEach((content) => {
				content.subSection.forEach((subSection) => {
					const timeDurationInSeconds =
						parseInt(subSection.timeDuration, 10) || 0;
					totalDurationInSeconds += timeDurationInSeconds;
				});
			});

			let totalDuration = convertSecondsToDuration(totalDurationInSeconds);

			return {
				...course.toObject(),
				totalDuration,
			};
		});

		// Return the instructor's courses
		res.status(200).json({
			success: true,
			message: "instructor courses fetched successfully",
			data: instructorCourses,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor courses",
			error: error.message,
		});
	}
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
	try {
		const { courseId } = req.body;

		// Find the course
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Unenroll students from the course
		const studentsEnrolled = course.studentsEnrolled;
		for (const studentId of studentsEnrolled) {
			await User.findByIdAndUpdate(studentId, {
				$pull: { courses: courseId },
			});
		}

		// remove course from instructor account
		const instructorId = course.instructor;

		await User.findByIdAndUpdate(instructorId, {
			$pull: { courses: courseId },
		});

		// remove course from category model also

		const categoryId = course.category;

		await Category.findByIdAndUpdate(categoryId, {
			$pull: { courses: courseId },
		});

		// Delete sections and sub-sections
		const courseSections = course.courseContent;
		for (const sectionId of courseSections) {
			// Delete sub-sections of the section
			const section = await Section.findById(sectionId);
			if (section) {
				const subSections = section.subSection;
				for (const subSectionId of subSections) {
					await SubSection.findByIdAndDelete(subSectionId);
				}
			}

			// Delete the section
			await Section.findByIdAndDelete(sectionId);
		}

		// Delete the course
		await Course.findByIdAndDelete(courseId);

		return res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		});
	}
};
