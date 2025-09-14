import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
	const { courseId, sectionId, subSectionId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const playerRef = useRef();
	const { token } = useSelector((state) => state.auth);
	const { courseSectionData, courseEntireData, completedLectures } =
		useSelector((state) => state.viewCourse);

	const [videoData, setVideoData] = useState([]);
	const [videoEnded, setVideoEnded] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const setVideoSpecificDetails = async () => {
			if (!courseSectionData.length) return;
			if (!courseId && !sectionId && !subSectionId) {
				navigate("/dashboard/enrolled-courses");
			} else {
				//let's assume k all 3 fields are present

				const filteredData = courseSectionData.filter(
					(course) => course._id === sectionId
				);

				const filteredVideoData = filteredData?.[0].subSection.filter(
					(data) => data._id === subSectionId
				);

				setVideoData(filteredVideoData[0]);
				setVideoEnded(false);
			}
		};
		setVideoSpecificDetails();
	}, [courseSectionData, courseEntireData, location.pathname]);

	const isFirstVideo = () => {
		const currentSectionIndex = courseSectionData.findIndex(
			(data) => data._id === sectionId
		);

		const currentSubSectionIndex = courseSectionData[
			currentSectionIndex
		].subSection.findIndex((data) => data._id === subSectionId);
		if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
			return true;
		} else {
			return false;
		}
	};

	const isLastVideo = () => {
		const currentSectionIndex = courseSectionData.findIndex(
			(data) => data._id === sectionId
		);

		const noOfSubSections =
			courseSectionData[currentSectionIndex].subSection.length;

		const currentSubSectionIndex = courseSectionData[
			currentSectionIndex
		].subSection.findIndex((data) => data._id === subSectionId);

		if (
			currentSectionIndex === courseSectionData.length - 1 &&
			currentSubSectionIndex === noOfSubSections - 1
		) {
			return true;
		} else {
			return false;
		}
	};

	const goToNextVideo = () => {
		const currentSectionIndex = courseSectionData.findIndex(
			(data) => data._id === sectionId
		);

		const noOfSubSections =
			courseSectionData[currentSectionIndex].subSection.length;

		const currentSubSectionIndex = courseSectionData[
			currentSectionIndex
		].subSection.findIndex((data) => data._id === subSectionId);

		if (currentSubSectionIndex !== noOfSubSections - 1) {
			//same section ki next video me jao
			const nextSubSectionId =
				courseSectionData[currentSectionIndex].subSection[
					currentSectionIndex + 1
				]._id;
			//next video pr jao
			navigate(
				`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
			);
		} else {
			//different section ki first video
			const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
			const nextSubSectionId =
				courseSectionData[currentSectionIndex + 1].subSection[0]._id;
			///iss voide par jao
			navigate(
				`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
			);
		}
	};

	const goToPrevVideo = () => {
		const currentSectionIndex = courseSectionData.findIndex(
			(data) => data._id === sectionId
		);

		const noOfSubSections =
			courseSectionData[currentSectionIndex].subSection.length;

		const currentSubSectionIndex = courseSectionData[
			currentSectionIndex
		].subSection.findIndex((data) => data._id === subSectionId);

		if (currentSubSectionIndex != 0) {
			//same section , prev video
			const prevSubSectionId =
				courseSectionData[currentSectionIndex].subSection[
					currentSubSectionIndex - 1
				];
			//iss video par chalge jao
			navigate(
				`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
			);
		} else {
			//different section , last video
			const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
			const prevSubSectionLength =
				courseSectionData[currentSectionIndex - 1].subSection.length;
			const prevSubSectionId =
				courseSectionData[currentSectionIndex - 1].subSection[
					prevSubSectionLength - 1
				]._id;
			//iss video par chalge jao
			navigate(
				`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
			);
		}
	};

	const handleLectureCompletion = async () => {
		///dummy code, baad me we will replace it witht the actual call
		setLoading(true);
		//PENDING - > Course Progress PENDING
		const res = await markLectureAsComplete(
			{ courseId: courseId, subSectionId: subSectionId },
			token
		);
		//state update
		if (res) {
			dispatch(updateCompletedLectures(subSectionId));
		}
		setLoading(false);
	};
	return (
		<div className="flex flex-col gap-4 p-4 bg-richblack-900 text-white min-h-screen">
			{!videoData ? (
				<div className="text-center text-richblack-100 py-20">
					No Data Found
				</div>
			) : (
				<div className="flex flex-col gap-4">
					<div className="w-full max-w-3xl mx-auto h-[360px] md:h-[480px]">
						<Player
							ref={playerRef}
							aspectRatio="16:9"
							playsInline
							onEnded={() => setVideoEnded(true)}
							src={videoData?.videoUrl}
							className="rounded-lg overflow-hidden w-full h-full"
						/>
					</div>

					<h1 className="text-xl font-edu-sa mt-2">{videoData?.title}</h1>
					<p className="text-richblack-100">{videoData?.description}</p>

					{videoEnded && (
						<div className="flex flex-col gap-3 mt-4">
							{!completedLectures.includes(subSectionId) && (
								<IconBtn
									disabled={loading}
									onclick={handleLectureCompletion}
									text={!loading ? "Mark As Completed" : "Loading..."}
									className="bg-yellow-500 hover:bg-yellow-400 text-richblack-900 rounded py-2 px-4 font-bold transition"
								/>
							)}

							<IconBtn
								disabled={loading}
								onclick={() => {
									if (playerRef?.current) {
										playerRef.current?.seek(0);
										setVideoEnded(false);
									}
								}}
								text="Rewatch"
								customClasses="bg-blue-500 hover:bg-blue-400 text-white rounded py-2 px-4 transition"
							/>

							<div className="flex gap-2">
								{!isFirstVideo() && (
									<button
										disabled={loading}
										onClick={goToPrevVideo}
										className="bg-richblack-800 hover:bg-richblack-700 text-white rounded py-2 px-4 transition"
									>
										Prev
									</button>
								)}
								{!isLastVideo() && (
									<button
										disabled={loading}
										onClick={goToNextVideo}
										className="bg-richblack-800 hover:bg-richblack-700 text-white rounded py-2 px-4 transition"
									>
										Next
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default VideoDetails;
