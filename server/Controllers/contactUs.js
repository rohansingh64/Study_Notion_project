const User = require("../Models/User");
const { isValidEmail } = require("../Utils/checkFormate");
const sendingMail = require("../Utils/mailSender");
const {contactUsEmailTemplate} = require("../Templates/contactUsTemplate");

exports.contactUs = async (req,res) => {
    try {

        const authEmail = req.user.email;
        
        const {firstName , lastName , email , contactNo , messageInfo} = req.body;

        if(!firstName || !lastName || !email || !contactNo || !messageInfo){
            return res.status(400).json({
                success:false,
                message:"fill all the fields"
            })
        }

        if(!isValidEmail(email)){
            return res.status(400).json({
                success:false,
                message:"email is in invalid formate"
            })
        }

        const existUser = await User.findOne({email});

        if(!existUser){
            return res.status(400).json({
                success:false,
                message:"User is not exists"
            })
        }


        if(authEmail !== email){
            return res.status(400).json({
                success:false,
                message:"filled email is different from your registered email"
            })
        }

        const title = `${firstName} ${lastName} have some message for you for Study-Notion`;

        const body = `${firstName} ${lastName} contacted you from ${email} 
                            
                        Message -->
                        
                        ${messageInfo}`;

        const toMail = "rohansinghrohansingh64@gmail.com";

        const responce = await sendingMail(toMail,title,body);

        console.log("responce ---> ",responce);

        const title2 = `Thank you for Contacting Study-Notion`;

        const body2 = contactUsEmailTemplate(email,firstName,lastName,messageInfo,contactNo);

        const acknowledgeMail = await sendingMail(email,title2,body2);

        console.log("acknowledgement ----> ",acknowledgeMail);

        return res.status(200).json({
            success:true,
            message:"email send successfully",
            responce,
            acknowledgeMail,
        })


    } catch (error) {

        console.log("error -> ",error);

        return res.status(500).json({
            success:false,
            message:"email is not send due to server error"
        })
    }
}