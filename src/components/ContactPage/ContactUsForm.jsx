import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-hot-toast";

import CountryCode from "../../data/countrycode.json";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import { useSelector } from "react-redux";

const ContactUsForm = () => {
	const [loading, setLoading] = useState(false);
	const { token } = useSelector((state) => state.auth);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	const submitContactForm = async (data) => {
		console.log("Form Data - ", data);
		try {
			setLoading(true);
			const res = await apiConnector(
				"POST",
				contactusEndpoint.CONTACT_US_API,
				data,
				{
					Authorization: `Bearer ${token}`,
				}
			);
			console.log("Email Res - ", res);

			toast.success("Your Message Sent Successfully");

			setLoading(false);
		} catch (error) {
			if (error.response) {
				console.log("Backend Error Response: ", error.response.data);
				console.log("Status Code: ", error.response.status);
			} else {
				console.log("Axios Error Message: ", error.message);
			}
			toast.error("Could Not Send Your Message");
			toast.error(error.response.data.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				email: "",
				firstName: "",
				lastName: "",
				messageInfo: "",
				contactNo: "",
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<form
			className="flex flex-col gap-7"
			onSubmit={handleSubmit(submitContactForm)}
		>
			<div className="flex flex-col gap-5 lg:flex-row">
				<div className="flex flex-col gap-2 lg:w-[48%]">
					<label htmlFor="firstName" className="lable-style">
						First Name
					</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						placeholder="Enter first name"
						className="form-style"
						{...register("firstName", { required: true })}
					/>
					{errors.firstName && (
						<span className="-mt-1 text-[12px] text-yellow-100">
							Please enter your name.
						</span>
					)}
				</div>
				<div className="flex flex-col gap-2 lg:w-[48%]">
					<label htmlFor="lastName" className="lable-style">
						Last Name
					</label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						placeholder="Enter last name"
						className="form-style"
						{...register("lastName", { required: true })}
					/>
					{errors.lastName && (
						<span className="-mt-1 text-[12px] text-yellow-100">
							Please enter your name.
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="lable-style">
					Email Address
				</label>
				<input
					style={{
						boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
					}}
					type="email"
					name="email"
					id="email"
					placeholder="Enter email address"
					className="form-style"
					{...register("email", { required: true })}
				/>
				{errors.email && (
					<span className="-mt-1 text-[12px] text-yellow-100">
						Please enter your Email address.
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="contactNo" className="lable-style">
					Phone Number
				</label>

				<div className="flex gap-5">
					<div className="flex w-[81px] flex-col gap-2">
						<select
							type="text"
							name="countrycode"
							id="countrycode"
							placeholder="Enter contact No"
							className="form-style"
							{...register("countrycode", { required: true })}
							style={{
								boxShadow:
									"inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
							}}
						>
							{CountryCode.map((ele, i) => {
								return (
									<option key={i} value={ele.code}>
										{ele.code} - {ele.country}
									</option>
								);
							})}
						</select>
					</div>
					<div className="flex w-[calc(100%-90px)] flex-col gap-2">
						<input
							type="number"
							name="contactNo"
							id="contactNo"
							placeholder="12345 67890"
							className="form-style"
							{...register("contactNo", {
								required: {
									value: true,
									message: "Please enter your Phone Number.",
								},
								maxLength: {
									value: 12,
									message: "Invalid Phone Number",
								},
								minLength: {
									value: 10,
									message: "Invalid Phone Number",
								},
							})}
						/>
					</div>
				</div>
				{errors.contactNo && (
					<span className="-mt-1 text-[12px] text-yellow-100">
						{errors.contactNo.message}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="messageInfo" className="lable-style">
					Message
				</label>
				<textarea
					name="messageInfo"
					id="messageInfo"
					cols="30"
					rows="7"
					placeholder="Enter your message here"
					className="form-style"
					{...register("messageInfo", { required: true })}
					style={{
						boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
					}}
				/>
				{errors.messageInfo && (
					<span className="-mt-1 text-[12px] text-yellow-100">
						Please enter your Message.
					</span>
				)}
			</div>

			<button
				disabled={loading}
				type="submit"
				className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
				!loading &&
				"transition-all duration-200 hover:scale-95 hover:shadow-none"
			}  disabled:bg-richblack-500 sm:text-[16px] `}
			>
				Send Message
			</button>
		</form>
	);
};

export default ContactUsForm;
