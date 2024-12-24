import React, { useEffect, useRef, useState } from "react";

export default function AutoSaveManager({
  authUser,
  schedule,
  saveSchedule,
  getSchedule,
  isUnsavedChanges, // Додаємо прапор для перевірки
}) {
  const timerRef = useRef(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState(60); // Інтервал автозбереження (за замовчуванням 60 сек)
  const [timeLeft, setTimeLeft] = useState(60); // Час, що залишився до автозбереження

  useEffect(() => {
    if (authUser) {
      initializeAutoSave();
    }
    return () => stopAutoSave();
  }, [authUser, isUnsavedChanges]); // Додаємо залежність від `isUnsavedChanges`

  const initializeAutoSave = async () => {
    try {
      const userSchedule = await getSchedule(authUser.uid);
      const autoSaveValue = userSchedule?.auto_save || 60;

      setAutoSaveInterval(autoSaveValue);
      setTimeLeft(autoSaveValue);

      if (!userSchedule?.auto_save) {
        await saveSchedule(authUser.uid, {
          ...userSchedule,
          auto_save: 60,
        });
      }

      if (isUnsavedChanges) {
        startAutoSave(autoSaveValue);
      }
    } catch (error) {
      console.error("Помилка під час завантаження авто-збереження:", error);
    }
  };

  const startAutoSave = (interval) => {
    stopAutoSave(); // Очищаємо попередній таймер

    timerRef.current = setInterval(() => {
      if (authUser && schedule && isUnsavedChanges) {
        saveSchedule(authUser.uid, schedule);
        console.log("Автозбереження виконано");
      }
    }, interval * 1000);

    // Встановлюємо таймер для зворотного відліку
    setTimeLeft(interval);
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(countdownTimer); // Зупиняємо відлік після 0
        return interval;
      });
    }, 1000);
  };

  const stopAutoSave = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div>
      <p>Час до автозбереження: {timeLeft} сек</p>
    </div>
  );
}
