import { useEffect, useRef, useState } from "react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  editData = null,
  video = false, // <-- New prop to handle video
  viewData = null // optional pre-filled data for view
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(editData || viewData || "");
  const inputRef = useRef(null);

  // Register field with react-hook-form
  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  // Set value to react-hook-form
  useEffect(() => {
    setValue(name, file);
  }, [file, name, setValue]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (!video) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        // For video, create a local URL
        setPreview(URL.createObjectURL(selected));
      }
    }
  };

  // Handle cancel
  const handleCancel = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview("");
    setValue(name, null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div
        onClick={() => inputRef.current.click()}
        className="flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 bg-richblack-700"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept={video ? "video/*" : "image/*"}
        />

        {preview ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <video
                src={preview}
                controls
                className="h-full w-full rounded-md object-cover"
              />
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="mt-3 text-richblack-400 underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <span className="text-yellow-50 text-2xl">+</span>
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Click to upload {video ? "a video" : "an image"}
            </p>
            {!video && (
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            )}
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
