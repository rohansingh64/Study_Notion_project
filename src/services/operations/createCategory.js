import React from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { categories } from "../apis";

export const creatingCategory = async (data, token) => {
	const toastId = toast.loading("Loading...");
	let result = null;
	try {
		const response = await apiConnector(
			"POST",
			categories.CREATE_CATEGORIES_API,
			data,
			{
				"Content-Type": "multipart/form-data",
				authorization: `Bearer ${token}`,
			}
		);

		console.log("create category response --> ", response);

		if (!response?.data?.success)
			throw new Error("Could not Create Category");

		result = response?.data?.category;
        
	} catch (error) {
		console.log("Create category DATA API ERROR....", error);
		toast.error(error.message);
		result = error.response?.data;
	}
	toast.dismiss(toastId);
	return result;
};
