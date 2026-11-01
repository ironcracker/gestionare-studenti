import type { Course } from './courses'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

export interface Student {
	id: number
	first_name: string
	last_name: string
	email: string
	gender: string
}

export interface StudentGetModel {
	StudentList: Student[]
	Page: number
	PageSize: number
	TotalCount: number
	TotalPages: number
}

export interface NewStudent {
	firstName: string
	lastName: string
	email: string
	gender: 'M' | 'F' | 'C'
}

export interface StudentQuery {
	page: number
	pageSize: number
	search: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function getField(record: Record<string, unknown>, ...names: string[]): unknown {
	return names.map((name) => record[name]).find((value) => value !== undefined)
}

function parseCourse(value: unknown): Course | null {
	if (!isRecord(value)) return null
	const id = getField(value, 'id', 'courseId', 'course_id')
	const courseCode = getField(value, 'courseCode', 'course_code')
	const courseName = getField(value, 'courseName', 'course_name')
	const credits = value.credits
	if (
		typeof id !== 'number' ||
		typeof courseCode !== 'string' ||
		typeof courseName !== 'string' ||
		typeof credits !== 'number'
	) return null

	return { id, course_code: courseCode, course_name: courseName, credits }
}

function parseStudent(value: unknown): Student | null {
	if (!isRecord(value)) return null
	const id = getField(value, 'id', 'studentId', 'StudentId', 'studentID', 'student_id')
	const firstName = getField(value, 'firstName', 'FirstName', 'first_name')
	const lastName = getField(value, 'lastName', 'LastName', 'last_name')
	const email = getField(value, 'email', 'Email')
	const gender = getField(value, 'gender', 'Gender')
	if (
		typeof id !== 'number' ||
		typeof firstName !== 'string' ||
		typeof lastName !== 'string' ||
		typeof email !== 'string' ||
		typeof gender !== 'string'
	) return null

	return { id, first_name: firstName, last_name: lastName, email, gender }
}

function parseStudentGetModel(value: unknown): StudentGetModel | null {
	if (!isRecord(value)) return null
	const studentList = getField(value, 'StudentList', 'studentList')
	const page = getField(value, 'Page', 'page')
	const pageSize = getField(value, 'PageSize', 'pageSize')
	const totalCount = getField(value, 'TotalCount', 'totalCount')
	const totalPages = getField(value, 'TotalPages', 'totalPages')
	if (
		!Array.isArray(studentList) ||
		typeof page !== 'number' ||
		typeof pageSize !== 'number' ||
		typeof totalCount !== 'number' ||
		typeof totalPages !== 'number'
	) return null

	const students = studentList.map(parseStudent)
	if (students.some((student) => student === null)) return null

	return {
		StudentList: students.filter((student): student is Student => student !== null),
		Page: page,
		PageSize: pageSize,
		TotalCount: totalCount,
		TotalPages: totalPages,
	}
}

async function getCollection<T>(
	endpoint: string,
	parseItem: (value: unknown) => T | null,
	signal?: AbortSignal,
): Promise<T[]> {
	const response = await fetch(`${apiBaseUrl}/${endpoint}`, { signal })
	if (!response.ok) {
		throw new Error(`Request failed (${response.status}).`)
	}

	const data: unknown = await response.json()
	if (!Array.isArray(data)) {
		throw new Error(`The ${endpoint.toLowerCase()} response has an invalid format.`)
	}

	const items = data.map(parseItem)
	if (items.some((item) => item === null)) {
		throw new Error(`The ${endpoint.toLowerCase()} response contains invalid records.`)
	}
	return items.filter((item): item is T => item !== null)
}

export function getCourses(signal?: AbortSignal): Promise<Course[]> {
	return getCollection('Courses', parseCourse, signal)
}

export async function getStudents(query: StudentQuery, signal?: AbortSignal): Promise<StudentGetModel> {
	console.log('Fetching students with query:', query);
	const response = await fetch(`${apiBaseUrl}/Students`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			page: query.page,
			pageSize: query.pageSize,
			search: query.search.trim(),
		}),
		signal,
	})
	if (!response.ok) {
		throw new Error(`Request failed (${response.status}).`)
	}
	console.log('Response from getStudents:', response);
	const data: unknown = await response.json()
	const result = parseStudentGetModel(data)
	if (!result) {
		throw new Error('The students response has an invalid format.')
	}
	return result
}

export async function createStudent(student: NewStudent): Promise<void> {
	const response = await fetch(`${apiBaseUrl}/Students`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(student),
	})
	if (!response.ok) {
		throw new Error(`Student creation failed (${response.status}).`)
	}
}
