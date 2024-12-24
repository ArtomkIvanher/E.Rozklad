import React, { useEffect, useState } from 'react'
import { auth } from '../../../../firebase'
import { getSchedule, saveSchedule } from '../../../../firestore'
import AutoSaveManager from './AutoSaveManager'
import ScheduleManager from './ScheduleManager'
import SubjectsManager from './SubjectsManager'

export default function Home3() {
	const [schedule, setSchedule] = useState(null)
	const [authUser, setAuthUser] = useState(null)
	const [autoSaveInterval, setAutoSaveInterval] = useState(30) // Мінімум 30 секунд
	const [isUnsavedChanges, setIsUnsavedChanges] = useState(false)

	useEffect(() => {
		const user = auth.currentUser
		if (user) {
			setAuthUser(user)
			loadSchedule(user.uid)
		}
	}, [])

	const loadSchedule = async userId => {
		const userSchedule = await getSchedule(userId)
		const loadedSchedule = userSchedule || {
			auto_save: 30,
			subjects: [],
			schedule: [],
		}
		setSchedule(loadedSchedule)
		setAutoSaveInterval(loadedSchedule.auto_save || 30)
	}

	const handleSaveChanges = () => {
		if (authUser && schedule) {
			saveSchedule(authUser.uid, schedule)
			setIsUnsavedChanges(false)
			console.log('Збереження виконано вручну')
		}
	}

	const handleAutoSaveIntervalChange = value => {
		const newInterval = Math.max(30, value)
		setAutoSaveInterval(newInterval)
		setSchedule(prev => ({
			...prev,
			auto_save: newInterval,
		}))
		setIsUnsavedChanges(true)
	}

	return (
		<div>
			{authUser && schedule ? (
				<>
					<h2>Розклад користувача: {authUser.email}</h2>

					<div>
						<label>Автозбереження кожні (секунд): </label>
						<input
							type='number'
							min='30'
							value={autoSaveInterval}
							onChange={e =>
								handleAutoSaveIntervalChange(Number(e.target.value))
							}
						/>
						<button onClick={handleSaveChanges}>Зберегти зараз</button>
					</div>

					<SubjectsManager
						subjects={schedule.subjects}
						setSubjects={subjects =>
							setSchedule(prev => ({ ...prev, subjects }))
						}
						onAddSubject={newSubject =>
							setSchedule(prev => ({
								...prev,
								subjects: [...prev.subjects, { ...newSubject, id: Date.now() }],
							}))
						}
					/>

					<ScheduleManager
						schedule={schedule}
						setSchedule={setSchedule}
						subjects={schedule.subjects}
					/>

					<AutoSaveManager
						authUser={authUser}
						schedule={schedule}
						saveSchedule={saveSchedule}
						getSchedule={getSchedule}
						isUnsavedChanges={isUnsavedChanges} // Передаємо прапор
					/>
				</>
			) : (
				<p>Завантаження...</p>
			)}
		</div>
	)
}
