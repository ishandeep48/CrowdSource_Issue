import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Issue from "../Models/IssueModel.js";
import indianStatesAndUTs from "./states.js";
import axios from "axios";
dotenv.config();
// Random ID generator
export function randomID(num = 10) {
  const ID = nanoid(num);
  return ID;
}

// Hash password
export async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Get nearby issues within a certain distance (in meters) from a given location
export async function getNearbyIssues(location, distanceInMeters = 1000) {
  const nearbyIssues = await Issue.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
        $maxDistance: distanceInMeters,
      },
    },
  }).populate('reportedBy', 'name email');

  return nearbyIssues;
}

function getStateFromDisplayName(displayName) {
  const parts = displayName.split(",").map((s) => s.trim());
  const state = parts.find((part) => indianStatesAndUTs.includes(part));
  return state || null; // returns null if not found
}

export async function getStateName(lat, lon) {
  const resp = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: {
      lat,
      lon,
      format: "json",
      addressdetails: 1,
    },
  });
  const display_name = resp.data.display_name;
  const state = getStateFromDisplayName(display_name);
  console.log(state);
  return state || null;
}

export async function getSameDeptIssues(department, location) {
  const issues = await getNearbyIssues(location);

  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

  const filtered = issues.filter(
    (issue) =>
      issue.department === department &&
      issue.status !== "resolved" &&
      issue.status !== "cancelled" &&
      new Date(issue.reportedAt).getTime() > twoWeeksAgo
  );

  return filtered;
}

export const SECRET_KEY = process.env.SECKEY;
