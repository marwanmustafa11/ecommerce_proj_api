import User from "../models/User.model.js";

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { username, phone, avatar } = req.body;
        if (username !== undefined) {
            user.username = username;
        }
        if (phone !== undefined) {
            user.phone = phone;
        }
        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};