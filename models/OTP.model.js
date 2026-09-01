const mongoose = require("mongoose");

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
        required: true,
        expires: 0
    },
    userData: {
        name: {
            type: String,
            trim: true
        },
        age: {
            type: Number,
            min: 0
        }
    }
});

module.exports = mongoose.model("OTP", otpSchema);