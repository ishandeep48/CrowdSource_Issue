import express from "express";
import User from "../Models/UserModel.js";
import { authenticateTokenUser } from "../Middleware/authCookie.js";
import Issue from "../Models/IssueModel.js";
import { getNearbyIssues, reCalculatePriority } from "../functions/helper.js";
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
    const issues = await Issue.find({ upvotes: userID._id })
      .select(
        "_id ID location description status imgURL priority createdAt reportedAt"
      )
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
  try {
    const userData = await User.findOne({ email }).select(
      "-password -__v -createdAt -updatedAt"
    );
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Couldnt fetch user data" });
  }
});

router.post("/user/nearbyissues", authenticateTokenUser, async (req, res) => {
  const { location, distance } = req.body;
  console.log(location);
  if (!location || !location.lat || !location.lng) {
    return res.json({ success: false, error: "Location is required" });
  }
  const nearbyIssues = await getNearbyIssues(location, distance * 1000);
  return res.status(200).json({ success: true, issues: nearbyIssues });
});

router.post("/user/upvote", authenticateTokenUser, async (req, res) => {
  try {
    const { issueID } = req.body;
    const user = req.user;

    const userDoc = await User.findOne({ email: user.email }).select("_id");
    if (!userDoc)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const issue = await Issue.findOne({ ID: issueID });
    if (!issue)
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });

    const userIndex = issue.upvotes.findIndex((id) => id.equals(userDoc._id));
    console.log(userIndex)
    if (userIndex !== -1) {
      return res.status(200).json({
        success: true,
        message: "User already upvoted",
        upvotes: issue.upvotes.length,
        code:"ALREADY"
      });
    } else {
      // Not yet upvoted, so add
      issue.upvotes.push(userDoc._id);
      issue.subscribers.push(userDoc._id);
      await issue.save();
      reCalculatePriority(issue.ID);
      return res
        .status(200)
        .json({
          success: true,
          message: "Upvote added",
          upvotes: issue.upvotes.length,
          code:"DONE",
          userAdded : userDoc._id
        });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
