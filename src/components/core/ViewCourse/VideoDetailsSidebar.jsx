import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

const VideoDetailsSidebar = ({ setReviewModal }) => {
	const [activeStatus, setActiveStatus] = useState("");
	const [videoBarActive, setVideoBarActive] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const { sectionId, subSectionId } = useParams();
	const {
		courseSectionData,
		courseEntireData,
		totalNoOfLectures,
		completedLectures,
	} = useSelector((state) => state.viewCourse);

	useEffect(() => {
		const setActiveFlags = () => {
			if (!courseSectionData.length) return;
			const currentSectionIndex = courseSectionData.findIndex(
				(data) => data._id === sectionId
			);
			const currentSubSectionIndex = courseSectionData?.[
				currentSectionIndex
			]?.subSection.findIndex((data) => data._id === subSectionId);
			const activeSubSectionId =
				courseSectionData[currentSectionIndex]?.subSection?.[
					currentSubSectionIndex
				]?._id;
			//set current section here
			setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
			//set current sub-section here
			setVideoBarActive(activeSubSectionId);
		};
		setActiveFlags();
	}, [courseSectionData, courseEntireData, location.pathname]);

	return (
		<div className="text-white font-inter flex flex-col gap-4 p-4 bg-richblack-900 h-full overflow-y-auto">
			{/* Buttons */}
			<div className="flex justify-between items-center mb-4">
				<button
					className="text-blue-300 hover:text-blue-200 font-semibold transition"
					onClick={() => navigate("/dashboard/enrolled-courses")}
				>
					← Back
				</button>

				<IconBtn
					text="Add Review"
					onclick={() => setReviewModal(true)}
					className="bg-yellow-500 hover:bg-yellow-400 text-richblack-900 px-3 py-1 rounded transition font-bold"
				/>
			</div>

			{/* Course title */}
			<div className="mb-4">
				<p className="text-lg font-edu-sa">
					{courseEntireData?.courseName}
				</p>
				<p className="text-sm text-richblack-100">
					{completedLectures?.length} / {totalNoOfLectures} Lectures
					Completed
				</p>
			</div>

			{/* Sections */}
			<div className="space-y-2">
				{courseSectionData.map((course) => (
					<div key={course._id}>
						<div
							className="flex justify-between items-center p-3 bg-richblack-800 rounded cursor-pointer hover:bg-richblack-700 transition"
							onClick={() => setActiveStatus(course._id)}
						>
							<span className="font-semibold">
								{course?.sectionName}
							</span>
							<span
								className={`transform transition-transform ${
									activeStatus === course._id ? "rotate-180" : ""
								}`}
							>
								▼
							</span>
						</div>

						{activeStatus === course._id && (
							<div className="ml-4 flex flex-col gap-2 mt-1">
								{course.subSection.map((topic) => (
									<div
										key={topic._id}
										className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
											videoBarActive === topic._id
												? "bg-yellow-200 text-richblack-900"
												: "bg-richblack-800 text-white hover:bg-richblack-700"
										}`}
										onClick={() => {
											navigate(
												`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
											);
											setVideoBarActive(topic._id);
										}}
									>
										<input
											type="checkbox"
											checked={completedLectures.includes(topic._id)}
											onChange={() => {}}
											className="w-4 h-4 accent-yellow-500"
										/>
										<span className="text-sm">{topic.title}</span>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default VideoDetailsSidebar;
