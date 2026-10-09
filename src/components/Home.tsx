import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import { Box, Button, Divider, Typography } from '@mui/material'

interface HomeProps {
	onOpenStudents: () => void
	onOpenCourses: () => void
}

const areas = [
	{
		icon: <SchoolOutlinedIcon color="primary" />,
		title: 'Studenți',
		description: 'Consultă și caută informațiile despre studenți într-o listă centralizată.',
	},
	{
		icon: <MenuBookOutlinedIcon color="primary" />,
		title: 'Cursuri',
		description: 'Organizează catalogul de cursuri, codurile, denumirile și numărul de credite.',
	},
	{
		icon: <FactCheckOutlinedIcon color="primary" />,
		title: 'Înscrieri și note',
		description: 'Gestionează cursurile urmate de fiecare student și notele asociate acestora.',
	},
]

function Home({ onOpenStudents, onOpenCourses }: HomeProps) {
	return (
		<Box component="section" aria-labelledby="home-heading" sx={{ py: { xs: 3, md: 6 } }}>
			<Box sx={{ maxWidth: 760, mb: { xs: 5, md: 7 } }}>
				<Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
					Administrare academică
				</Typography>
				<Typography id="home-heading" variant="h3" component="h1" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
					Manager de studenți
				</Typography>
				<Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
					O platformă pentru organizarea informațiilor despre studenți, cursuri și parcursul academic, într-un singur loc.
				</Typography>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
					<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onOpenStudents}>
						Gestionează studenții
					</Button>
					<Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={onOpenCourses}>
						Explorează cursurile
					</Button>
				</Box>
			</Box>

			<Divider />
			<Box
				 sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
					gap: { xs: 3, md: 4 },
					py: 4,
				}}
			>
				{areas.map(({ icon, title, description }) => (
					<Box key={title}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
							{icon}
							<Typography variant="h6" component="h2">{title}</Typography>
						</Box>
						<Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
							{description}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default Home