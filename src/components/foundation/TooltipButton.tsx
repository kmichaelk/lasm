import React from 'react'

import Tooltip from '@mui/joy/Tooltip'
import Button, { ButtonProps } from '@mui/joy/Button'

type TooltipButtonProps = ButtonProps & {
  tooltip: React.ReactNode
}

export default function TooltipButton(props: TooltipButtonProps) {
  const { tooltip, ...btnProps } = props
  return (
    <Tooltip arrow title={tooltip}>
      <Button {...btnProps} />
    </Tooltip>
  )
}
