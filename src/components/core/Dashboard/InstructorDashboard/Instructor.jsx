import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

const Instructor = () => {
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const [loading, setLoading] = useState(false);
	const [instructorData, setInstructorData] = useState(null);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const getCourseDataWithStats = async () => {
			setLoading(true);

			const instructorApiData = await getInstructorData(token);
			const result = await fetchInstructorCourses(token);

			if (instructorApiData.length) setInstructorData(instructorApiData);
			if (result) setCourses(result);

			setLoading(false);
		};
		getCourseDataWithStats();
	}, []);

	const totalAmount = instructorData?.reduce(
		(acc, curr) => acc + curr.totalAmountGenerated,
		0
	);
	const totalStudents = instructorData?.reduce(
		(acc, curr) => acc + curr.totalStudentsEnrolled,
		0
	);

	return (
		<div className="text-white p-4 sm:p-6 space-y-8 font-inter">
			{/* Header */}
			<div className="bg-gradient-to-r from-richblue-500 to-blue-400 p-4 sm:p-6 rounded-2xl shadow-lg">
				<h1 className="text-2xl sm:text-3xl font-bold">
					Hi {user?.firstName} 👋
				</h1>
				<p className="text-richblack-25 mt-1 text-sm sm:text-base">
					Let's start something new today
				</p>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="spinner border-4 border-t-transparent border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
				</div>
			) : courses.length > 0 ? (
				<div className="space-y-8">
					{/* Stats + Chart */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
						{/* Chart */}
						<div className="lg:col-span-2 bg-richblack-800 rounded-2xl shadow-lg p-4 sm:p-6">
							<InstructorChart courses={instructorData} />
						</div>

						{/* Stats */}
						<div className="bg-richblack-800 rounded-2xl shadow-lg p-4 sm:p-6 space-y-3">
							<p className="text-lg font-semibold border-b border-richblack-600 pb-2">
								📊 Statistics
							</p>
							<div className="space-y-2 sm:space-y-3">
								<div className="flex justify-between items-center bg-richblue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
									<p className="text-sm sm:text-base text-richblack-5">
										Total Courses
									</p>
									<p className="font-bold text-yellow-50">
										{courses.length}
									</p>
								</div>
								<div className="flex justify-between items-center bg-caribbeangreen-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
									<p className="text-sm sm:text-base text-richblack-5">
										Total Students
									</p>
									<p className="font-bold text-caribbeangreen-5">
										{totalStudents}
									</p>
								</div>
								<div className="flex justify-between items-center bg-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
									<p className="text-sm sm:text-base text-richblack-5">
										Total Income
									</p>
									<p className="font-bold text-blue-5">
										₹{totalAmount}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Your Courses */}
					<div className="bg-richblack-800 rounded-2xl shadow-lg p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
							<p className="text-lg font-semibold mb-2 sm:mb-0">
								📚 Your Courses
							</p>
							<Link
								to="/dashboard/my-courses"
								className="text-blue-400 hover:underline text-sm sm:text-base"
							>
								View all
							</Link>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{courses.slice(0, 3).map((course) => (
								<div
									key={course._id}
									className="bg-richblack-700 rounded-xl overflow-hidden shadow hover:scale-105 hover:shadow-xl transition-transform duration-300"
								>
									<img
										src={course.thumbnail}
										alt={course.courseName}
										className="w-full h-40 sm:h-48 object-cover"
									/>
									<div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
										<p className="font-semibold text-richblack-5 text-sm sm:text-base">
											{course.courseName}
										</p>
										<div className="flex justify-between text-xs sm:text-sm text-richblack-200">
											<p>
												{course.studentsEnrolled.length} students
											</p>
											<p>₹{course.price}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="bg-richblack-800 rounded-2xl p-6 sm:p-10 text-center shadow-lg space-y-5">
					<p className="text-richblack-100 text-sm sm:text-base">
						You have not created any courses yet
					</p>
					<div>
						<Link
							to="/dashboard/addCourse"
							className="bg-blue-500 hover:bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-semibold transition text-sm sm:text-base mt-2"
						>
							➕ Create a Course
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default Instructor;
