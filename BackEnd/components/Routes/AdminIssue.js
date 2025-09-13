import express from "express";
import Issue from "../Models/IssueModel.js";
const router = express.Router();

router.get('/allissues', async (req, res) => {
    try{
        const issues = await Issue.find({}).select('_id location description');
        return res.status(200).json({success:true, issues:issues});
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Couldnt fetch issues"});
    }
})


export default router;