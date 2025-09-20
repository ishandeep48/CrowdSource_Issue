import express from "express";
import Issue from "../Models/IssueModel.js";
import axios from "axios";
import { authenticateTokenAdmin } from "../Middleware/authCookie.js";
// import { getStateFromDisplayName } from "../functions/helper.js";
const router = express.Router();

router.get('/allissues',authenticateTokenAdmin, async (req, res) => {
    try{
        const issues = await Issue.find({}).select('_id ID status reportedAt imgURL priority state location description');
        return res.status(200).json({success:true, issues:issues});
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Couldnt fetch issues"});
    }
})

router.get('/admin/issueDetails', authenticateTokenAdmin,async(req,res)=>{

    const issues = await Issue.find({});
    // console.log(issues)
    const total = issues.length;
    const pending = issues.filter(issue => issue.status === 'reported' ).length;
    const inProgress = issues.filter(issue => issue.status === 'forwarded' || issue.status === 'reviewed').length;
    const resolved = issues.filter(issue => issue.status === 'resolved').length;
    const toSend ={
        total,
        pending,
        inProgress,
        resolved,
    }
    res.status(200).json({message:true, data:toSend});
})


router.get('/admin/issues',authenticateTokenAdmin , async(req,res)=>{
    try{
        const issues = await Issue.find({}).sort({createdAt:-1}).populate('reportedBy','name email phone');
        res.status(200).json({message:true, data:issues});
    }catch(errr){
        console.log(errr);
        res.status(500).json({message:false, error:"Couldnt fetch issues"})
    }
})


router.post('/admin/changePriority', authenticateTokenAdmin , async(req,res)=>{
    const {ID, priority} = req.body;
    if(!ID || !priority){
        return res.status(400).json({message:false, error:"All fields are required"});
    }
    try{
        const issue = await Issue.findOne({ID});
        if(!issue){
            return res.status(404).json({message:false, error:"Issue not found"});
        }
        issue.priority = priority;
        await issue.save();
        return res.status(200).json({message:true, data:issue});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:false, error:"Couldnt update priority"});
    }
});

export default router;