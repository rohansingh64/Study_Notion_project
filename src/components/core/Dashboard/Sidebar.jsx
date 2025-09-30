import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { HiOutlineMenu } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isOpen, setIsOpen] = useState(false) // mobile drawer toggle

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r border-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="sm:hidden fixed top-20 right-4 z-50 p-2 bg-richblack-700 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <HiOutlineMenu className="text-white text-2xl" />
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-richblack-800 py-10 text-white transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative sm:h-[calc(100vh-3.5rem)] sm:w-56 sm:flex flex-col border-r border-richblack-700
        `}
      >
        <div className="flex flex-col px-4 sm:px-0">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col px-4 sm:px-0">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="mt-2 px-4 py-2 text-sm font-medium text-richblack-300 flex items-center gap-2"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
