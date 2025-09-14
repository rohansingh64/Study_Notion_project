import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import Footer from "../components/common/Footer";

const CourseDetails = () => {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const { loading } = useSelector((state) => state.profile);
	const { paymentLoading } = useSelector((state) => state.course);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { courseId } = useParams();

	const [courseData, setCourseData] = useState(null);
	const [confirmationModal, setConfirmationModal] = useState(null);
	const [avgReviewCount, setAverageReviewCount] = useState(0);
	const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
	const [isActive, setIsActive] = useState([]);

	const handleActive = (id) => {
		setIsActive((prev) =>
			prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
		);
	};

	function convertSecondsToDuration(totalSeconds) {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = Math.floor((totalSeconds % 3600) % 60);
		if (hours > 0) return `${hours}h ${minutes}m`;
		if (minutes > 0) return `${minutes}m ${seconds}s`;
		return `${seconds}s`;
	}

	useEffect(() => {
		const getCourseFullDetails = async () => {
			try {
				const result = await fetchCourseDetails(courseId);
				setCourseData(result);
			} catch (error) {
				console.log("Could not fetch course details");
			}
		};
		getCourseFullDetails();
	}, [courseId]);

	useEffect(() => {
		const count = GetAvgRating(
			courseData?.data?.courseDetails.ratingAndReviews
		);
		setAverageReviewCount(count);
	}, [courseData]);

	useEffect(() => {
		let lectures = 0;
		courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
			lectures += sec.subSection.length || 0;
		});
		setTotalNoOfLectures(lectures);
	}, [courseData]);

	const handleBuyCourse = () => {
		if (token) {
			buyCourse(token, [courseId], user, navigate, dispatch);
			return;
		}
		setConfirmationModal({
			text1: "You are not logged in",
			text2: "Please login to purchase the course",
			btn1Text: "Login",
			btn2Text: "Cancel",
			btn1Handler: () => navigate("/login"),
			btn2Handler: () => setConfirmationModal(null),
		});
	};

	if (loading || !courseData) {
		return (
			<div className="flex items-center justify-center min-h-[50vh] text-lg text-richblack-300">
				Loading...
			</div>
		);
	}

	if (!courseData.success) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Error />
			</div>
		);
	}

	const {
		courseName,
		courseDescription,
		whatYouWillLearn,
		courseContent,
		ratingAndReviews,
		instructor,
		studentsEnrolled,
		createdAt,
	} = courseData.data?.courseDetails;

	const handleShare = () => {
		copy(window.location.href);
		toast.success("Link Copied to Clipboard");
	};

	return (
		<div>
			<div className="flex flex-col text-white bg-richblack-900 min-h-screen w-11/12">
				{/* Hero Section */}
				<div className=" flex flex-col bg-richblack-800 lg:flex-row gap-5 p-10 my-6 rounded-lg max-w-maxContent mx-auto">
					{/* Left Content */}
					<div className="  flex-1 space-y-5 p-5 rounded-xl ">
						<h1 className="text-4xl font-bold text-richblack-5">
							{courseName}
						</h1>
						<p className="text-richblack-200 text-base leading-relaxed">
							{courseDescription}
						</p>

						{/* Rating & Stats */}
						<div className="flex items-center flex-wrap gap-3 text-sm text-richblack-200">
							<span className="font-semibold text-yellow-50">
								{avgReviewCount}
							</span>
							<RatingStars
								Review_Count={avgReviewCount}
								Star_Size={20}
							/>
							<span>{`(${ratingAndReviews.length} reviews)`}</span>
							<span>{`· ${studentsEnrolled.length} students enrolled`}</span>
						</div>

						{/* Instructor */}
						<p className="text-richblack-100 text-sm">
							Created by{" "}
							<span className="font-semibold text-richblue-100">
								{instructor.firstName}
							</span>
						</p>

						{/* Meta Info */}
						<div className="flex gap-4 text-xs text-richblack-300">
							<span>Created at {formatDate(createdAt)}</span>
							<span>· English</span>
						</div>

						{/* Share Button */}
						<div className="flex justify-between mt-4 items-center w-3/6">
							<button
								onClick={handleShare}
								className="flex items-center gap-2 px-5 py-2 rounded-full 
          								bg-yellow-50 text-richblack-900 font-medium 
          								hover:bg-yellow-100 hover:scale-105 
          								transition-all duration-200 shadow-md"
							>
								🔗 Share
							</button>
						</div>
					</div>

					{/* Right Content */}
					<div>
						<div>
							<CourseDetailsCard
								course={courseData?.data?.courseDetails}
								setConfirmationModal={setConfirmationModal}
								handleBuyCourse={handleBuyCourse}
							/>
						</div>
					</div>
				</div>

				{/* What You Will Learn */}
				<div className="px-6 lg:px-24 py-12 max-w-maxContent  w-full">
					<div className="bg-richblack-800 rounded-md p-4">
						<h2 className="text-2xl font-semibold mb-6 text-richblack-5">
							What you'll learn
						</h2>
						<p className="text-richblack-200 leading-relaxed max-w-3xl">
							{whatYouWillLearn}
						</p>
					</div>
				</div>

				{/* Course Content */}
				<div className="px-6 lg:px-24 py-12 max-w-maxContent  w-full">
					<h2 className="text-2xl font-semibold mb-6 text-richblack-5">
						Course Content
					</h2>

					{/* Section stats + collapse button */}
					<div className="flex flex-wrap justify-between items-center text-sm text-richblack-300 mb-6">
						<div className="flex flex-wrap gap-4">
							<span>{courseContent.length} section(s)</span>
							<span>{totalNoOfLectures} lectures</span>
							<span>{courseData.data?.totalDuration} total length</span>
						</div>
						<button
							className="text-yellow-50 hover:underline transition"
							onClick={() => setIsActive([])}
						>
							Collapse all sections
						</button>
					</div>

					{/* Sections */}
					<div className="space-y-4">
						{courseContent.map((section, index) => (
							<div
								key={section._id}
								className="border border-richblack-700 rounded-lg overflow-hidden"
							>
								{/* Section header */}
								<button
									onClick={() => handleActive(section._id)}
									className="w-full flex justify-between items-center px-5 py-4 bg-richblack-800 hover:bg-richblack-700 transition-colors"
								>
									<span className="font-medium text-richblack-50 text-base flex items-center gap-2">
										{index + 1}. {section.sectionName}
										<span className="text-sm text-richblack-300">
											({section.subSection?.length || 0} lectures)
										</span>
									</span>

									<span className="text-sm text-yellow-50">
										{isActive.includes(section._id) ? "▲" : "▼"}
									</span>
								</button>

								{/* Subsections */}
								{isActive.includes(section._id) && (
									<div className="bg-richblack-900 px-6 py-4 space-y-4">
										{section.subSection.map((sub) => (
											<div
												key={sub._id}
												className="flex flex-col gap-1 border-b border-richblack-700 pb-4 last:border-none"
											>
												<div className="flex justify-between items-center">
													<p className="text-richblack-5 font-medium">
														{sub.title}
													</p>
													<span className="text-xs text-richblack-300">
														{convertSecondsToDuration(
															sub.timeDuration
														)}
													</span>
												</div>
												<p className="text-sm text-richblack-300">
													{sub.description}
												</p>
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="px-6 lg:px-24 py-12 max-w-maxContent  w-full">
					<h2 className="text-2xl font-semibold mb-6 text-richblack-5">
						Author
					</h2>
					<div className="flex items-center gap-x-4">
						<img
							src={instructor?.image}
							alt={`profile-${instructor?.firstName}`}
							className="aspect-square w-[78px] rounded-full object-cover"
						/>
						<div className="space-y-1">
							<p className="text-lg font-semibold text-richblack-5">
								{instructor?.firstName + " " + instructor?.lastName}
							</p>
							
						</div>
					</div>
				</div>

				{confirmationModal && (
					<ConfirmationModal modalData={confirmationModal} />
				)}
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
};

export default CourseDetails;
