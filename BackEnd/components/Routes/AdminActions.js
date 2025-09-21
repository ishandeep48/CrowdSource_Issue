import express from "express";
const router = express.Router();
import User from "../Models/UserModel.js";
import Issue from "../Models/IssueModel.js";
import { authenticateTokenAdmin } from "../Middleware/authCookie.js";

router.post("/admin/warnUser", authenticateTokenAdmin, async (req, res) => {
  try {
    const { ID,issueID } = req.body;
    const issue = await Issue.findOne({ ID:issueID });
    if (!issue) {
      return res.status(404).json({ success: false, error: "Issue not found" });
    }
    if(issue.status === "cancelled"){
        return res.json({ success: false, error: "Issue already cancelled" });
    }
    const user = await User.findOne({ _id: ID });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    issue.status = "cancelled";
    await issue.save();
    const warns = user.warns;
    if (warns < 2) {
      user.warns++;
      await user.save();
      // Notify User
      return res
        .status(200)
        .json({ success: true, data: "User warned", code: "WARN" });
    } else {
      user.blocked = true;
      user.warns = 3;
      await user.save();
      // Notify User
      return res
        .status(200)
        .json({ success: true, data: "User blocked", code: "BAN" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: "Couldnt warn user" });
  }
});

export default router;
