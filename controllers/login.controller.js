import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const login = async (req, res) => {
    try {
        const { email , password } = req.body;
        if(!email || !password){
            return res.status(400).json({error: "Email and password are required"});
        }
        
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password"
             });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password"
             });
        }

        if(!user.isVerified){
            return res.status(403).json({ 
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        const payload = {
            _id: user._id.toString(),
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const userData = user.toObject()
        delete userData.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error", 
        });
        console.error(error)
    }
}