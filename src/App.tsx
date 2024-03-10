import React from 'react'

import CssBaseline from '@mui/joy/CssBaseline'
import { CssVarsProvider } from '@mui/joy/styles'

import { appConstants } from '@/appConstants'
import { ProjectProvider } from '@/context/project'

import LASM from '@/LASM'

export default function App() {
  React.useEffect(() => {
    document.title = appConstants.name
  }, [])

  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <ProjectProvider>
        <LASM />
      </ProjectProvider>
    </CssVarsProvider>
  )
}
