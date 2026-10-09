export interface Course {
	id: number
	course_code: string
	course_name: string
	credits: number
}

export const courseStorageKey = 'courses'

export const defaultCourses: Course[] = [
	{ id: 1, course_code: 'CS101', course_name: 'Introducere în programare', credits: 3 },
	{ id: 2, course_code: 'CS102', course_name: 'Structuri de date', credits: 3 },
	{ id: 3, course_code: 'MATH101', course_name: 'Matematică', credits: 3 },
	{ id: 4, course_code: 'DB101', course_name: 'Baze de date', credits: 3 },
	{ id: 5, course_code: 'WEB101', course_name: 'Dezvoltare web', credits: 3 },
]

export function getStoredCourses(): Course[] {
	try {
		const savedCourses: unknown = JSON.parse(localStorage.getItem(courseStorageKey) ?? 'null')
		if (
			Array.isArray(savedCourses) &&
			savedCourses.every((course) =>
				typeof course.id === 'number' &&
				typeof course.course_code === 'string' &&
				typeof course.course_name === 'string' &&
				typeof course.credits === 'number',
			)
		) {
			return savedCourses as Course[]
		}
	} catch {
		return defaultCourses
	}

	return defaultCourses
}