import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Use the injected variables
const config = window.env;

export const firebaseConfig = {
  apiKey: config.ADMIN_FIREBASE_API_KEY,
  authDomain: config.ADMIN_FIREBASE_AUTH_DOMAIN,
  databaseURL: config.ADMIN_FIREBASE_DATABASE_URL,
  projectId: config.ADMIN_FIREBASE_PROJECT_ID,
  storageBucket: config.ADMIN_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.ADMIN_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.ADMIN_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
