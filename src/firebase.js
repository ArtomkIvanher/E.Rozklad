// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const auth = getAuth(app);