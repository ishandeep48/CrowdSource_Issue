import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phNO:{
        type:String,
        unique:true
    },
    //ADD MORE KEYS HERE FOR MORE DATA LATER
})

export default mongoose.model("User",userSchema)