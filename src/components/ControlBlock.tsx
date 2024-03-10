import React from 'react'

import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'

const classes = {
  sheet: {
    height: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    m: 0,
    px: 0,
    py: 0.5,
    textTransform: 'uppercase',
    userSelect: 'none'
  }
}

type ControlBlockProps = React.PropsWithChildren & {
  title: string
}

export default function ControlBlock(props: ControlBlockProps) {
  return (
    <Sheet variant="outlined" sx={classes.sheet}>
      <Typography
        color="primary"
        level="title-sm"
        variant="soft"
        fontWeight="bold"
        textAlign="center"
        noWrap
        sx={classes.title}
      >
        {props.title}
      </Typography>
      <Divider />
      {props.children}
    </Sheet>
  )
}
