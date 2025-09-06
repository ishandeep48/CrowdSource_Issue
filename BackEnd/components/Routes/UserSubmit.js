import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cloudinary from "../Middleware/cloudinary.js";
import Issue from "../Models/IssueModel.js";
import { randomID } from "../functions/helper.js";

const router = express.Router();
const upload = multer();

router.post("/submitissue", upload.single("pic"), async (req, res) => {
  let tempPic = "";
  try {
    const data = JSON.parse(req.body.data);
    const ext = req.file.originalname.split(".").pop();
    // store the pic in a temporary location
    tempPic = path.join(
      process.cwd(),
      "issueImages",
      "issue-" + Date.now() + `.${ext}`
    );
    fs.writeFileSync(tempPic, req.file.buffer);
    //upload to a folder in cloudinary CrowdIssues
    const result = await cloudinary.uploader.upload(tempPic, {
      folder: "CrowdIssues",
      resource_type: "image",
    });

    // currently stores like this will be changed when I add Authentication
    // TODO
    const issueData = {
      ID: randomID(),
      location: data.location,
      priority: data.priority,
      imgURL: result.secure_url,
      description: data.issue,
    };
    const newIssue = new Issue(issueData);
    await newIssue.save();
    console.log(issueData, newIssue);
    // I may change this in future based on what comes to my mind lol
    return res.json({
      success: true,
      issueID: newIssue._id,
    });
  } catch (err) {
    console.log(err);
    // May send some error stuff
    return res.status(500).json({
      success: false,
    });
  } finally {
    try {
        //delete the temporary fileu saved
    //   console.log(tempPic);
      if (fs.existsSync(tempPic)) {
        fs.unlinkSync(tempPic);
        console.log("Temp file deleted:", tempPic);
      }
    } catch (unlinkErr) {
      console.error("Failed to delete temp file:", unlinkErr);
    }
  }
});

export default router;
