import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import { hashPassword, SECRET_KEY } from "../functions/helper.js";
import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken";
import { authenticateTokenAdmin } from "../Middleware/authCookie.js";

router.post("/admin/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();
    const token = jwt.sign(
      {
        email,
        name,
        role: "admin",
      },
      SECRET_KEY,
      { expiresIn: "20d" }
    );
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production", // set to true in production
    //     sameSite: "strict",
    //     maxAge: 20 * 24 * 60 * 60 * 1000,
    // });
    res.status(201).json({ message: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: false });
  }
});
router.post('/admin/updatePassword', authenticateTokenAdmin,async(req,res)=>{
  const user = req.user;
  const {current, newPass} = req.body;
  if(!current || !newPass){
    return res.status(400).json({message:false, error:"All fields are required"});
  }
  try{
    const admin = await Admin.findOne({email:user.email});
    console.log(admin)
    if(!admin){
      return res.status(404).json({message:false, error:"Admin not found"});
    }
    const isMatch = await bcrypt.compare(current, admin.password);
    if(!isMatch){
      return res.status(400).json({message:false, error:"Current password is incorrect"});
    }
    const hashedPassword = await hashPassword(newPass);
    admin.password = hashedPassword;
    await admin.save();
    return res.status(200).json({message:true});
  }catch(err){
    console.log(err);
    return res.status(500).json({message:false, error:"Couldnt update password"});
  }
})

router.post('/admin/logout', (req, res) => {
    res.clearCookie('userToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // set to true in production
        sameSite: "strict",
    });
    res.status(200).json({ message: true });
});
router.post("/admin/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.json({ message: false, error: "All fields are required" });
  }
  if (role != "Admin") {
    return res.json({ message: false, error: "Not Authorized User" });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ message: false, error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ message: false, error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
      SECRET_KEY,
      { expiresIn: "20d" }
    );
    console.log("Done Login Admin");
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: true , user:{
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    }});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: false });
  }
});

export default router;
