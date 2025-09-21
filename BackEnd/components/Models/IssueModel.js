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
    default: Date.now(),
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  status: {
    type: String,
    // required:true,
    enum: ["reported", "forwarded", "resolved", "cancelled"],
    default: "reported",
  },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high", "critical"],
  },
  description: {
    type: String,
  },
  imgURL: {
    type: String,
    // commented the below cause there will be tests as this is in development rn
    // required:true,
    unique: true,
  },
  department: {
    type: String,
    // commented the below cause there will be tests as this is in development rn
    // required:true,
    // enum:[]
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  state:{
    type:String,
  }
});
issueSchema.index({ location: "2dsphere" });
const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);

export default Issue;
