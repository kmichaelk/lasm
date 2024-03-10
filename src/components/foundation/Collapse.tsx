import React from 'react'

import Box from '@mui/joy/Box'

const classes = {
  container: {
    overflow: 'hidden',
    transition: '180ms max-height'
  }
}

type CollapseProps = React.PropsWithChildren & {
  open: boolean
}

export default function Collapse(props: CollapseProps) {
  const [height, setHeight] = React.useState<number>()

  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    const resizeObserver = new ResizeObserver(() => setHeight(ref.current?.clientHeight))
    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect() // clean up
  }, [ref])

  return (
    <Box sx={classes.container} style={{ maxHeight: props.open ? height : 0 }}>
      <Box ref={ref}>{props.children}</Box>
    </Box>
  )
}
