import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyc98O9272jR7z7sgFwC8agjQTFg5AUO0",
  authDomain: "bbqheavenrockingham.firebaseapp.com",
  projectId: "bbqheavenrockingham",
  databaseURL:
    "https://bbqheavenrockingham-default-rtdb.asia-southeast1.firebasedatabase.app/", // Ensure this matches your Firebase console
  storageBucket: "bbqheavenrockingham.firebasestorage.app",
  messagingSenderId: "208843072347",
  appId: "1:208843072347:web:ce1e73ecf747d04d9e307e",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
