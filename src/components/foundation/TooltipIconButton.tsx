import React from 'react'

import Tooltip from '@mui/joy/Tooltip'
import IconButton, { IconButtonProps } from '@mui/joy/IconButton'

type TooltipIconButtonProps = IconButtonProps & {
  tooltip: React.ReactNode
}

export default function TooltipIconButton(props: TooltipIconButtonProps) {
  const { tooltip, ...btnProps } = props
  return (
    <Tooltip arrow title={tooltip}>
      <IconButton {...btnProps} />
    </Tooltip>
  )
}
