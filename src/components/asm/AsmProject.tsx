import React from 'react'

import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Sheet from '@mui/joy/Sheet'
import Button from '@mui/joy/Button'

import DoneRoundedIcon from '@mui/icons-material/DoneRounded'

import useMediaQuery from '@/hooks/useMediaQuery'

import { useProject } from '@/context/project'

import Collapse from '../foundation/Collapse'
import AsmMemoryManagement from './AsmMemoryManagement'
import AsmCodeEditor from './AsmCodeEditor'
import AsmRegistersTable from './AsmRegistersTable'
import AsmHelp from './AsmHelp'
import ErrorModal from '../ErrorModal'
import AdaptiveColumnLayout from '../layout/AdaptiveColumnLayout'
import AsmStackTable from './AsmStackTable'

const classes = {
  column: {
    flex: 1,
    overflow: 'hidden'
  }
}

const errClasses = {
  hiddenDivider: {
    display: 'none'
  },
  container: {
    height: 'auto',
    p: 1
  }
}
const AsmErrors = () => {
  const project = useProject()
  return (
    <Box>
      <Divider sx={project.error ? undefined : errClasses.hiddenDivider} />
      <Collapse open={!!project.error}>
        <Box sx={errClasses.container}>
          <ErrorModal />
        </Box>
      </Collapse>
    </Box>
  )
}

const sbClasses = {
  container: {
    p: 1
  },
  button: {
    width: 1
  }
}
const AsmStatusButton = () => {
  const { vmState } = useProject()
  return (
    <Box>
      <Divider />
      <Sheet sx={sbClasses.container}>
        <Button
          startDecorator={vmState!.done && <DoneRoundedIcon />}
          sx={sbClasses.button}
          color={vmState!.done ? 'neutral' : 'success'}
          disabled={true}
          loading={!vmState!.done}
          loadingPosition="start"
        >
          {vmState!.done ? 'Исполнение инструкций завершено' : 'Виртуальная машина работает'}
        </Button>
      </Sheet>
    </Box>
  )
}

const layout = {
  defaultEntry: 2,
  cols: 10,
  space: [3, 4, 3]
}

export default function AsmProject() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const project = useProject()
  const isRunning = !!project.vmState

  return (
    <AdaptiveColumnLayout
      defaultEntry={layout.defaultEntry}
      cols={layout.cols}
      space={layout.space}
      entries={React.useMemo(
        () => ({
          Инструкции: (
            <>
              <AsmCodeEditor sx={classes.column} />
              {!isMobile && <AsmErrors />}
            </>
          ),
          Память: (
            <>
              <AsmMemoryManagement sx={classes.column} />
              {!isMobile && isRunning && <AsmStatusButton />}
            </>
          ),
          ...(isRunning && {
            Регистры: (
              <>
                <AsmRegistersTable sx={classes.column} />
                <AsmStackTable sx={classes.column} />
              </>
            )
          }),
          ...(!isRunning && {
            Справка: (
              <>
                <AsmHelp sx={classes.column} />
              </>
            )
          })
        }),
        [isMobile, isRunning]
      )}
    >
      {React.useMemo(
        () => (
          <>
            {isMobile && <AsmErrors />}
            {isMobile && isRunning && <AsmStatusButton />}
          </>
        ),
        [isMobile, isRunning]
      )}
    </AdaptiveColumnLayout>
  )
}
