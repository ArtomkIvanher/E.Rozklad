import React, { useState, useEffect } from 'react';
import data from '../../../../data/data.json';  // Імпортуємо JSON файл

const Home = () => {
  const [dataState, setData] = useState(data);
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '', zoom_link: '' });
  const [repeat, setRepeat] = useState(data.repeat);

  // Функція для оновлення розкладу в залежності від repeat
  const updateScheduleForRepeat = (repeatValue, initialData) => {
    const updatedSchedule = initialData.schedule.map((weekSchedule) => {
      const updatedWeekSchedule = { ...weekSchedule };

      // Додаємо або видаляємо тижні в залежності від значення repeat
      for (let i = 1; i <= repeatValue; i++) {
        if (!updatedWeekSchedule[`week${i}`]) {
          updatedWeekSchedule[`week${i}`] = []; // Якщо тижня немає, додаємо його
        }
      }

      // Видаляємо зайві тижні, якщо repeatValue менше, ніж поточна кількість тижнів
      for (let i = repeatValue + 1; i <= 4; i++) {
        delete updatedWeekSchedule[`week${i}`];
      }

      return updatedWeekSchedule;
    });

    setData((prevState) => ({
      ...prevState,
      schedule: updatedSchedule,
      repeat: repeatValue, // Оновлюємо кількість повторюваних тижнів
    }));
  };

  // Завантажуємо нові дані та оновлюємо їх при зміні repeat
  useEffect(() => {
    const initialData = data;  // Отримуємо дані з JSON
    updateScheduleForRepeat(repeat, initialData);  // Оновлюємо розклад на основі нового repeat
  }, [repeat]); // Викликається при зміні repeat

  // Функція для додавання нового предмету
  const handleAddSubject = () => {
    // Знаходимо максимальний ID, що вже є в масиві
    const maxSubjectId = Math.max(...dataState.subjects.map(subject => subject.id), 0);

    // Створюємо новий ID, збільшуючи на 1
    let newSubjectId = maxSubjectId + 1;

    // Перевіряємо, чи є вже в розкладі предмет з цим ID
    while (dataState.schedule.some(weekSchedule => 
      Object.values(weekSchedule).flat().includes(newSubjectId))) {
      newSubjectId++; // Якщо ID вже є в розкладі, збільшуємо його на 1
    }

    // Додаємо новий предмет до списку предметів
    const updatedSubjects = [
      ...dataState.subjects,
      { id: newSubjectId, ...newSubject }
    ];

    setData((prevState) => ({
      ...prevState,
      subjects: updatedSubjects
    }));
    setNewSubject({ name: '', teacher: '', zoom_link: '' });
  };

  // Функція для додавання пари до конкретного дня тижня
  const addPairToDay = (weekIndex, weekPart) => {
    const updatedSchedule = [...dataState.schedule];
    const maxSubjectId = Math.max(...dataState.subjects.map(subject => subject.id), 0);  // Знаходимо максимальний ID
    let newSubjectId = maxSubjectId + 1;  // Створюємо новий ID

    // Перевіряємо, чи існує цей ID вже в розкладі
    while (dataState.schedule.some(weekSchedule => 
      Object.values(weekSchedule).flat().includes(newSubjectId))) {
      newSubjectId++;  // Якщо такий ID вже є, збільшуємо його
    }

    updatedSchedule[weekIndex][weekPart].push(newSubjectId); // Додаємо новий предмет (ID) до масиву
    setData((prevState) => ({
      ...prevState,
      schedule: updatedSchedule
    }));
  };

  // Функція для редагування предмета в розкладі
  const handleSubjectChange = (weekIndex, weekPart, subjectIndex, newSubjectId) => {
    const updatedSchedule = [...dataState.schedule];

    // Переконуємось, що ми не замінюємо ID 0
    if (newSubjectId !== 0) {
      updatedSchedule[weekIndex][weekPart][subjectIndex] = newSubjectId;
    }

    setData((prevState) => ({
      ...prevState,
      schedule: updatedSchedule
    }));
  };

  // Функція для видалення предмета
  const handleRemoveSubject = (weekIndex, weekPart, subjectIndex) => {
    const updatedSchedule = [...dataState.schedule];
    updatedSchedule[weekIndex][weekPart].splice(subjectIndex, 1);  // Видаляємо предмет за індексом

    setData((prevState) => ({
      ...prevState,
      schedule: updatedSchedule
    }));
  };

  const handleRepeatChange = (e) => {
    const newRepeat = parseInt(e.target.value, 10);
    setRepeat(newRepeat);
  };

  return (
    <div>
      <h2>Редагування розкладу</h2>

      <div>
        <label>Повторювані тижні: </label>
        <input
          type="number"
          value={repeat}
          onChange={handleRepeatChange}
          min="1"
          max="4"
        />
        <button onClick={() => updateScheduleForRepeat(repeat, data)}>Підтвердити</button>
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
        <h3>Розклад</h3>
        {dataState.schedule.map((weekSchedule, weekIndex) => (
          <div key={weekIndex}>
            <h4>ДЕНЬ {weekIndex + 1}</h4>
            {Object.keys(weekSchedule).map((weekPart, partIndex) => (
              <div key={partIndex}>
                <h5>{weekPart}</h5>
                {weekSchedule[weekPart] && weekSchedule[weekPart].length > 0 ? (
                  weekSchedule[weekPart].map((subjectId, index) => {
                    if (subjectId === 0) {
                      return (
                        <div key={index}>
                          <span>Без предмета</span>
                          <button onClick={() => addPairToDay(weekIndex, weekPart)}>+</button> {/* Кнопка для додавання пари */}
                        </div>
                      );
                    }
                    const subject = dataState.subjects.find((s) => s.id === subjectId);
                    return (
                      <div key={index}>
                        <span>{subject?.name || "Не знайдено предмета"}</span>
                        <select
                          value={subjectId}
                          onChange={(e) => handleSubjectChange(weekIndex, weekPart, index, parseInt(e.target.value, 10))}
                        >
                          {dataState.subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                        <button onClick={() => handleRemoveSubject(weekIndex, weekPart, index)}>Видалити</button>
                      </div>
                    );
                  })
                ) : (
                  <div>Немає предметів для цього тижня</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
