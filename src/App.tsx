import { useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import Students from './components/Students'
import Courses from './components/courses'
import Home from './components/Home'

const pages = [
  { value: 0, label: 'Home' },
  { value: 1, label: 'Studenti' },
  { value: 2, label: 'Cursuri' },
]
0

function App() {
  const [activePage, setActivePage] = useState(pages[0].value)
  const pageChildren = [
    <Home
      key={pages[0].value}
      onOpenStudents={() => setActivePage(pages[1].value)}
      onOpenCourses={() => setActivePage(pages[2].value)}
    />,
    <Students key={pages[1].value} />,
    <Courses key={pages[2].value} />,
  ]

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ width: '100%', bgcolor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Typography variant="h6" component="div" sx={{ color: 'common.white', fontWeight: 700 }}>
           Manager de Studenți
          </Typography>
          <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', gap: 1 }}>
            {pages.map(({value, label }) => (
              <Button
                key={value}
                color="inherit"
                onClick={() => setActivePage(value)}
                aria-current={activePage === value ? 'page' : undefined}
                sx={{
                  color: 'common.white',
                  bgcolor: activePage === value  ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {pageChildren[activePage]}
      </Container>
    </>
  )
}

export default App
