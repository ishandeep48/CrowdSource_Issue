import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookies from "cookie-parser";
dotenv.config();
const databaseURL = process.env.DB_CONNECTION_STRING;
export default function middleware(app) {
  app.use(express.json());
  // app.use(cors('*'));
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));
  mongoose
    .connect(databaseURL)
    .then(async () => {
      console.log("Connected to MongoDB Database");
    })
    .catch(() => {
      console.log("Couldn't connect to the database");
    });
    app.use(cookies());
}
