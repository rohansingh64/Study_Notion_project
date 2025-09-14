
const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file,folder,quality,height) => {


	const options = {
		folder: folder,
		resource_type: "auto",
	};

    if(quality){
        options.quality = quality
    }

    if(height){
        options.height = height
    }

	const result = await cloudinary.uploader.upload(file.tempFilePath, options);

	console.log("result --> ", result);

    return result;
};
