import React from 'react'

export default function ScheduleManager({ schedule, setSchedule, subjects }) {
	const daysOfWeek = [
		'Понеділок',
		'Вівторок',
		'Середа',
		'Четвер',
		'П’ятниця',
		'Субота',
		'Неділя',
	]

	const handleSubjectChange = (
		dayIndex,
		weekPart,
		subjectIndex,
		newSubjectId
	) => {
		const updatedSchedule = { ...schedule }
		updatedSchedule.schedule[dayIndex][weekPart][subjectIndex] = newSubjectId
		setSchedule(updatedSchedule)
	}

	if (!schedule || !schedule.schedule) {
		return <div>Loading schedule...</div>
	}

	// Додатково перевіряйте, чи schedule.schedule має коректну структуру
	if (!Array.isArray(schedule.schedule)) {
		return <div>Invalid schedule data</div>
	}

	return (
		<div>
			<h3>Розклад по днях</h3>
			{schedule.schedule.map((day, dayIndex) => (
				<div key={dayIndex}>
					<h4>{daysOfWeek[dayIndex]}</h4>
					{Object.entries(day).map(([weekPart, subjectsInWeek]) => (
						<div key={weekPart}>
							<h5>{weekPart}</h5>
							{subjectsInWeek.map((subjectId, subjectIndex) => (
								<div key={subjectIndex}>
									<select
										value={subjectId}
										onChange={e =>
											handleSubjectChange(
												dayIndex,
												weekPart,
												subjectIndex,
												Number(e.target.value)
											)
										}
									>
										<option value={0}>Без предмета</option>
										{subjects.map(subject => (
											<option key={subject.id} value={subject.id}>
												{subject.name}
											</option>
										))}
									</select>
								</div>
							))}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
