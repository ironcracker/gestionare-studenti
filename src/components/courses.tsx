import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { courseStorageKey, getStoredCourses, type Course } from '../data/courses'

interface CourseDraft {
	course_code: string
	course_name: string
	credits: string
}

const pageSize = 20

function Courses() {
	const [courses, setCourses] = useState<Course[]>(getStoredCourses)
	const [search, setSearch] = useState('')
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize })
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingCourse, setEditingCourse] = useState<Course | null>(null)
	const [draft, setDraft] = useState<CourseDraft>({ course_code: '', course_name: '', credits: '3' })
	const [error, setError] = useState('')

	useEffect(() => {
		localStorage.setItem(courseStorageKey, JSON.stringify(courses))
	}, [courses])

	const normalizedSearch = search.trim().toLowerCase()
	const filteredCourses = courses.filter((course) =>
		[course.id, course.course_code, course.course_name, course.credits]
			.some((value) => String(value).toLowerCase().includes(normalizedSearch)),
	)

	function openAddDialog() {
		setEditingCourse(null)
		setDraft({ course_code: '', course_name: '', credits: '3' })
		setError('')
		setDialogOpen(true)
	}

	function openEditDialog(course: Course) {
		setEditingCourse(course)
		setDraft({
			course_code: course.course_code,
			course_name: course.course_name,
			credits: String(course.credits),
		})
		setError('')
		setDialogOpen(true)
	}

	function saveCourse(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const courseCode = draft.course_code.trim()
		const courseName = draft.course_name.trim()
		const credits = Number(draft.credits)

		if (!courseCode || !courseName || !Number.isInteger(credits) || credits < 1) {
			setError('Enter a course code, name, and a positive whole number of credits.')
			return
		}
		if (courses.some((course) => course.course_code.toLowerCase() === courseCode.toLowerCase() && course.id !== editingCourse?.id)) {
			setError('A course with this code already exists.')
			return
		}

		if (editingCourse) {
			setCourses((current) => current.map((course) => course.id === editingCourse.id
				? { ...course, course_code: courseCode, course_name: courseName, credits }
				: course))
		} else {
			const id = courses.reduce((highestId, course) => Math.max(highestId, course.id), 0) + 1
			setCourses((current) => [...current, { id, course_code: courseCode, course_name: courseName, credits }])
		}
		setDialogOpen(false)
	}

	function deleteCourse(course: Course) {
		if (!window.confirm(`Delete ${course.course_code} - ${course.course_name}?`)) return
		setCourses((current) => current.filter(({ id }) => id !== course.id))
	}

	const columns: GridColDef<Course>[] = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{ field: 'course_code', headerName: 'Course Code', width: 160 },
		{ field: 'course_name', headerName: 'Course Name', flex: 1, minWidth: 200 },
		{ field: 'credits', headerName: 'Credits', width: 120, type: 'number' },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 110,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: ({ row }) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Tooltip title="Edit course">
						<IconButton size="small" aria-label={`Edit ${row.course_name}`} onClick={() => openEditDialog(row)}>
							<EditOutlinedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete course">
						<IconButton size="small" aria-label={`Delete ${row.course_name}`} onClick={() => deleteCourse(row)}>
							<DeleteOutlinedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>
			),
		},
	]

	return (
		<Box component="section" aria-labelledby="courses-heading" sx={{ py: 4 }}>
			<Typography id="courses-heading" variant="h4" component="h1" sx={{ mb: 3 }}>
				Cursuri
			</Typography>
			<Box
				role="toolbar"
				aria-label="Course actions"
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
					label="Filter courses"
					placeholder="ID, code, name, credits"
					size="small"
					value={search}
					onChange={(event) => {
						setSearch(event.target.value)
						setPaginationModel((model) => ({ ...model, page: 0 }))
					}}
					sx={{ width: { xs: '100%', sm: 320 } }}
				/>
				<Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog} sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
					Add course
				</Button>
			</Box>
			<DataGrid
				aria-label="Courses"
				autoHeight
				rows={filteredCourses}
				columns={columns}
				pagination
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[pageSize]}
				initialState={{ pagination: { paginationModel: { page: 0, pageSize } } }}
				sx={{ minHeight: 400 }}
			/>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
				<Box component="form" onSubmit={saveCourse}>
					<DialogTitle>{editingCourse ? 'Edit course' : 'Add course'}</DialogTitle>
					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
						{error && <Alert severity="error">{error}</Alert>}
						<TextField
							autoFocus
							label="Course code"
							value={draft.course_code}
							onChange={(event) => setDraft((current) => ({ ...current, course_code: event.target.value }))}
							inputProps={{ maxLength: 20 }}
							required
						/>
						<TextField
							label="Course name"
							value={draft.course_name}
							onChange={(event) => setDraft((current) => ({ ...current, course_name: event.target.value }))}
							inputProps={{ maxLength: 100 }}
							required
						/>
						<TextField
							label="Credits"
							type="number"
							value={draft.credits}
							onChange={(event) => setDraft((current) => ({ ...current, credits: event.target.value }))}
							inputProps={{ min: 1, step: 1 }}
							required
						/>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2 }}>
						<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
						<Button type="submit" variant="contained">Save course</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</Box>
	)
}

export default Courses