import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteProfile } from "../../../../services/operations/SettingsAPI";

export default function DeleteAccount() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function handleDeleteAccount() {
		try {
			dispatch(deleteProfile(token, navigate));
		} catch (error) {
			console.log("ERROR MESSAGE - ", error.message);
		}
	}

	return (
		<>
			<div className="my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-md border border-pink-700 bg-pink-900 p-6 md:p-8">
				<div className="flex items-center justify-center w-14 h-14 rounded-full bg-pink-700">
					<FiTrash2 className="text-3xl text-pink-200" />
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-richblack-5">
						Delete Account
					</h2>
					<div className="text-pink-25 text-sm">
						<p>Would you like to delete account?</p>
						<p>
							This account may contain Paid Courses. Deleting your
							account is permanent.
						</p>
					</div>
					<button
						type="button"
						className="italic text-pink-300"
						onClick={handleDeleteAccount}
					>
						I want to delete my account.
					</button>
				</div>
			</div>
		</>
	);
}
