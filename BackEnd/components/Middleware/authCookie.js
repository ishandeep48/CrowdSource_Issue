import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../functions/helper.js";

export async function authenticateTokenUser(req, res, next) {
  const token = req.cookies.userToken;
//   console.log(token)
//   console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // console.log(decoded)
        if(decoded.role !== 'user'){
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

export async function authenticateTokenAdmin(req, res, next) {
    const token = req.cookies.userToken;
     if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded)
        if(decoded.role !== 'admin'){
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}