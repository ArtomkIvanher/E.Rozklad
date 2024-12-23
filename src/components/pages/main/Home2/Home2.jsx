import React, { useEffect, useState } from 'react';
import { auth } from "../../../../firebase";  // імпортуємо Firebase
import { saveSchedule, getSchedule, updateSchedule } from "../../../../firestore";  // імпортуємо функції для роботи з Firestore

export default function Schedule() {
  const [schedule, setSchedule] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const defaultSchedule = {
    duration: 120,
    breaks: [10, 20, 10, 10],
    start_time: "08:30",
    repeat: 2,
    subjects: [
      { id: 1, name: "Mathematics", teacher: "John Doe", zoom_link: "https://zoom.com/lesson1" },
      { id: 2, name: "Ukrainian Language", teacher: "Jane Smith", zoom_link: "https://zoom.com/lesson2" },
      { id: 3, name: "Biology", teacher: "Mark Brown", zoom_link: "https://zoom.com/lesson3" },
      { id: 4, name: "Physics", teacher: "Emily White", zoom_link: "https://zoom.com/lesson4" },
      { id: 5, name: "Informatics", teacher: "Alice Green", zoom_link: "https://zoom.com/lesson5" }
    ],
    schedule: [
      { week1: [0], week2: [0], week3: [0], week4: [1, 2, 4] },
      { week1: [0], week2: [0], week3: [0], week4: [0] },
      { week1: [0], week2: [0], week3: [0], week4: [0] },
      { week1: [0], week2: [0], week3: [0], week4: [0] },
      { week1: [0], week2: [0], week3: [0], week4: [0] },
      { week1: [0], week2: [0], week3: [2, 1, 4], week4: [0] },
      { week1: [1, 4, 2], week2: [0], week3: [0], week4: [0] }
    ]
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthUser(user);
      // Завантажуємо розклад користувача з Firestore
      loadSchedule(user.uid);
    }
  }, []);

  const loadSchedule = async (userId) => {
    const userSchedule = await getSchedule(userId);
    if (userSchedule) {
      setSchedule(userSchedule); // Якщо розклад знайдений, зберігаємо його
    } else {
      // Якщо розклад не знайдений, використовуємо defaultSchedule
      setSchedule(defaultSchedule);
      saveSchedule(userId, defaultSchedule); // Зберігаємо дефолтний розклад для нового користувача
    }
  };

  const handleSaveSchedule = () => {
    if (authUser) {
      // Зберігаємо розклад користувача
      saveSchedule(authUser.uid, schedule);
    }
  };

  const handleUpdateSchedule = (updatedSchedule) => {
    setSchedule(updatedSchedule);
    if (authUser) {
      // Оновлюємо розклад у Firestore
      updateSchedule(authUser.uid, updatedSchedule);
    }
  };

  return (
    <div>
      {authUser ? (
        <div>
          <h2>Розклад користувача: {authUser.email}</h2>
          {/* Відображення розкладу та можливість редагувати */}
          <ul>
            {schedule && schedule.subjects.map((item, index) => (
              <li key={index}>
                {item.name} - {item.teacher} <a href={item.zoom_link}>Zoom link</a>
              </li>
            ))}
          </ul>
          <button onClick={handleSaveSchedule}>Зберегти розклад</button>
        </div>
      ) : (
        <p>Будь ласка, увійдіть у систему.</p>
      )}
    </div>
  );
}
