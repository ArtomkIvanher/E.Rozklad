// firestore.js
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase"; // імпортуємо ініціалізацію Firebase з firebase.js

const db = getFirestore(app);

// Функція для збереження розкладу користувача
export const saveSchedule = async (userId, schedule) => {
  try {
    const userDocRef = doc(db, "schedules", userId); // створюємо посилання на документ користувача
    await setDoc(userDocRef, { schedule }, { merge: true }); // зберігаємо розклад
    console.log("Розклад успішно збережений!");
  } catch (error) {
    console.error("Помилка збереження розкладу: ", error);
  }
};

// Функція для отримання розкладу користувача
export const getSchedule = async (userId) => {
  try {
    const userDocRef = doc(db, "schedules", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data().schedule;
    } else {
      console.log("Розклад не знайдений!");
      return null;
    }
  } catch (error) {
    console.error("Помилка отримання розкладу: ", error);
  }
};

// Функція для оновлення розкладу
export const updateSchedule = async (userId, updatedSchedule) => {
  try {
    const userDocRef = doc(db, "schedules", userId);
    await updateDoc(userDocRef, { schedule: updatedSchedule });
    console.log("Розклад успішно оновлений!");
  } catch (error) {
    console.error("Помилка оновлення розкладу: ", error);
  }
};
