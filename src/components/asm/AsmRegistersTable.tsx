import React from 'react'

import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Divider from '@mui/joy/Divider'
import { SxProps } from '@mui/joy/styles/types'

import { useProject } from '@/context/project'

import * as AsmEngine from '@/engine'

const classes = {
  container: {
    overflow: 'auto'
  }
}

const getRegisterDisplay = (type: number, value: number) => {
  if (type == AsmEngine.Register.FLAGS) {
    return value.toString(16).padStart(8, '0')
  } else if (type == AsmEngine.Register.IP) {
    return value.toString().padStart(2, '0')
  } else if (type == AsmEngine.Register.SP) {
    return ((AsmEngine.STACK_MAX_ITEMS - value + 1) * AsmEngine.STACK_ITEM_SIZE).toString().padStart(4, '0')
  } else {
    return value
  }
}

type AsmRegistersTableProps = {
  sx?: SxProps
}

export default function AsmRegistersTable(props: AsmRegistersTableProps) {
  const project = useProject()

  return (
    <Box sx={classes.container}>
      <Table variant="soft" borderAxis="bothBetween" stickyHeader sx={props.sx}>
        <thead>
          <tr>
            <th>Регистр</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          {project.vmState!.registers &&
            Object.entries(project.vmState!.registers!).map(([key, value], index) => (
              <tr key={index}>
                <th scope="row">{AsmEngine.Register[key as keyof typeof AsmEngine.Register]}</th>
                <td>{getRegisterDisplay(parseInt(key), value)}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      {project.vmState!.registers && Object.keys(project.vmState!.registers).length && <Divider />}
    </Box>
  )
}
