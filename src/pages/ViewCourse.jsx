import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
	setCompletedLectures,
	setCourseSectionData,
	setEntireCourseData,
	setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
	const [reviewModal, setReviewModal] = useState(false);
	const { courseId } = useParams();
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		const setCourseSpecificDetails = async () => {
			const courseData = await getFullDetailsOfCourse(courseId, token);
			dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
			dispatch(setEntireCourseData(courseData.courseDetails));
			dispatch(setCompletedLectures(courseData.completedVideos));
			let lectures = 0;
			courseData?.courseDetails?.courseContent?.forEach((sec) => {
				lectures += sec.subSection.length;
			});
			dispatch(setTotalNoOfLectures(lectures));
		};
		setCourseSpecificDetails();
	}, []);

	return (
		<>
			<div className="flex min-h-screen bg-richblack-900 text-white">
				{/* Sidebar */}
				<div className="w-80 sticky top-0 h-screen overflow-y-auto border-r border-richblack-800">
					<VideoDetailsSidebar setReviewModal={setReviewModal} />
				</div>

				{/* Main Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<Outlet />
				</div>
			</div>

			{/* Review Modal */}
			{reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
		</>
	);
};

export default ViewCourse;
