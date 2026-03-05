import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const content = `
window.BBQ_CONFIG = {
  SUPABASE_URL: "${process.env.SUPABASE_URL}",
  SUPABASE_KEY: "${process.env.SUPABASE_KEY}",

  ADMIN_FIREBASE_API_KEY: "${process.env.ADMIN_FIREBASE_API_KEY}",
  ADMIN_FIREBASE_AUTH_DOMAIN: "${process.env.ADMIN_FIREBASE_AUTH_DOMAIN}",
  ADMIN_FIREBASE_DATABASE_URL: "${process.env.ADMIN_FIREBASE_DATABASE_URL}",
  ADMIN_FIREBASE_PROJECT_ID: "${process.env.ADMIN_FIREBASE_PROJECT_ID}",
  ADMIN_FIREBASE_STORAGE_BUCKET: "${process.env.ADMIN_FIREBASE_STORAGE_BUCKET}",
  ADMIN_FIREBASE_MESSAGING_SENDER_ID: "${process.env.ADMIN_FIREBASE_MESSAGING_SENDER_ID}",
  ADMIN_FIREBASE_APP_ID: "${process.env.ADMIN_FIREBASE_APP_ID}"
};
`;

fs.writeFileSync("env.js", content.trim());
console.log("env.js generated");
