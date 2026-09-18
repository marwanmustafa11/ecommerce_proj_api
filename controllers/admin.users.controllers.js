import User from "../models/User.model.js"

export const getAllUsers=async(req,res)=>{
    const users = await User.find().select("-password").sort({ createdAt:-1 });
    return res.status(200).json({
        "success": true,
        users
    })
}
export const  getOneUser=async(req,res)=>{
    const {id}=req.params
    const found=await User.findById( id ).select("-password");
    if(!found){
        return res.status(404).json({
            "success": false,
            "message":"User not found"
        })
    }
    return res.status(200).json({
        "success": true,
        "user":found
    })
}

export const deleteUser=async(req,res)=>{
    const {id}=req.params
    const found=await User.findByIdAndDelete(id);
    if(!found){
        return res.status(404).json({
            "success": false,
            "message":"User not found"
        })
        }
    return res.status(200).json({
        "success": true,
        "message":"User deleted successfully"
    })
}
export const updateUserRole = async (req, res) => {
    const { role,id } = req.body;
    const found = await User.findById(id).select("-password");
    if (!found) {
        return res.status(404).json({
            "success": false,
            "message": "User not found"
        });
    }
    found.role = role;
    await found.save();
    return res.status(200).json({
        "success": true,
        "message": "User role updated successfully",
        "user": found
    });
};
export const addUser=async(req,res)=>{
    try{
    const{username,phone,password,email}=req.body
    if(!username ||!phone ||!password ||!email){
        return res.status(400).json({
            "success":false,
            "message":"All fields are required"
        })
    }
    const existingEmail=await User.findOne({email})
    if(existingEmail){
        return res.status(400).json({
            "success":false,
            "message":"Email already exists"
        }) 
    }
    const user=await User.create({
        username,
        phone,
        email,
        password
    })
    return res.status(201).json({
            "success":true,
            "message":"user created successfully",
            "user":{
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                addresses: user.addresses,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
    })
}
catch(error){
return res.status(500).json({
    success:false,
    message:error.message
})
}

}