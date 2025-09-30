import { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  // Track if mobile sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div
        className={`h-full flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-0 sm:ml-64" : ""
        }`}
      >
        <div className="mx-auto w-11/12 max-w-[1000px] py-6 sm:py-10 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
