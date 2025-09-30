import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      className={`w-full max-w-[360px] mx-auto sm:mx-0 rounded-lg transition-all duration-200
        ${isActive ? "bg-white shadow-[6px_6px_0_0] shadow-yellow-50" : "bg-richblack-800"} 
        text-richblack-25 cursor-pointer`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Top Content */}
      <div className="border-b-2 border-dashed border-richblack-400 p-4 sm:p-6 flex flex-col gap-3 min-h-[180px]">
        <h3
          className={`font-semibold text-base sm:text-lg md:text-xl ${
            isActive ? "text-richblack-800" : "text-richblack-25"
          }`}
        >
          {cardData?.heading}
        </h3>
        <p className="text-sm sm:text-base text-richblack-400 line-clamp-3">
          {cardData?.description}
        </p>
      </div>

      {/* Bottom Stats */}
      <div
        className={`flex justify-between items-center px-4 sm:px-6 py-3 text-sm sm:text-base font-medium ${
          isActive ? "text-blue-300" : "text-richblack-300"
        }`}
      >
        {/* Level */}
        <div className="flex items-center gap-2">
          <HiUsers className="text-lg sm:text-xl" />
          <p>{cardData?.level}</p>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-2">
          <ImTree className="text-lg sm:text-xl" />
          <p>{cardData?.lessionNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
