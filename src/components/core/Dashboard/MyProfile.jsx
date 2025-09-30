import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  console.log("user -> ", user)

  return (
    <>
      <h1 className="mb-8 text-2xl md:text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-20 h-20 rounded-full object-cover"
          />
          <div className="space-y-1 text-center md:text-left">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300 break-all">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="my-8 flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium leading-relaxed`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Personal Details */}
      <div className="my-8 flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* Two-column grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5 break-all">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5 break-all">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
