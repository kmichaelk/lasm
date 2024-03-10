import React from 'react'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'

import { appConstants } from '@/appConstants'

import AppBar from '@/components/layout/AppBar'
import AppBarControlButtons from '@/components/AppBarControlButtons'
import AsmProject from '@/components/asm/AsmProject'

export default function LASM() {
  return (
    <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar sx={{ height: 64, userSelect: 'none' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
            height: 1
          }}
        >
          <Box
            component="img"
            sx={(theme) => ({ height: 1, borderRadius: theme.radius.md })}
            draggable={false}
            alt="Логотип"
            src="icon-192-maskable.png"
          />
          <Typography component="h1" fontWeight="xl">
            {appConstants.name}
          </Typography>
        </Box>
        <AppBarControlButtons />
      </AppBar>
      <Box component="main" sx={{ flex: 1, minHeight: 0 }}>
        <AsmProject />
      </Box>
    </Box>
  )
}
