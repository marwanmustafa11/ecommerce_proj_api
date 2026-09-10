/*
controllers/
└── forgotPassword.controller.js

    ├── sendForgotPasswordOtp()
    ├── verifyForgotPasswordOtp()
    └── resetPassword()
*/
import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import sendEmail from "../utils/sendEmail.js";

const sendForgotPasswordOtp = async (req, res) =>
{
    try
    {
        const { email } = req.body;
        //const email = req.body.email;
        const user = await User.findOne({ email });
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
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        // new Date() : هتجيب الوقت الحالي اللي احنا فيه
        await OTP.create({
            email,
            otp,
            expiresAt: otpExpire
        });
        await sendEmail(
            email,
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
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otpData = await OTP.findOne({ email, otp }); 
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
        if (otpData.expiresAt < new Date())
        {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        const resetToken = Math.random().toString(36).substring(2);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        user.password = newPassword;
        await user.save();
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