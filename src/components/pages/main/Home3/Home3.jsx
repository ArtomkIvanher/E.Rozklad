import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../../../firebase";
import { saveSchedule, getSchedule } from "../../../../firestore";

export default function Home3() {
  const [schedule, setSchedule] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '', zoom_link: '' });
  const [autoSaveInterval, setAutoSaveInterval] = useState(0); // Initial auto-save interval in seconds
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const [timeUntilAutoSave, setTimeUntilAutoSave] = useState(autoSaveInterval);
  const timerRef = useRef(null);

  const defaultSchedule = {
    duration: 120,
    breaks: [10, 20, 10, 10],
    start_time: "08:30",
    repeat: 1,
    auto_save: 60, // Default auto-save interval in seconds
    subjects: [
      { id: 1, name: "Mathematics", teacher: "John Doe", zoom_link: "https://zoom.com/lesson1" },
      { id: 2, name: "Ukrainian Language", teacher: "Jane Smith", zoom_link: "https://zoom.com/lesson2" },
      { id: 3, name: "Biology", teacher: "Mark Brown", zoom_link: "https://zoom.com/lesson3" },
      { id: 4, name: "Physics", teacher: "Emily White", zoom_link: "https://zoom.com/lesson4" },
      { id: 5, name: "Informatics", teacher: "Alice Green", zoom_link: "https://zoom.com/lesson5" },
    ],
    schedule: Array(7).fill(null).map(() => ({ week1: [0], week2: [0], week3: [0], week4: [0] })),
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthUser(user);
      loadSchedule(user.uid);
    }

    const handleBeforeUnload = (e) => {
      if (isUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Standard action to show dialog in browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUnsavedChanges]);

  useEffect(() => {
    if (authUser && schedule) {
      startAutoSave();
    }
    return () => stopAutoSave();
  }, [authUser, schedule, autoSaveInterval]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeUntilAutoSave((prev) => (prev > 0 ? prev - 1 : autoSaveInterval));
    }, 1000);

    return () => clearInterval(countdown);
  }, [autoSaveInterval]);

  const loadSchedule = async (userId) => {
    const userSchedule = await getSchedule(userId);
    const loadedSchedule = userSchedule || defaultSchedule;

    // Check if 'auto_save' is available, otherwise set it to 60
    const autoSaveValue = loadedSchedule.auto_save || 60;
    setAutoSaveInterval(autoSaveValue);
    setSchedule(loadedSchedule);
  };

  const startAutoSave = () => {
    stopAutoSave();
    timerRef.current = setInterval(() => {
      if (authUser && schedule) {
        saveSchedule(authUser.uid, schedule);
        setIsUnsavedChanges(false);
      }
    }, autoSaveInterval * 1000);
  };

  const stopAutoSave = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRepeatChange = (newRepeat) => {
    if (newRepeat < 1 || newRepeat > 4) return;

    setSchedule((prev) => ({
      ...prev,
      repeat: newRepeat,
      schedule: prev.schedule.map((day) => {
        const updatedDay = {};
        for (let i = 1; i <= newRepeat; i++) {
          updatedDay[`week${i}`] = day[`week${i}`] || [0];
        }
        return updatedDay;
      }),
    }));
    setIsUnsavedChanges(true);
  };

  const handleAddSubject = () => {
    setSchedule((prev) => {
      const maxSubjectId = prev.subjects.length ? Math.max(...prev.subjects.map(s => s.id)) : 0;
      const newSubjectId = maxSubjectId + 1;

      return {
        ...prev,
        subjects: [...prev.subjects, { id: newSubjectId, ...newSubject }],
      };
    });
    setNewSubject({ name: '', teacher: '', zoom_link: '' });
    setIsUnsavedChanges(true);
  };

  const addPairToDay = (dayIndex, weekPart) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      if (!updatedSchedule.schedule[dayIndex][weekPart]) {
        updatedSchedule.schedule[dayIndex][weekPart] = [];
      }
      updatedSchedule.schedule[dayIndex][weekPart].push(0);
      return updatedSchedule;
    });
    setIsUnsavedChanges(true);
  };

  const handleSubjectChange = (dayIndex, weekPart, subjectIndex, newSubjectId) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      updatedSchedule.schedule[dayIndex][weekPart][subjectIndex] = newSubjectId;
      return updatedSchedule;
    });
    setIsUnsavedChanges(true);
  };

  const handleRemoveSubject = (dayIndex, weekPart, subjectIndex) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      updatedSchedule.schedule[dayIndex][weekPart].splice(subjectIndex, 1);
      return updatedSchedule;
    });
    setIsUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    if (authUser) {
      saveSchedule(authUser.uid, schedule);
      setIsUnsavedChanges(false);
    }
  };

  const handleAutoSaveIntervalChange = (value) => {
    const interval = Math.max(30, value);
    setAutoSaveInterval(interval);
    setTimeUntilAutoSave(interval);
    setSchedule((prev) => ({
      ...prev,
      auto_save: interval, // Update auto-save interval in schedule object
    }));
    setIsUnsavedChanges(true);
  };

  const daysOfWeek = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"];

  return (
    <div>
      {authUser ? (
        <div>
          <h2>Розклад користувача: {authUser.email}</h2>

          <div>
            <label>Повторення: </label>
            <input
              type="number"
              value={schedule?.repeat || ""}
              onChange={(e) => handleRepeatChange(Number(e.target.value))}
            />
          </div>

          <div>
            <h3>Додати новий предмет</h3>
            <input
              type="text"
              placeholder="Назва предмету"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Викладач"
              value={newSubject.teacher}
              onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
            />
            <input
              type="text"
              placeholder="Zoom лінк"
              value={newSubject.zoom_link}
              onChange={(e) => setNewSubject({ ...newSubject, zoom_link: e.target.value })}
            />
            <button onClick={handleAddSubject}>Додати предмет</button>
          </div>

          <div>
            <label>Автозбереження кожні (сек): </label>
            <input
              type="number"
              min="30"
              value={autoSaveInterval}
              onChange={(e) => handleAutoSaveIntervalChange(Number(e.target.value))}
            />
            <p>Час до наступного автозбереження: {timeUntilAutoSave} сек</p>
          </div>

          <div>
            <h3>Розклад по днях:</h3>
            {schedule &&
              schedule.schedule.map((day, dayIndex) => (
                <div key={dayIndex}>
                  <h4>{daysOfWeek[dayIndex]}</h4>
                  {Object.entries(day)
                    .sort(([weekA], [weekB]) => weekA.localeCompare(weekB))
                    .map(([weekPart, subjects], weekIndex) => (
                      <div key={weekIndex}>
                        <h5>{weekPart}</h5>
                        {subjects.map((subjectId, subjectIndex) => (
                          <div key={subjectIndex}>
                            <select
                              value={subjectId}
                              onChange={(e) =>
                                handleSubjectChange(dayIndex, weekPart, subjectIndex, Number(e.target.value))
                              }
                            >
                              <option value={0}>Без предмета</option>
                              {schedule.subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                  {subject.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleRemoveSubject(dayIndex, weekPart, subjectIndex)}
                            >
                              Видалити
                            </button>
                          </div>
                        ))}
                        <button onClick={() => addPairToDay(dayIndex, weekPart)}>Додати пару</button>
                      </div>
                    ))}
                </div>
              ))}
          </div>

          <button onClick={handleSaveChanges}>Зберегти розклад</button>
        </div>
      ) : (
        <p>Будь ласка, увійдіть у систему.</p>
      )}
    </div>
  );
}
