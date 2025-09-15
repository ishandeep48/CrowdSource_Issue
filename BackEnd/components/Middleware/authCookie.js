import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../functions/helper.js";

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token;
//   console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}