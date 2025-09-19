import express from "express";
import User from "../Models/UserModel.js";
import { authenticateTokenUser } from "../Middleware/authCookie.js";
import Issue from "../Models/IssueModel.js";
const router = express.Router();

router.get("/reportedissues", authenticateTokenUser, async (req, res) => {
  const user = req.user;
  const email = user.email;
  try {
    const userID = await User.findOne({ email }).select("_id");
    if (!userID) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const issues = await Issue.find({ reportedBy: userID._id })
      .select("_id ID location description status imgURL priority createdAt reportedAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, issues: issues });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Couldnt fetch issues" });
  }
});

router.get("/user/profile", authenticateTokenUser, async (req, res) => {
    const user = req.user;
    const email = user.email;
    try{
        const userData = await User.findOne({email}).select('-password -__v -createdAt -updatedAt');
        if(!userData){
            return res.status(400).json({success:false, message:"User not found"});
        }
        return res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Couldnt fetch user data" });
    }
})

export default router;
