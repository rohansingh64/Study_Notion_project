const Course = require("../Models/Course");
const Section = require("../Models/Section");
const SubSection = require("../Models/SubSection");

// create section -->

exports.createSection = async (req, res) => {
	try {
		// fetch data
		const { sectionName, courseId } = req.body;

		//validation

		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Please Fill All the Fields",
			});
		}

		//create section

		const newSection = await Section.create({ sectionName });

		// update Course --> push section in course content

		const updatedCourseDetails = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		//return responce

		return res.status(200).json({
			success: true,
			message: "Section is created successfully",
			data: updatedCourseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Section is not creared , Due to server error",
			error: error.message,
		});
	}
};

// update section -->

exports.updateSection = async (req, res) => {
	try {
		//fetch data
		const { sectionId, sectionName, courseId } = req.body;

		//validate
		if (!sectionId || !sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Please Fill All the fields",
			});
		}

		//update section

		const updatedSection = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		// return responce with course details

		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		return res.status(200).json({
			success: true,
			message: "Section is updated successfully",
			updatedSection: updatedSection,
			data: course,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Section is not updated , Due to server error",
			error: error.message,
		});
	}
};

// delete section -->

exports.deleteSection = async (req, res) => {
	try {
		//fetch data
		const { sectionId, courseId } = req.body;

		//validate
		if (!sectionId || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Please Fill All the fields",
			});
		}

		const section = await Section.findById(sectionId);

		//section is not available
		if (!section) {
			return res.status(404).json({
				success: false,
				message: "Section Not Found",
			});
		}

		// before delete section ---> delete all sub-sections

		await SubSection.deleteMany({ _id: { $in: section.subSection } });

		//delete section

		const deletedSection = await Section.findByIdAndDelete(sectionId);

		//update course --> pull section in course content

		const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: deletedSection._id,
			},
		})
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// return responce

		return res.status(200).json({
			success: true,
			message: "Section is deleted successfully",
			data: updatedCourseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Section is not deleted , Due to server error",
			error: error.message,
		});
	}
};
