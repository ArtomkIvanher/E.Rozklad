import React from 'react'

export default function SubjectsManager({
	subjects,
	setSubjects,
	onAddSubject,
}) {
	const [newSubject, setNewSubject] = React.useState({
		name: '',
		teacher: '',
		zoom_link: '',
	})

	const handleAddSubject = () => {
		onAddSubject(newSubject)
		setNewSubject({ name: '', teacher: '', zoom_link: '' })
	}

	const handleRemoveSubject = id => {
		setSubjects(subjects.filter(subject => subject.id !== id))
	}

	if (!subjects) {
		return <div>Loading subjects...</div>
	}

	// Додатково перевіряйте конкретні властивості, якщо вони потрібні
	if (!Array.isArray(subjects) || subjects.length === 0) {
		return <div>No subjects available</div>
	}

	return (
		<div>
			<h3>Додати новий предмет</h3>
			<input
				type='text'
				placeholder='Назва предмету'
				value={newSubject.name}
				onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
			/>
			<input
				type='text'
				placeholder='Викладач'
				value={newSubject.teacher}
				onChange={e =>
					setNewSubject({ ...newSubject, teacher: e.target.value })
				}
			/>
			<input
				type='text'
				placeholder='Zoom лінк'
				value={newSubject.zoom_link}
				onChange={e =>
					setNewSubject({ ...newSubject, zoom_link: e.target.value })
				}
			/>
			<button onClick={handleAddSubject}>Додати предмет</button>

			<h4>Список предметів:</h4>
			{subjects.map(subject => (
				<div key={subject.id}>
					<p>
						{subject.name} - {subject.teacher}
					</p>
					<button onClick={() => handleRemoveSubject(subject.id)}>
						Видалити
					</button>
				</div>
			))}
		</div>
	)
}
