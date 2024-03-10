import React from 'react'

import ButtonGroup from '@mui/joy/ButtonGroup'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'

import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'
import StartOutlinedIcon from '@mui/icons-material/StartOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'

import { useProject } from '@/context/project'

import AdaptiveButton from './foundation/AdaptiveButton'

export default function AppBarControlButtons() {
  const project = useProject()

  return (
    <ButtonGroup variant="soft" spacing={1} size="sm">
      <Tooltip title="Поделиться" arrow>
        <IconButton onClick={project.handleShare} color="primary" disabled={!!project.vmState}>
          <IosShareOutlinedIcon />
        </IconButton>
      </Tooltip>
      <AdaptiveButton
        color={project.vmState ? (project.vmState.done ? 'neutral' : 'danger') : 'success'}
        icon={project.vmState ? <StopCircleOutlinedIcon /> : <PlayCircleOutlinedIcon />}
        onClick={project.handleRun}
      >
        {project.vmState ? (project.vmState.done ? 'Завершить' : 'Остановить') : 'Запустить'}
      </AdaptiveButton>
      <AdaptiveButton
        color="warning"
        icon={project.vmState ? <StartOutlinedIcon /> : <BugReportOutlinedIcon />}
        variant={project.vmState ? 'solid' : 'soft'}
        onClick={project.handleDebug}
        disabled={!!project.vmState && project.vmState.done}
      >
        {project.vmState ? 'Выполнить шаг' : 'Отладка'}
      </AdaptiveButton>
    </ButtonGroup>
  )
}
