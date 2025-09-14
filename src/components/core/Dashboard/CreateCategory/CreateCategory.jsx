import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { toast } from "react-hot-toast";
import { creatingCategory } from "../../../../services/operations/createCategory";

export default function CreateCategory() {
	const { token } = useSelector((state) => state.auth);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm();

	const onSubmit = async (data) => {
		if (!token) {
			toast.error("You must be logged in to create a category");
			return;
		}
		const result = await creatingCategory(data, token);
		if (result?._id) {
			toast.success("Category created successfully ✅");
			reset();
		}
	};

	return (
		<div className="bg-richblack-900 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-richblack-800 rounded-xl shadow-lg p-8">
				<h1 className="text-2xl font-bold text-white mb-6">
					Create New Category
				</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Category Name */}
					<div>
						<label className="block text-sm font-medium text-richblack-100 mb-2">
							Category Name
						</label>
						<input
							type="text"
							placeholder="Enter category name"
							{...register("name", { required: "Name is required" })}
							className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-50"
						/>
						{errors.name && (
							<p className="text-pink-200 text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-richblack-100 mb-2">
							Description
						</label>
						<textarea
							rows="4"
							placeholder="Enter category description"
							{...register("description", {
								required: "Description is required",
							})}
							className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-50"
						></textarea>
						{errors.description && (
							<p className="text-pink-200 text-sm mt-1">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-yellow-50 text-black font-semibold py-2 rounded-lg hover:bg-yellow-25 transition disabled:opacity-50"
					>
						{isSubmitting ? "Creating..." : "Create Category"}
					</button>
				</form>
			</div>
		</div>
	);
}
