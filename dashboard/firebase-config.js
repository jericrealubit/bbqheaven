import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const cfg = window.BBQ_CONFIG;

export const firebaseConfig = {
  apiKey: cfg.ADMIN_FIREBASE_API_KEY,
  authDomain: cfg.ADMIN_FIREBASE_AUTH_DOMAIN,
  databaseURL: cfg.ADMIN_FIREBASE_DATABASE_URL,
  projectId: cfg.ADMIN_FIREBASE_PROJECT_ID,
  storageBucket: cfg.ADMIN_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: cfg.ADMIN_FIREBASE_MESSAGING_SENDER_ID,
  appId: cfg.ADMIN_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
