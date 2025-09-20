import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin'],
        default:'admin'
    },
    department:{
        type:String,
    }
    // May add more data here in the future
})
export default mongoose.model("Admin", adminSchema);