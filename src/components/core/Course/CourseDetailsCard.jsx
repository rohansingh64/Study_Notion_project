import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { IoMdArrowDropupCircle } from "react-icons/io";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

	const [isOpen, setIsOpen] = useState(false); // toggle for "This Course Includes"

	const handleAddToCart = () => {
		if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
			toast.error("You are an Instructor, you cant buy a course");
			return;
		}
		if (token) {
			dispatch(addToCart(course));
			return;
		}
		setConfirmationModal({
			text1: "You are not logged in",
			text2: "Please login to add to cart",
			btn1Text: "Login",
			btn2Text: "Cancel",
			btn1Handler: () => navigate("/login"),
			btn2Handler: () => setConfirmationModal(null),
		});
	};

	

	return (
		<div className="bg-richblack-700 text-white rounded-xl p-6 w-[400px] space-y-2">
			{/* Thumbnail */}
			<img
				src={ThumbnailImage}
				alt="Thumbnail Image"
				className="max-h-[300px] min-h-[180px] w-full rounded-xl object-cover shadow-md"
			/>

			{/* Price */}
			<div className="text-2xl font-bold text-yellow-400">
				₹ {CurrentPrice}
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col gap-y-4">
				<button
					className="bg-yellow-400 text-gray-900 font-semibold px-5 py-3 rounded-lg shadow-md 
                     hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all duration-200"
					onClick={
						user && course?.studentsEnrolled.includes(user?._id)
							? () => navigate("/dashboard/enrolled-courses")
							: handleBuyCourse
					}
				>
					{user && course?.studentsEnrolled.includes(user?._id)
						? "Go to Course"
						: "Buy Now"}
				</button>

				{!course?.studentsEnrolled.includes(user?._id) && (
					<button
						onClick={handleAddToCart}
						className="bg-yellow-50 text-gray-900 font-semibold px-5 py-3 rounded-lg shadow-md 
                       hover:bg-yellow-100 hover:scale-105 active:scale-95 transition-all duration-200"
					>
						Add to Cart
					</button>
				)}
			</div>

			{/* Guarantee & Course Includes */}
			<div className="border-t border-gray-700 pt-4 space-y-3">
				<p className="text-sm text-gray-300">30-Day Money-Back Guarantee</p>

				{/* Toggle Header */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex justify-between items-center w-full text-left font-semibold text-lg"
				>
					<span>This Course Includes...</span>
					<span className="text-yellow-400 text-sm">
						{isOpen ? <IoMdArrowDropupCircle size={25}/> : <MdOutlineArrowDropDownCircle size={25} />}
					</span>
				</button>

				{/* Collapsible Content */}
				{isOpen && (
					<div className="flex flex-col gap-y-2 text-sm text-gray-300 mt-2">
						{course?.instructions?.map((item, index) => (
							<p key={index} className="flex gap-2 items-start">
								<span>✅</span>
								<span>{item}</span>
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default CourseDetailsCard;
