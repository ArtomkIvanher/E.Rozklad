// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtLEOBq7PHQfPG0gKzj8fPlcJCES-Zc_o",
  authDomain: "e-rozklad-c2492.firebaseapp.com",
  projectId: "e-rozklad-c2492",
  storageBucket: "e-rozklad-c2492.firebasestorage.app",
  messagingSenderId: "697085191545",
  appId: "1:697085191545:web:141a02fb355e5d3d3a7ba8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export necessary Firebase services
export const auth = getAuth(app);  // Firebase Auth
