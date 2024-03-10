import React from 'react'

import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'

import { SxProps } from '@mui/joy/styles/types'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import * as AsmEngine from '@/engine'
import { useProject } from '@/context/project'

import AsmMemoryTable from './AsmMemoryTable'

const classes = {
  container: {
    height: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  table: {
    flex: 1
  },
  buttonContainer: {
    p: 1
  },
  button: {
    width: 1
  }
}

type AsmMemoryManagementProps = {
  sx?: SxProps
}

export default function AsmMemoryManagement(props: AsmMemoryManagementProps) {
  const { memory, setMemory, vmState } = useProject()
  const isRunning = !!vmState

  const initialMemory = React.useMemo(() => AsmEngine.mapMemoryCells(memory), [memory])
  const getInitialMemoryValue = React.useCallback((address: number) => initialMemory[address].value, [initialMemory])

  const handleValueChange = React.useCallback(
    (index: number, value: string) => {
      const numericValue = memory[index].type == AsmEngine.MemoryCellType.Float ? parseFloat(value) : parseInt(value)
      if (isNaN(numericValue)) return

      memory[index].value = numericValue
      setMemory([...memory])
    },
    [memory, setMemory]
  )
  const handleShiftRow = React.useCallback(
    (index: number, dir: 1 | -1) => {
      const target = index + dir
      if (target < 0 || target == memory.length) {
        return
      }

      ;[memory[index], memory[target]] = [memory[target], memory[index]]
      setMemory([...memory])
    },
    [memory, setMemory]
  )
  const handleDropRow = React.useCallback(
    (index: number) => {
      setMemory(memory.filter((e, i) => i != index))
    },
    [memory, setMemory]
  )

  const handleAddRow = React.useCallback(() => {
    setMemory([
      ...memory,
      {
        type: AsmEngine.MemoryCellType.Real,
        value: 0
      }
    ])
  }, [memory, setMemory])

  const handleMemoryTypeChange = React.useCallback(
    (index: number, type: AsmEngine.MemoryCellType) => {
      memory[index].type = type
      setMemory([...memory])
    },
    [memory, setMemory]
  )

  return (
    <Box sx={props.sx}>
      <Box sx={classes.container}>
        <Box sx={classes.tableWrapper}>
          <AsmMemoryTable
            isRunning={isRunning}
            getInitialValue={getInitialMemoryValue}
            data={vmState?.memory ? { ...vmState.memory } : initialMemory}
            onValueChange={handleValueChange}
            onShiftRow={handleShiftRow}
            onDropRow={handleDropRow}
            onMemoryTypeChange={handleMemoryTypeChange}
            sx={classes.table}
          />
          {memory.length > 0 && <Divider />}
        </Box>
        {!isRunning && (
          <>
            <Divider />
            <Sheet sx={classes.buttonContainer}>
              <Button
                startDecorator={<AddCircleOutlineIcon />}
                sx={classes.button}
                disabled={isRunning}
                onClick={handleAddRow}
                color={'primary'}
              >
                {'Добавить ячейку'}
              </Button>
            </Sheet>
          </>
        )}
      </Box>
    </Box>
  )
}
