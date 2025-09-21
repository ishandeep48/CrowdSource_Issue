import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import { hashPassword, SECRET_KEY } from "../functions/helper.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { authenticateTokenUser } from "../Middleware/authCookie.js";

router.post("/user/register", async (req, res) => {
  // console.log(req.body)
  //   console.log(req.user)
  const { name, email, password, phone, aadhaar } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      phone,
      aadhaar,
      password: hashedPassword,
    });
    // console.log(user)
    await user.save();
    const token = jwt.sign(
      {
        email,
        name,
        phone,
        role: "user",
      },
      SECRET_KEY,
      { expiresIn: "20d" }
    );
    console.log("Done");
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: false });
  }
});

router.get("/auth/check", authenticateTokenUser, (req, res) => {
  // this is from where i send the ok signal to frontend protected routes check this if u need help
  // @Komal @Anusha if u wanna see how i did the authentication stuff the look in that file
  res.json({
    isAuthenticated: true,
    user: req.user,
  });
});

router.post("/user/login", async (req, res) => {
  const { email, password, role } = req.body;
  console.log(email, password, role);
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: false, error: "All fields are required" });
  }
  if (role != "Citizen") {
    // User is not citizen
    return res.json({ message: false, error: "Not Authorized User" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // No User
      return res.json({ message: false, error: "Invalid credentials" });
    }
    if (user.blocked) {
      // User is blocked
      return res.json({
        message: false,
        error: "User is blocked",
        code: "BAN",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password mismatch
      return res.json({ message: false, error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "20d" }
    );
    console.log("LOGIN DONE");
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: false, error: "Server Error" });
  }
});

router.post("/user/logout", (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: "strict",
  });
  console.log("LOGOUT DONE");
  res.json({ message: true });
});

router.post("/user/updatePassword", authenticateTokenUser, async (req, res) => {
  const user = req.user;
  const { current, newPass } = req.body;
  if (!current || !newPass) {
    return res
      .status(400)
      .json({ message: false, error: "All fields are required" });
  }
  try {
    const userData = await User.findOne({ email: user.email });
    // console.log(userData)
    if (!userData) {
      return res.status(404).json({ message: false, error: "User not found" });
    }
    const isMatch = await bcrypt.compare(current, userData.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: false, error: "Current password is incorrect" });
    }
    const hashedPassword = await hashPassword(newPass);
    userData.password = hashedPassword;
    await userData.save();
    return res.status(200).json({ message: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: false, error: "Couldnt update password" });
  }
});
export default router;
