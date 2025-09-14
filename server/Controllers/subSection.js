const SubSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const {uploadFileToCloudinary} = require("../Utils/fileUploader");

require("dotenv").config;


// create sub section -->

exports.createSubSection = async (req,res) => {
    try {
        
        // fetch data
        const {title,description,sectionId} = req.body;

        const video = req.files.video;


        //validation

        if(!title || !description || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:"Please Fill All the Fields",
            })
        }

        // upload video to cloudinary

        const videoDetails = await uploadFileToCloudinary(video,process.env.Folder_Name);
        
        console.log("video details  --> ",videoDetails);

        //create subsection

        const newSubSection = await SubSection.create(
            {
                title,
                description,
                timeDuration:`${videoDetails.duration}`,
                videoUrl:videoDetails.secure_url
            }
        );

        // update section --> push sub section in sub section array

        const updatedSectionDetails = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                    subSection:newSubSection._id
                }
            },
            {new:true}
        ).populate("subSection").exec();

        //return responce

        return res.status(200).json({
            success:true,
            message:"Sub Section is created successfully",
            data:updatedSectionDetails,
        })
    } 
    
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"sub section is not creared , Due to server error",
            error:error.message,
        })
    }
}




// update sub section -->

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadFileToCloudinary(video,process.env.Folder_Name);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        );

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
};


// delete sub section -->

exports.deleteSubSection = async (req,res) => {
    try {
        
        //fetch data
        const {sectionId,subSectionId} = req.body;

        //validate
        if(!sectionId || !subSectionId){
            return res.status(400).json({
                success:false,
                message:"Please Fill All the fields",
            })
        }
        
        //delete sub section

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        //Sub section is not available
        if(!deletedSubSection){
            return res.status(404).json({
                success:false,
                message:"Sub Section Not Found",
            })
        }

        //update section --> pull sub section in sub section array of section

        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId,
            {
                $pull:{
                    subSection:deletedSubSection._id
                }
            }
        ).populate("subSection").exec();

        // return responce

        return res.status(200).json({
            success:true,
            message:"Sub-Section is deleted successfully",
            data:updatedSectionDetails
        })
    } 
    
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Sub-Section is not deleted , Due to server error",
            error:error.message,
        })
    }
}