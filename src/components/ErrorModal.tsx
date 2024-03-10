import React from 'react'

import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'

import WarningIcon from '@mui/icons-material/Warning'
import CloseIcon from '@mui/icons-material/Close'

import { useProject } from '@/context/project'

const classes = {
  alert: {
    alignItems: 'flex-start'
  }
}

export default function ErrorModal() {
  const project = useProject()

  return (
    true && (
      <Alert
        startDecorator={<WarningIcon />}
        sx={classes.alert}
        variant="soft"
        color="danger"
        endDecorator={
          <>
            <IconButton variant="soft" size="sm" color="danger" onClick={() => project.setError(null)}>
              <CloseIcon />
            </IconButton>
          </>
        }
      >
        <div>
          <b>{project.error?.title}</b>
          <Typography level="body-sm" color="danger">
            {project.error?.message}
          </Typography>
        </div>
      </Alert>
    )
  )
}
