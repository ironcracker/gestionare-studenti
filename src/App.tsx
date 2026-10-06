
import { useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import Students from './components/Students'

function App() {
  const [activeSection, setActiveSection] = useState('Home')

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ width: '100%', bgcolor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Typography variant="h6" component="div" sx={{ color: 'common.white', fontWeight: 700 }}>
            Student Manager
          </Typography>
          <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', gap: 1 }}>
            {['Home', 'Students', 'Courses'].map((section) => (
              <Button
                key={section}
                color="inherit"
                onClick={() => setActiveSection(section)}
                aria-current={activeSection === section ? 'page' : undefined}
                sx={{
                  color: 'common.white',
                  bgcolor: activeSection === section ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                }}
              >
                {section}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {activeSection === 'Students' ? (
          <Students />
        ) : (
          <Typography variant="h4" component="h1">
            {activeSection}
          </Typography>
        )}
      </Container>
    </>
  )
}

export default App
