import React from 'react'

import Typography from '@mui/joy/Typography'

const classes = {
  title: {
    m: 0,
    px: 0,
    py: 0.5,
    textTransform: 'uppercase'
  }
}

export default function BlockHeader(props: React.PropsWithChildren) {
  return (
    <Typography
      color="primary"
      level="title-sm"
      variant="soft"
      fontWeight="bold"
      textAlign="center"
      noWrap
      sx={classes.title}
    >
      {props.children}
    </Typography>
  )
}
