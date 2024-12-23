import React, { useEffect, useState } from 'react'
import { auth } from '../../../../firebase' // Імпортуємо Firebase
import {
	getSchedule,
	saveSchedule,
	updateSchedule,
} from '../../../../firestore' // Імпортуємо функції для роботи з Firestore

export default function Home2() {
	const [schedule, setSchedule] = useState(null)
	const [authUser, setAuthUser] = useState(null)
	const [newSubject, setNewSubject] = useState({
		name: '',
		teacher: '',
		zoom_link: '',
	})

	const defaultSchedule = {
		duration: 120,
		breaks: [10, 20, 10, 10],
		start_time: '08:30',
		repeat: 1,
		subjects: [
			{
				id: 1,
				name: 'Mathematics',
				teacher: 'John Doe',
				zoom_link: 'https://zoom.com/lesson1',
			},
			{
				id: 2,
				name: 'Ukrainian Language',
				teacher: 'Jane Smith',
				zoom_link: 'https://zoom.com/lesson2',
			},
		],
		schedule: [], // Порожній розклад, може бути заповнений залежно від потреб
	}

	useEffect(() => {
		const user = auth.currentUser
		if (user) {
			setAuthUser(user)
			loadSchedule(user.uid)
		}
	}, [])

	const loadSchedule = async userId => {
		const userSchedule = await getSchedule(userId)
		if (userSchedule) {
			setSchedule(userSchedule)
		} else {
			setSchedule(defaultSchedule)
			saveSchedule(userId, defaultSchedule)
		}
	}

	const handleAddSubject = () => {
		if (!newSubject.name || !newSubject.teacher || !newSubject.zoom_link) return

		const newId =
			schedule.subjects.length > 0
				? Math.max(...schedule.subjects.map(s => s.id)) + 1
				: 1

		const updatedSubjects = [...schedule.subjects, { id: newId, ...newSubject }]

		const updatedSchedule = { ...schedule, subjects: updatedSubjects }
		setSchedule(updatedSchedule)
		setNewSubject({ name: '', teacher: '', zoom_link: '' })

		if (authUser) {
			updateSchedule(authUser.uid, updatedSchedule)
		}
	}

	const handleEditSubject = (id, field, value) => {
		const updatedSubjects = schedule.subjects.map(subject =>
			subject.id === id ? { ...subject, [field]: value } : subject
		)

		const updatedSchedule = { ...schedule, subjects: updatedSubjects }
		setSchedule(updatedSchedule)

		if (authUser) {
			updateSchedule(authUser.uid, updatedSchedule)
		}
	}

	const handleDeleteSubject = id => {
		const updatedSubjects = schedule.subjects.filter(
			subject => subject.id !== id
		)

		const updatedSchedule = { ...schedule, subjects: updatedSubjects }
		setSchedule(updatedSchedule)

		if (authUser) {
			updateSchedule(authUser.uid, updatedSchedule)
		}
	}

	return (
		<div>
			{authUser ? (
				<div>
					<h2>Розклад користувача: {authUser.email}</h2>

					<div>
						<h3>Список предметів</h3>
						{schedule?.subjects.map(subject => (
							<div key={subject.id}>
								<input
									type='text'
									value={subject.name}
									onChange={e =>
										handleEditSubject(subject.id, 'name', e.target.value)
									}
									placeholder='Назва предмету'
								/>
								<input
									type='text'
									value={subject.teacher}
									onChange={e =>
										handleEditSubject(subject.id, 'teacher', e.target.value)
									}
									placeholder='Викладач'
								/>
								<input
									type='text'
									value={subject.zoom_link}
									onChange={e =>
										handleEditSubject(subject.id, 'zoom_link', e.target.value)
									}
									placeholder='Zoom посилання'
								/>
								<button onClick={() => handleDeleteSubject(subject.id)}>
									Видалити
								</button>
							</div>
						))}
					</div>

					<div>
						<h3>Додати новий предмет</h3>
						<input
							type='text'
							value={newSubject.name}
							onChange={e =>
								setNewSubject({ ...newSubject, name: e.target.value })
							}
							placeholder='Назва предмету'
						/>
						<input
							type='text'
							value={newSubject.teacher}
							onChange={e =>
								setNewSubject({ ...newSubject, teacher: e.target.value })
							}
							placeholder='Викладач'
						/>
						<input
							type='text'
							value={newSubject.zoom_link}
							onChange={e =>
								setNewSubject({ ...newSubject, zoom_link: e.target.value })
							}
							placeholder='Zoom посилання'
						/>
						<button onClick={handleAddSubject}>Додати</button>
					</div>

					<button onClick={() => saveSchedule(authUser.uid, schedule)}>
						Зберегти розклад
					</button>
				</div>
			) : (
				<p>Будь ласка, увійдіть у систему.</p>
			)}
		</div>
	)
}
