import React from 'react'

import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Divider from '@mui/joy/Divider'
import { SxProps } from '@mui/joy/styles/types'

import { useProject } from '@/context/project'

import * as AsmEngine from '@/engine'
import BlockHeader from '../BlockHeader'

const classes = {
  container: {
    overflow: 'auto',
    marginTop: 4
  }
}

type AsmStackTableProps = {
  sx?: SxProps
}

export default function AsmStackTable(props: AsmStackTableProps) {
  const project = useProject()

  if (!project.vmState!.stack?.length) {
    return null
  }

  const sp = (project.vmState!.registers[AsmEngine.Register.SP] ?? 0) - 1

  return (
    <Box sx={classes.container}>
      <Divider />
      <BlockHeader>Стек</BlockHeader>
      <Divider />
      <Table variant="soft" borderAxis="bothBetween" stickyHeader sx={props.sx}>
        <thead>
          <tr>
            <th>Адрес</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          {project.vmState!.stack.map((value, index) => (
            <tr key={index}>
              <th scope="row">
                {((AsmEngine.STACK_MAX_ITEMS - index) * AsmEngine.STACK_ITEM_SIZE).toString().padStart(4, '0')}
              </th>
              <td style={index == sp ? { fontWeight: 'bold' } : {}}>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Divider />
    </Box>
  )
}
