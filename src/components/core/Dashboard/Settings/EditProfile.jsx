import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const submitProfileForm = async (data) => {
		console.log("Form Data - ", data);
		try {
			dispatch(updateProfile(token, data));
		} catch (error) {
			console.log("ERROR MESSAGE - ", error.message);
		}
	};
	return (
		<>
			<form onSubmit={handleSubmit(submitProfileForm)}>
				{/* Profile Information */}
				<div className="my-6 flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
					<h2 className="text-lg font-semibold text-richblack-5">
						Profile Information
					</h2>

					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="firstName" className="lable-style">
								First Name
							</label>
							<input
								type="text"
								id="firstName"
								className="form-style"
								{...register("firstName", { required: true })}
								defaultValue={user?.firstName}
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="lastName" className="lable-style">
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								className="form-style"
								{...register("lastName", { required: true })}
								defaultValue={user?.lastName}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="dateOfBirth" className="lable-style">
								Date of Birth
							</label>
							<input
								type="date"
								id="dateOfBirth"
								className="form-style"
								{...register("dateOfBirth", { required: true })}
								defaultValue={user?.additionalDetails?.dateOfBirth}
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="gender" className="lable-style">
								Gender
							</label>
							<select
								id="gender"
								className="form-style"
								{...register("gender", { required: true })}
								defaultValue={user?.additionalDetails?.gender}
							>
								{genders.map((ele, i) => (
									<option key={i} value={ele}>
										{ele}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="contactNumber" className="lable-style">
								Contact Number
							</label>
							<input
								type="tel"
								id="contactNumber"
								className="form-style"
								{...register("contactNumber")}
								defaultValue={user?.additionalDetails?.contactNumber}
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label htmlFor="about" className="lable-style">
								About
							</label>
							<input
								type="text"
								id="about"
								className="form-style"
								{...register("about")}
								defaultValue={user?.additionalDetails?.about}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<button
						onClick={() => {
							navigate("/dashboard/my-profile");
						}}
						className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
					>
						Cancel
					</button>
					<IconBtn type="submit" text="Save" />
				</div>
			</form>
		</>
	);
}
