import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
	const [currChart, setCurrChart] = useState("students");

	// Function to generate random colors
	const getRandomColors = (numColors) => {
		const colors = [];
		for (let i = 0; i < numColors; i++) {
			const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
				Math.random() * 256
			)}, ${Math.floor(Math.random() * 256)})`;
			colors.push(color);
		}
		return colors;
	};

	const chartDataForStudents = {
		labels: courses.map((course) => course.courseName),
		datasets: [
			{
				data: courses.map((course) => course.totalStudentsEnrolled),
				backgroundColor: getRandomColors(courses.length),
			},
		],
	};

	const chartDataForIncome = {
		labels: courses.map((course) => course.courseName),
		datasets: [
			{
				data: courses.map((course) => course.totalAmountGenerated),
				backgroundColor: getRandomColors(courses.length),
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false, // allows chart to scale freely
		plugins: {
			legend: {
				display: true,
				position: window.innerWidth < 768 ? "bottom" : "right", // bottom on mobile
				labels: {
					color: "white",
					font: { size: 14 },
					padding: 15,
					boxWidth: 20,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.label || "";
						let value = context.raw || 0;
						return `${label}: ${value}`;
					},
				},
			},
		},
	};

	return (
		<div className="bg-richblack-800 text-white p-4 sm:p-6 rounded-xl shadow-md w-full">
			<p className="text-lg font-semibold mb-4">Visualise</p>

			{/* Chart Toggle Buttons */}
			<div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
				<button
					onClick={() => setCurrChart("students")}
					className={`px-4 py-2 rounded-lg font-medium transition ${
						currChart === "students"
							? "bg-blue-500 text-white"
							: "bg-gray-700 hover:bg-gray-600"
					}`}
				>
					Students
				</button>
				<button
					onClick={() => setCurrChart("income")}
					className={`px-4 py-2 rounded-lg font-medium transition ${
						currChart === "income"
							? "bg-blue-500 text-white"
							: "bg-gray-700 hover:bg-gray-600"
					}`}
				>
					Income
				</button>
			</div>

			{/* Chart */}
			<div className="w-full h-72 sm:h-96">
				<Pie
					data={
						currChart === "students"
							? chartDataForStudents
							: chartDataForIncome
					}
					options={options}
				/>
			</div>
		</div>
	);
};

export default InstructorChart;
