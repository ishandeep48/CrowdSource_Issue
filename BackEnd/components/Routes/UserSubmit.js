import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cloudinary from "../Middleware/cloudinary.js";
import Issue from "../Models/IssueModel.js";
import User from "../Models/UserModel.js";
import { randomID,getNearbyIssues } from "../functions/helper.js";
import { Client } from "@gradio/client";
import dotenv from "dotenv";
import { authenticateTokenUser } from "../Middleware/authCookie.js";
dotenv.config();

const router = express.Router();
const upload = multer();

router.post(
  "/submitissue",
  authenticateTokenUser,
  upload.single("pic"),
  async (req, res) => {
    const APIURL = process.env.AI_ENDPOINT;
    // console.log(APIURL)
    let tempPic = "";
    try {
      const data = JSON.parse(req.body.data);
      console.log("data is", data);
      const user = req.user;
      const email = user.email;
      const userID = await User.findOne({ email }).select("_id");
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
      //  This is how you get nearby Issues
      // console.log(await getNearbyIssues(data.location))
      // currently stores like this will be changed when I add Authentication
      // TODO
      // const client = await Client.connect(APIURL);
      // const API_result = await client.predict("/predict", {
      //   text: data.issue,
      // });
      // const API_data = API_result.data[0];
      // console.log(API_data);
      const issueData = {
        ID: randomID(),
        location: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat],
        },
        // priority: API_data.Priority.toLowerCase(),
        priority: data.priority,
        imgURL: result.secure_url,
        reportedBy: userID._id,
        // description: API_data.Complaint,

        description: data.issue,
        // department: API_data.Predicted_Category, // may change based on the API Update
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
  }
);

export default router;
