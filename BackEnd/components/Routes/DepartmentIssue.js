import express from "express";
const router = express.Router();
import Issue from "../Models/IssueModel.js";
import { authenticateTokenDept } from "../Middleware/authCookie.js";

router.post("/dept/issueCount", async (req, res) => {
  const dept = req.body.dept;
  const issues = await Issue.find({ department: dept });
  const total = issues.length;
  const inProgress = issues.filter(
    (issue) => issue.status === "forwarded"
  ).length;
  const resolved = issues.filter((issue) => issue.status === "resolved").length;
  const toSend = {
    total,
    inProgress,
    resolved,
  };
  res.status(200).json({ message: true, data: toSend });
});

router.get("/dept/allIssues", authenticateTokenDept, async (req, res) => {
  try {
    const user = req.user;
    const dept = user.department;
    console.log(dept);
    const issues = await Issue.find({
      department: dept,
        status: { $in: ["forwarded", "resolved"] }, // exclude both
    }).populate("reportedBy", "name email phone");
    res.status(200).json({ message: true, data: issues });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: false, error: "Couldnt fetch issues" });
  }
});

router.post("/dept/resolveIssue", authenticateTokenDept, async (req, res) => {
  try {
    const { issueID } = req.body;
    console.log(issueID);
    const issue = await Issue.findOne({ ID: issueID });
    if (!issue) {
      return res
        .json({ success: false, message: "Issue not found" });
        }
    issue.status = "resolved";
    await issue.save();
    return res.status(200).json({ success: true, message: "Issue resolved" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Couldnt resolve issue" });
  }
});
export default router;
