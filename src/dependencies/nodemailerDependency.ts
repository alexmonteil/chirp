import "dotenv/config";
import nodemailer from "nodemailer";

const GOOGLE_ACCOUNT = process.env.GOOGLE_ACCOUNT;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

if (!GOOGLE_ACCOUNT || !GOOGLE_APP_PASSWORD) {
  throw new Error(
    "GOOGLE_ACCOUNT or GOOGLE_PASSWORD not set in environment variables."
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_ACCOUNT,
    pass: GOOGLE_APP_PASSWORD,
  },
});
