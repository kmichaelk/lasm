import React from 'react'
import Box, { BoxProps } from '@mui/joy/Box'

export default function AppBar(props: BoxProps) {
  return (
    <Box
      component="header"
      className="AppBar"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: 'background.surface',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    />
  )
}
