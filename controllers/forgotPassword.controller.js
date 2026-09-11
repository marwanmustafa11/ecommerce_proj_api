/*
controllers/
└── forgotPassword.controller.js

    ├── sendForgotPasswordOtp()
    ├── verifyForgotPasswordOtp()
*/
import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

const sendForgotPasswordOtp = async (req, res) =>
{
    try
    {
        const { email } = req.body
        const user = await User.findOne({ email : email.toLowerCase() });
        if (!user)
        {
            // 404 User Not Found
            return res.status(404).json
            ({
                success: false,
                message: "User not found"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        // new Date() : هتجيب الوقت الحالي اللي احنا فيه
        await OTP.deleteMany({
            email: email.toLowerCase()
        });
        await OTP.create({
            email: email.toLowerCase(),
            otp: hashedOtp,
            expiresAt: otpExpire,
            type: "forgot-password"
        });
        await sendEmail(
            email.toLowerCase(),
            "Password Reset OTP",
            `Your OTP is ${otp}`
        );
        return res.status(200).json({
            success: true,
            message: "Reset OTP sent successfully"
        });
    }
    catch (error)
    {
        return res.status(500).json
        ({
            success: false,
            message: error.message
        });
    }
};

const verifyForgotPasswordOtp = async (req, res) =>
{
    try
    {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otpData = await OTP.findOne({ email: email.toLowerCase() }); 
        /*
        هخزن فيها الدكيومين بتاعت الاسكيما موديل او تي بي اللي الايميل فيها و ال اوتي بي فيها زي اللي انا باعتهم فالريك بادي
        */
       if (!otpData)
       {
           return res.status(400).json({
               success: false,
               message: "Invalid or expired OTP"
           });
       }
       const isOtpValid = await bcrypt.compare(
            otp,
            otpData.otp
        );
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        if (otpData.expiresAt < new Date())
        {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        // const resetToken = Math.random().toString(36).substring(2);
        // user.resetPasswordToken = resetToken;
        // user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        user.password = newPassword;
        await user.save();
        await OTP.deleteOne({
            _id: otpData._id
        });
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp
};