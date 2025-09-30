import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="w-full relative flex flex-col items-center px-4 sm:px-6 lg:px-12">
      {/* Title */}
      <div className="text-center my-10 max-w-2xl">
        <h2 className="text-lg sm:text-3xl md:text-4xl font-semibold">
          Unlock the <HighlightText text="Power of Code" />
        </h2>
        <p className="text-xs sm:text-base md:text-lg font-medium mt-2 text-richblack-300">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-full max-w-4xl overflow-x-auto scrollbar-hide gap-3 sm:gap-5 bg-richblack-800 text-richblack-200 p-1 rounded-full drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((ele, index) => (
          <button
            key={index}
            onClick={() => setMyCards(ele)}
            className={`flex-shrink-0 px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-all duration-200 whitespace-nowrap ${
              currentTab === ele
                ? "bg-richblack-900 text-richblack-5 font-semibold"
                : "hover:bg-richblack-900 hover:text-richblack-5"
            }`}
          >
            {ele}
          </button>
        ))}
      </div>

      {/* Courses */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {courses.map((ele, index) => (
          <CourseCard
            key={index}
            cardData={ele}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
