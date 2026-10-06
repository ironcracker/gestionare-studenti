import { useEffect, useState } from 'react'
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'

interface Student {
	id: number
	first_name: string
	last_name: string
	email: string
	gender: 'M' | 'F'
}

const rowsPerPage = 20

function Students() {
	const [students, setStudents] = useState<Student[]>([])
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const controller = new AbortController()

		async function loadStudents() {
			try {
				const response = await fetch('/studenti.json', { signal: controller.signal })
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

	const normalizedSearch = search.trim().toLowerCase()
	const filteredStudents = students.filter((student) =>
		[student.id, student.first_name, student.last_name, student.email]
			.some((value) => String(value).toLowerCase().includes(normalizedSearch)),
	)
	const pageStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

	return (
		<Box component="section" aria-labelledby="students-heading" sx={{ py: 4 }}>
			<Box
				sx={{
					alignItems: { xs: 'stretch', sm: 'center' },
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'space-between',
					gap: 2,
					mb: 3,
				}}
			>
				<Typography id="students-heading" variant="h4" component="h1">
					Studenti
				</Typography>
				<TextField
					label="Filtrare studenti"
					placeholder="ID, Nume, Prenume, Email"
					size="small"
					value={search}
					onChange={(event) => {
						setSearch(event.target.value)
						setPage(0)
					}}
					sx={{ width: { xs: '100%', sm: 320 } }}
				/>
			</Box>

			<TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
				<Table aria-label="Students">
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Gender</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} align="center">Loading students...</TableCell>
							</TableRow>
						) : error ? (
							<TableRow>
								<TableCell colSpan={5} align="center">{error}</TableCell>
							</TableRow>
						) : pageStudents.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} align="center">No students found.</TableCell>
							</TableRow>
						) : (
							pageStudents.map((student) => (
								<TableRow key={student.id} hover>
									<TableCell>{student.id}</TableCell>
									<TableCell>{student.first_name}</TableCell>
									<TableCell>{student.last_name}</TableCell>
									<TableCell>{student.email}</TableCell>
									<TableCell>{student.gender}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<TablePagination
					component="div"
					count={filteredStudents.length}
					page={page}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[]}
					onPageChange={(_, nextPage) => setPage(nextPage)}
				/>
			</TableContainer>
		</Box>
	)
}

export default Students
