import User from "../models/User.model.js"
import OTP from "../models/OTP.model.js"
import bcrypt from "bcrypt";
import { decrypt } from "../utils/encryption.js";

const verifyRegisterOtp =async (req,res) => {
    try{
        const {email,otp}=req.body
        const otpData=await OTP.findOne({
            email:email.toLowerCase(),
        })
        if(!otpData){
            return res.status(400).json({
                success: false,
                message:"Invalid Otp"
            })
        }
        const isOtpValid = await bcrypt.compare(
            otp,
            otpData.otp
        );
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Otp"
            });
        }
        if(otpData.expiresAt<new Date()){
            return res.status(400).json({
                success: false,
                message:"Otp Expired"
            })
        }
        const decryptedPassword = decrypt(
            otpData.userData.password
        );
        const user=await User.create({
            ...otpData.userData,
            password: decryptedPassword,
            isVerified:true
        })
        await OTP.deleteOne({
            _id:otpData._id
        })
        return res.status(201).json({
            success: true,
            message:"Account verified successfully",
            user
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message:"Account verification Failed",
            error:e.message
        })
    }
}
export default verifyRegisterOtp