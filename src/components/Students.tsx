import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	Tab,
	Tabs,
	Tooltip,
	TextField,
	Typography,
} from '@mui/material'
import { getStoredCourses, type Course } from '../data/courses'

interface Student {
	id: number
	first_name: string
	last_name: string
	email: string
	gender: 'M' | 'F'
}

interface StudentCourseData {
	courseIds: number[]
	grades: Record<number, string>
}

const courseDataStorageKey = 'student-course-data'
const pageSize = 20

function Students() {
	const [students, setStudents] = useState<Student[]>([])
	const [courses] = useState<Course[]>(getStoredCourses)
	const [courseData, setCourseData] = useState<Record<number, StudentCourseData>>(() => {
		try {
			const savedData = localStorage.getItem(courseDataStorageKey)
			return savedData ? JSON.parse(savedData) as Record<number, StudentCourseData> : {}
		} catch {
			return {}
		}
	})
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
	const [activeStudentTab, setActiveStudentTab] = useState(0)
	const [search, setSearch] = useState('')
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const controller = new AbortController()

		async function loadStudents() {
			try {
				const response = await fetch('../src/data/studenti.json', { signal: controller.signal })
				if (!response.ok) {
					throw new Error('Student data could not be loaded.')
				}

				const data: unknown = await response.json()
				if (!Array.isArray(data)) {
					throw new Error('Student data has an invalid format.')
				}

				setStudents(data as Student[])
			} catch (loadError) {
				if (loadError instanceof DOMException && loadError.name === 'AbortError') {
					return
				}
				setError('Unable to load students. Please try again later.')
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false)
				}
			}
		}

		void loadStudents()
		return () => controller.abort()
	}, [])

	useEffect(() => {
		localStorage.setItem(courseDataStorageKey, JSON.stringify(courseData))
	}, [courseData])

	const normalizedSearch = search.trim().toLowerCase()
	const filteredStudents = students.filter((student) =>
		[student.id, student.first_name, student.last_name, student.email]
			.some((value) => String(value).toLowerCase().includes(normalizedSearch)),
	)
	const columns: GridColDef<Student>[] = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{ field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 140 },
		{ field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 140 },
		{ field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
		{ field: 'gender', headerName: 'Gender', width: 110 },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 110,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: ({ row }) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Tooltip title="Edit student">
						<IconButton size="small" aria-label={`Edit ${row.first_name} ${row.last_name}`} onClick={(event) => event.stopPropagation()}>
							<EditOutlinedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Remove student">
						<IconButton size="small" aria-label={`Remove ${row.first_name} ${row.last_name}`} onClick={(event) => event.stopPropagation()}>
							<DeleteOutlinedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>
			),
		},
	]

	return (
		<Box component="section" aria-labelledby="students-heading" sx={{ py: 4 }}>
			<Box
				sx={{
				}}
			>
				<Typography id="students-heading" variant="h4" component="h1">
					Studenti
				</Typography>
			</Box>

			<Box
				role="toolbar"
				aria-label="Student actions"
				sx={{
					alignItems: { xs: 'stretch', sm: 'center' },
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'space-between',
					gap: 2,
					mb: 2,
				}}
			>
				<TextField
					label="Filtrare studenti"
					placeholder="ID, Nume, Prenume, Email"
					size="small"
					value={search}
					onChange={(event) => {
						setSearch(event.target.value)
						setPaginationModel((model) => ({ ...model, page: 0 }))
					}}
					sx={{ width: { xs: '100%', sm: 320 } }}
				/>
				<Button variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
					Add student
				</Button>
			</Box>

			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
			<DataGrid
				aria-label="Students"
				autoHeight
				rows={filteredStudents}
				columns={columns}
				loading={loading}
				pagination
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				onRowClick={({ row }) => {
					setSelectedStudent(row)
					setActiveStudentTab(0)
				}}
				pageSizeOptions={[pageSize]}
				disableRowSelectionOnClick
				initialState={{
					pagination: { paginationModel: { page: 0, pageSize } },
				}}
				 sx={{ minHeight: 400, '& .MuiDataGrid-row': { cursor: 'pointer' } }}
			/>
			<Dialog
				open={selectedStudent !== null}
				onClose={() => setSelectedStudent(null)}
				fullWidth
				maxWidth="sm"
			>
				{selectedStudent && (
					<>
						<DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
							<Box>
								<Typography variant="h6" component="h2">
									{selectedStudent.first_name} {selectedStudent.last_name}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{selectedStudent.email || 'No email'}
								</Typography>
							</Box>
							<IconButton aria-label="Close student details" onClick={() => setSelectedStudent(null)} size="small">
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<Tabs
							value={activeStudentTab}
							onChange={(_, value: number) => setActiveStudentTab(value)}
							aria-label="Student details"
							sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
						>
							<Tab label="Courses" />
							<Tab label="Grades" />
						</Tabs>
						<DialogContent>
							{activeStudentTab === 0 ? (
								<Box role="tabpanel" aria-label="Course assignments">
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Select the courses this student is enrolled in.
									</Typography>
									{courses.map((course) => {
										const studentCourses = courseData[selectedStudent.id] ?? { courseIds: [], grades: {} }
										const enrolled = studentCourses.courseIds.includes(course.id)
										return (
											<Box key={course.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
												<FormControlLabel
													sx={{ width: '100%', py: 0.5, mr: 0 }}
													control={
														<Checkbox
															checked={enrolled}
															onChange={(event) => setCourseData((current) => {
																const existing = current[selectedStudent.id] ?? { courseIds: [], grades: {} }
																const courseIds = event.target.checked
																	? [...existing.courseIds, course.id]
																	: existing.courseIds.filter((id) => id !== course.id)
																const grades = { ...existing.grades }
																if (!event.target.checked) delete grades[course.id]
																return {
																	...current,
																	[selectedStudent.id]: { courseIds, grades },
																}
															})}
													/>
													}
													label={`${course.course_code} · ${course.course_name}`}
												/>
											</Box>
										)
									})}
								</Box>
							) : (
								<Box role="tabpanel" aria-label="Course grades">
									{(courseData[selectedStudent.id]?.courseIds ?? []).length === 0 ? (
										<Typography color="text.secondary">Enroll this student in a course to manage grades.</Typography>
									) : (courseData[selectedStudent.id]?.courseIds ?? []).map((courseId) => {
										const course = courses.find(({ id }) => id === courseId)
										if (!course) return null
										return (
											<Box key={course.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
												<Box>
													<Typography variant="body2" fontWeight={600}>{course.course_code}</Typography>
																<Typography variant="body2" color="text.secondary">{course.course_name}</Typography>
												</Box>
												<TextField
													label="Grade"
													size="small"
													value={courseData[selectedStudent.id]?.grades[course.id] ?? ''}
													onChange={(event) => setCourseData((current) => {
														const existing = current[selectedStudent.id] ?? { courseIds: [], grades: {} }
														return {
															...current,
															[selectedStudent.id]: {
																...existing,
																grades: { ...existing.grades, [course.id]: event.target.value.slice(0, 2) },
															},
														}
													})}
													inputProps={{ maxLength: 2, 'aria-label': `Grade for ${course.course_code}` }}
												/>
											</Box>
										)
									})}
								</Box>
							)}
						</DialogContent>
					</>
				)}
			</Dialog>
		</Box>
	)
}

export default Students
