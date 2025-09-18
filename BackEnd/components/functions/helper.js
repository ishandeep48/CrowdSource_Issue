import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export function randomID(num =20){
    const ID = nanoid(num);
    return ID;
}

export async function hashPassword(password){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const SECRET_KEY = process.env.SECKEY;

