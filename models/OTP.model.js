import mongoose from "mongoose" ;

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    userData: {
        type : Object ,
        default : null
    }
} ,
    {timestamps: true}                                  
)

const OTP = mongoose.model("OTP", otpSchema)
export default OTP ;
