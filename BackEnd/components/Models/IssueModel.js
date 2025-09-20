import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  reportedAt: {
    type: Date,
    // required: true,
    default:Date.now()
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  status:{
    type:String,
    // required:true,
    enum:["reported","reviewed","forwarded","resolved","cancelled"],
    default:"reported"
  },
  location:{
    type:{
        lat:{
            type:Number,
            required:true
        },
        lng:{
            type:Number,
            required:true
        }
    },
    required:true
  },
  priority:{
    type:String,
    required:true,
    enum:["low", "medium", "high", "critical"]
  },
  description:{
    type:String
  },
  imgURL:{
    type:String,
    // commented the below cause there will be tests as this is in development rn
    // required:true,
    unique:true
  },
  department:{
    type:String,
    // commented the below cause there will be tests as this is in development rn
    // required:true,
    // enum:[]
  }
});

const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);

export default Issue;