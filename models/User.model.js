import mongoose from "mongoose" ;
import validator from "validator"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true , "Username is required"],
        trim:true,

    },
    email:{
        type:String,
        required:[true , "Email is required"],
        trim:true,
        unique:true,
        lowercase:true,
        validate(val){
            if(!validator.isEmail(val))
                throw new Error("Email is Invalid ")
        }

    },
    password:{
        type:String,
        required:[true , "password is required"],
        select:false,
    },
    phone:{
        type:String,
        default:"",
    },
    avatar:{
        type:String,
        default: "https://i.pinimg.com/736x/99/cc/be/99ccbe55629e4148de5f41d50fe6a028.jpg"
    },
    role:{
        type:String,
        enum:["admin" , "customer"],
        default:"customer"
    },
    addresses:[{
        street:String,
        city:String,
        state:String,
        postalCode:String,
        country:String,

    }],
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product" ///////// اسم الموديل بتاع ال product
        
    }],
    isVerified:{
        type:Boolean ,
        default:false
    },
    resetPasswordToken:{
        type:String ,
         
    },
    resetPasswordExpire:{
        type:Date ,
       
    }
}, {
    collection: 'User',
    timestamps: true
});

userSchema.pre('save' , async function (next) {
    
    if (!this.isModified('password')) return next(); // لو التعديل في حاجه تانيه غير الباسوورد اخرج متعملش تشفير
    this.password = await bcrypt.hash(this.password,8)
    next()
})

userSchema.methods.comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
    
} 


const User = mongoose.model('User', userSchema);
export default User;
