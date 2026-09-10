import User from "../models/User.model.js"
import OTP from "../models/OTP.model.js"

const verifyOtp=async (req,res) => {
    try{
        const {email,otp}=req.body
        const otpData=await OTP.findOne({
            email:email.toLowerCase(),
            otp
        })
        if(!otpData){
            return res.status(400).json({
                status:"fail",
                message:"Invalid Otp"
            })
        }
        if(otpData.expiresAt<new Date()){
            return res.status(400).json({
                status:"fail",
                message:"Otp Expired"
            })
        }
        const user=await User.create({
            ...otpData.userData,
            isVerified:true
        })
        await OTP.deleteOne({
            _id:otpData._id
        })
        return res.status(201).json({
            status:"success",
            message:"Account verified successfull",
            user
        })
    }
    catch(e){
        console.error("Error while verify Otp",e);
        return res.status(500).json({
            status:"Failed",
            message:"Account verified Failed",
            error:e.message
        })
    }
}
export default verifyOtp