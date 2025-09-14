import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import ReactStars from "react-stars";

const CourseReviewModal = ({ setReviewModal }) => {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const { courseEntireData } = useSelector((state) => state.viewCourse);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setValue("courseExperience", "");
		setValue("courseRating", 0);
	}, []);

	const ratingChanged = (newRating) => {
		setValue("courseRating", newRating);
	};

	const onSubmit = async (data) => {
		await createRating(
			{
				courseId: courseEntireData._id,
				rating: data.courseRating,
				review: data.courseExperience,
			},
			token
		);
		setReviewModal(false);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-richblack-900 text-white rounded-lg max-w-lg w-full p-6 space-y-4">
				{/* Header */}
				<div className="flex justify-between items-center">
					<p className="text-xl font-bold">Add Review</p>
					<button
						onClick={() => setReviewModal(false)}
						className="text-red-500 hover:text-red-400 transition"
					>
						Close
					</button>
				</div>

				{/* User Info */}
				<div className="flex items-center gap-3">
					<img
						src={user?.image}
						alt="user"
						className="w-12 h-12 rounded-full object-cover"
					/>
					<div className="flex flex-col">
						<p className="font-semibold">
							{user?.firstName} {user?.lastName}
						</p>
						<p className="text-sm text-richblack-100">Posting Publicly</p>
					</div>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<ReactStars
						count={5}
						onChange={ratingChanged}
						size={24}
						activeColor="#ffd700"
					/>

					<div className="flex flex-col gap-1">
						<label htmlFor="courseExperience" className="font-semibold">
							Add Your Experience*
						</label>
						<textarea
							id="courseExperience"
							placeholder="Add Your Experience here"
							{...register("courseExperience", { required: true })}
							className="w-full min-h-[130px] p-2 rounded border border-richblack-700 bg-richblack-800 text-white focus:outline-none focus:border-yellow-500"
						/>
						{errors.courseExperience && (
							<span className="text-red-500 text-sm">
								Please add your experience
							</span>
						)}
					</div>

					<div className="flex justify-end gap-2 mt-2">
						<button
							type="button"
							onClick={() => setReviewModal(false)}
							className="bg-richblack-800 hover:bg-richblack-700 px-4 py-2 rounded transition"
						>
							Cancel
						</button>
						<IconBtn
							text="Save"
							className="bg-yellow-500 hover:bg-yellow-400 text-richblack-900 px-4 py-2 rounded transition"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CourseReviewModal;
