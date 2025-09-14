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

  // Data for chart displaying student info
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  // Data for chart displaying income info
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  // Chart options for better clarity
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right", // place legend on right side
        labels: {
          color: "white", // legend text color
          font: {
            size: 14, // bigger font for clarity
          },
          padding: 20, // spacing between legend items
          boxWidth: 20, // color box size
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
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
      <p className="text-lg font-semibold mb-4">Visualise</p>

      {/* Chart Toggle Buttons */}
      <div className="flex gap-x-4 mb-6">
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
      <div className="h-72">
        <Pie
          data={
            currChart === "students" ? chartDataForStudents : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
