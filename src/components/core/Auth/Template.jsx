import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse justify-between gap-y-10 py-10 md:flex-row md:gap-y-0 md:gap-x-10 lg:gap-x-16">
          {/* Left Section */}
          <div className="mx-auto w-full max-w-[500px] text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl leading-relaxed">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            <div className="mt-6">
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
          </div>

          {/* Right Section (Images) */}
          <div className="relative mx-auto w-full max-w-[500px]">
            <img
              src={frameImg}
              alt="Pattern"
              loading="lazy"
              className="w-full h-auto object-contain"
            />
            <img
              src={image}
              alt="Students"
              loading="lazy"
              className="absolute -top-3 right-3 z-10 w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%] h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template
