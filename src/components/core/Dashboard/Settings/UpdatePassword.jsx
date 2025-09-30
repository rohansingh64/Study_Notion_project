import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function UpdatePassword() {
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const submitPasswordForm = async (data) => {
		console.log("password Data - ", data);
		try {
			await changePassword(token, data);
		} catch (error) {
			console.log("ERROR MESSAGE - ", error.message);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(submitPasswordForm)}>
				<div className="my-6 flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
					<h2 className="text-lg font-semibold text-richblack-5">
						Password
					</h2>
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1">
							<label htmlFor="oldPassword" className="lable-style">
								Current Password
							</label>
							<input
								type={showOldPassword ? "text" : "password"}
								id="oldPassword"
								placeholder="Enter Current Password"
								className="form-style"
								{...register("oldPassword", { required: true })}
							/>
							<span
								onClick={() => setShowOldPassword((prev) => !prev)}
								className="absolute right-3 top-[38px] cursor-pointer z-10"
							>
								{showOldPassword ? (
									<AiOutlineEyeInvisible />
								) : (
									<AiOutlineEye />
								)}
							</span>
							{errors.oldPassword && (
								<span className="text-yellow-100 text-xs">
									Please enter your Current Password.
								</span>
							)}
						</div>

						<div className="relative flex-1">
							<label htmlFor="newPassword" className="lable-style">
								New Password
							</label>
							<input
								type={showNewPassword ? "text" : "password"}
								id="newPassword"
								placeholder="Enter New Password"
								className="form-style"
								{...register("newPassword", { required: true })}
							/>
							<span
								onClick={() => setShowNewPassword((prev) => !prev)}
								className="absolute right-3 top-[38px] cursor-pointer z-10"
							>
								{showNewPassword ? (
									<AiOutlineEyeInvisible />
								) : (
									<AiOutlineEye />
								)}
							</span>
							{errors.newPassword && (
								<span className="text-yellow-100 text-xs">
									Please enter your New Password.
								</span>
							)}
						</div>
					</div>
				</div>
			</form>
		</>
	);
}
