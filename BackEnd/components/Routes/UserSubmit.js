import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cloudinary from "../Middleware/cloudinary.js";
import Issue from "../Models/IssueModel.js";
import User from "../Models/UserModel.js";
import {
  randomID,
  getNearbyIssues,
  getStateName,
  getSameDeptIssues,
} from "../functions/helper.js";
import { Client } from "@gradio/client";
// import dotenv from "dotenv";
import { authenticateTokenUser } from "../Middleware/authCookie.js";
const { getCategory,getPriority,getDuplicate } = await import("../functions/AI_API.js");
// dotenv.config();

const router = express.Router();
const upload = multer();



router.post("/testapi", async (req, res) => {
  // // try {
  // //   const { text } = req.body;
  // //   if (!text) {
  // //     return res.status(400).json({ message: "Text is required" });}
  // //   const category = await getCategory(text);
  // //   console.log(category);
  // //   const location = { lat: 28.6139, lng: 77.209 };

  // //   const issuesWithSameDept = await getSameDeptIssues(
  // //       category,
  // //       location
  // //     );
  // //   return res.status(200).json({ category, issuesWithSameDept });

  // // } catch (err) {}
  // const issues = await Issue.find();
  // return res.status(200).json({ issues });
  // getDuplicate("There is a large pothole on the main road causing traffic jams", "1: There is a large pothole on the main road; 2: Streetlight not working on 5th avenue; 3: Water leakage in park area").then((result)=>{
  //   return res.status(200).json({result});
  // });
});



router.post(  "/submitissue",authenticateTokenUser,upload.single("pic"),async (req, res) => {
    // const APIURL = process.env.AI_ENDPOINT;
    // console.log(APIURL)
    let tempPic = "";
    try {
      const data = JSON.parse(req.body.data);
      console.log("data is", data);
      const user = req.user;
      const email = user.email;
      const userID = await User.findOne({ email }).select("_id");
      const ext = req.file.originalname.split(".").pop();

      //First we get the department from the API
      const department = await getCategory(data.issue);

      // We check for all the issues in same area 1.5KM with same department
      const issuesWithSameDept = await getSameDeptIssues(
        department,
        data.location
      );

      // If duplicate we just return the duplicate
      if (issuesWithSameDept.length > 0) {
        const issuesString = issuesWithSameDept.map(issue => `${issue.ID}: ${issue.description}`).join('; ');
        const duplicates = await getDuplicate(data.issue, issuesString);
        //check for actual duplicates based on description similarity if needed
        return res.status(200).json({
          success: false,
          message: "Similar issue already reported nearby",
          issues: duplicates,
          code:"DUPLICATE"
        })
      }
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

      // Get state name
      const state = await getStateName(data.location.lat, data.location.lng);

      //Priority from AI
      const AI_priority = await getPriority(data.issue,department);

      //save Issue to DB
      const issueData = {
        ID: randomID(),
        location: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat],
        },
        priority: AI_priority,
        imgURL: result.secure_url,
        reportedBy: userID._id,
        description: data.issue,
        state,
        department, // may change based on the API Update
        upvotes: [userID._id],
        subscribers: [userID._id],
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
