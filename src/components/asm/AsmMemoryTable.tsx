import React from 'react'

import Table from '@mui/joy/Table'
import { SxProps } from '@mui/joy/styles/types'

import * as AsmEngine from '@/engine'

import AsmMemoryTableRow from './AsmMemoryTableRow'

type MemoryTableProps = {
  isRunning: boolean
  getInitialValue: (index: number) => number

  data: AsmEngine.Memory

  onValueChange: (index: number, value: string) => void
  onShiftRow: (index: number, dir: 1 | -1) => void
  onDropRow: (index: number) => void
  onMemoryTypeChange: (index: number, type: AsmEngine.MemoryCellType) => void

  sx?: SxProps
}

function AsmMemoryTable(props: MemoryTableProps) {
  return (
    <Table variant="soft" borderAxis="bothBetween" stickyHeader sx={props.sx}>
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Тип</th>
          <th>Значение</th>
          <th>{props.isRunning ? 'Текущее' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(props.data).map(([addr, cell], index) => (
          <AsmMemoryTableRow
            key={index}
            index={index}
            address={addr}
            type={cell.type}
            value={cell.value}
            isRunning={props.isRunning}
            getInitialValue={props.getInitialValue}
            onValueChange={props.onValueChange}
            onShiftRow={props.onShiftRow}
            onDropRow={props.onDropRow}
            onMemoryTypeChange={props.onMemoryTypeChange}
          />
        ))}
      </tbody>
    </Table>
  )
}

const AsmMemoryTableMemoized = React.memo(AsmMemoryTable)
export default AsmMemoryTableMemoized
