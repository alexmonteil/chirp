import "dotenv/config";
import nodemailer from "nodemailer";
import { getSafeEnvironmentVar } from "../utils/utils.js";

const GOOGLE_ACCOUNT = getSafeEnvironmentVar("GOOGLE_ACCOUNT");
const GOOGLE_APP_PASSWORD = getSafeEnvironmentVar("GOOGLE_APP_PASSWORD");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_ACCOUNT,
    pass: GOOGLE_APP_PASSWORD,
  },
});
