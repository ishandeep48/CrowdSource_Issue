import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        // unique:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    phone:{
        type:String,
        // unique:true
    },
    aadhaar:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user'],
        default:'user'
    }
    //ADD MORE KEYS HERE FOR MORE DATA LATER
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;