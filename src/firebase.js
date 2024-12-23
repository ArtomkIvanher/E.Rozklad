// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Додано для автентифікації
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Ваше налаштування Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtLEOBq7PHQfPG0gKzj8fPlcJCES-Zc_o",
  authDomain: "e-rozklad-c2492.firebaseapp.com",
  projectId: "e-rozklad-c2492",
  storageBucket: "e-rozklad-c2492.firebasestorage.app",
  messagingSenderId: "697085191545",
  appId: "1:697085191545:web:141a02fb355e5d3d3a7ba8",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Автентифікація

// Експорт модулів
export { app, db, auth, doc, setDoc, getDoc, updateDoc };
