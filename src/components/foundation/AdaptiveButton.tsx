import React from 'react'

import Button, { ButtonProps } from '@mui/joy/Button'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'

const classes = {
  tooltip: {
    display: {
      xs: 'inherit',
      sm: 'none'
    }
  },
  button: {
    display: {
      xs: 'none',
      sm: 'inherit'
    }
  }
}

type AdaptiveButtonProps = ButtonProps & {
  icon: React.ReactNode
}

export default function AdaptiveButton(props: AdaptiveButtonProps) {
  const { icon, ...other } = props

  return (
    <>
      <Tooltip title={other.children} arrow sx={classes.tooltip}>
        <IconButton {...other}>{icon}</IconButton>
      </Tooltip>
      <Button
        sx={React.useMemo(() => ({ ...classes.button, ...props.sx }), [props.sx])}
        startDecorator={icon}
        {...other}
      />
    </>
  )
}
