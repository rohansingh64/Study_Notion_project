const Profile = require("../Models/Profile");
const User = require("../Models/User");
const Course = require("../Models/Course");
const CourseProgress = require("../Models/CourseProgress");
const { uploadFileToCloudinary } = require("../Utils/fileUploader");
const { convertSecondsToDuration } = require("../Utils/secToDuration");

// update profile of user [additional details]

exports.updateProfile = async (req, res) => {
	try {
		console.log("req body -> ", req.body);

		const { firstName, lastName, gender, contactNumber, dateOfBirth, about } =
			req.body;

		const userId = req.user.id;

		console.log("user id ", userId);

		if (
			!firstName ||
			!lastName ||
			!gender ||
			!contactNumber ||
			!userId ||
			!dateOfBirth ||
			!about
		) {
			return res.status(400).json({
				success: false,
				message: "Fill all the fields.",
			});
		}

		const userDetails = await User.findByIdAndUpdate(
			userId,
			{
				firstName: firstName,
				lastName: lastName,
			},
			{ new: true }
		);

		const profileId = userDetails.additionalDetails;

		const profile = await Profile.findByIdAndUpdate(
			profileId,
			{
				gender,
				contactNumber,
				dateOfBirth,
				about,
			},
			{ new: true }
		);

		const updatedUserDetails = await User.findById(userId)
											.populate("additionalDetails").exec();

		return res.status(200).json({
			success: true,
			message: "Profile is updated successfully",
			profile: profile,
			updatedUserDetails: updatedUserDetails,
		});
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message:
				"Your profile is not updated due to server error , Please try again later !",
			error: error.message,
		});
	}
};

// delete Account

exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.user.id;

		const userDetails = await User.findById(userId);

		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "user does not exists",
			});
		}

		const profileId = userDetails.additionalDetails;

		// before delete user --> delete its additional details[profile details]

		await Profile.findByIdAndDelete(profileId);

		await User.findByIdAndDelete(userId);

		// user deleted so remove user from enrolled courses

		let courses = userDetails.courses;

		for (let cId of courses) {
			await Course.findByIdAndUpdate(cId, {
				$pull: {
					studentsEnrolled: userId,
				},
			});
		}

		return res.status(200).json({
			success: true,
			message: "Account is deleted successfully",
		});
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message:
				"Your Account is not deleted due to server error , Please try again later !",
			error: error.message,
		});
	}
};

// getting all user details

exports.getAllUserDetails = async (req, res) => {
	try {
		const userId = req.user.id;

		const userDetails = await User.findById(userId)
			.populate("additionalDetails")
			.exec();

		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "user does not exists",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User details fetched successfully",
			userDetails: userDetails,
		});
	} catch (error) {
		console.log("error -> ", error.message);

		return res.status(500).json({
			success: false,
			message: "Not fetched all details of user , Please try again later !",
			error: error.message,
		});
	}
};

// pending controllers ========>

exports.updateDisplayPicture = async (req, res) => {
	try {
		const displayPicture = req.files.displayPicture;
		const userId = req.user.id;

		console.log("dp in server -> ", displayPicture);

		if (!displayPicture) {
			return res.status(400).json({
				success: false,
				message: "No dp find",
			});
		}

		const image = await uploadFileToCloudinary(
			displayPicture,
			process.env.FOLDER_NAME,
			1000,
			1000
		);
		console.log(image);
		const updatedProfile = await User.findByIdAndUpdate(
			{ _id: userId },
			{ image: image.secure_url },
			{ new: true }
		);
		res.send({
			success: true,
			message: `Image Updated successfully`,
			data: updatedProfile,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getEnrolledCourses = async (req, res) => {
	try {
		const userId = req.user.id;
		let userDetails = await User.findOne({
			_id: userId,
		})
			.populate({
				path: "courses",
				populate: {
					path: "courseContent",
					populate: {
						path: "subSection",
					},
				},
			})
			.exec();

		userDetails = userDetails.toObject();
		var SubsectionLength = 0;
		for (var i = 0; i < userDetails.courses.length; i++) {
			let totalDurationInSeconds = 0;
			SubsectionLength = 0;
			for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
				totalDurationInSeconds += userDetails.courses[i].courseContent[
					j
				].subSection.reduce(
					(acc, curr) => acc + parseInt(curr.timeDuration),
					0
				);
				userDetails.courses[i].totalDuration = convertSecondsToDuration(
					totalDurationInSeconds
				);
				SubsectionLength +=
					userDetails.courses[i].courseContent[j].subSection.length;
			}
			let courseProgressCount = await CourseProgress.findOne({
				courseId: userDetails.courses[i]._id,
				userId: userId,
			});
			courseProgressCount = courseProgressCount?.completedVideos.length || 0;
			if (SubsectionLength === 0) {
				userDetails.courses[i].progressPercentage = 100;
			} else {
				// To make it up to 2 decimal point
				const multiplier = Math.pow(10, 2);
				userDetails.courses[i].progressPercentage =
					Math.round(
						(courseProgressCount / SubsectionLength) * 100 * multiplier
					) / multiplier;
			}
		}

		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find user with id: ${userDetails}`,
			});
		}

		console.log("userDetails.courses  --> ",userDetails.courses)

		return res.status(200).json({
			success: true,
			data: userDetails.courses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.instructorDashboard = async (req, res) => {
	try {
		const courseDetails = await Course.find({ instructor: req.user.id });

		const courseData = courseDetails.map((course) => {
			const totalStudentsEnrolled = course.studentsEnrolled.length;
			const totalAmountGenerated = totalStudentsEnrolled * course.price;

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			};
			return courseDataWithStats;
		});

		res.status(200).json({ courses: courseData });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
