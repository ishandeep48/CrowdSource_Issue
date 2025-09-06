import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const databaseURL = process.env.DB_CONNECTION_STRING;
export default function middleware(app) {
  app.use(express.json());
  app.use(cors());
  mongoose
    .connect(databaseURL)
    .then(async () => {
      console.log("Connected to MongoDB Database");
    })
    .catch(() => {
      console.log("Couldn't connect to the database");
    });
}
