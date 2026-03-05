import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: process.env.ADMIN_FIREBASE_API_KEY,
  authDomain: process.env.ADMIN_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.ADMIN_FIREBASE_DATABASE_URL,
  projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
  storageBucket: process.env.ADMIN_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.ADMIN_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.ADMIN_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
