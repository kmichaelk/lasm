import React from 'react'

import ButtonGroup from '@mui/joy/ButtonGroup'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Tooltip from '@mui/joy/Tooltip'

import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

import * as AsmEngine from '@/engine'

import TooltipIconButton from '../foundation/TooltipIconButton'

const classes = {
  buttonGroup: {
    justifyContent: 'center'
  }
}

type AsmMemoryTableRowInputProps = {
  index: number
  value: number
  editable: boolean
  onValueChange: (index: number, value: string) => void
}
function AsmMemoryTableRowInput(props: AsmMemoryTableRowInputProps) {
  const [buf, setBuf] = React.useState<string>(props.value.toString())
  React.useEffect(() => setBuf(props.value.toString()), [props.value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setBuf(e.target.value)

  const handleCommit = () => {
    if (!props.editable) return
    props.onValueChange(props.index, buf.replace(',', '.'))
    setBuf(props.value.toString())
  }

  return (
    <Input
      color="neutral"
      size="sm"
      variant={props.editable ? 'soft' : 'solid'}
      value={buf}
      onChange={handleChange}
      onBlur={handleCommit}
      disabled={!props.editable}
    />
  )
}

type AsmMemoryTableRowProps = {
  index: number

  address: string
  type: AsmEngine.MemoryCellType
  value: number

  isRunning: boolean
  getInitialValue: (index: number) => number

  onValueChange: (index: number, value: string) => void
  onShiftRow: (index: number, dir: 1 | -1) => void
  onDropRow: (index: number) => void
  onMemoryTypeChange: (index: number, type: AsmEngine.MemoryCellType) => void
}

function AsmMemoryTableRow(props: AsmMemoryTableRowProps) {
  return (
    <tr key={props.index} style={{ height: 45 }}>
      <th scope="row">{props.address}</th>
      <td>
        <ButtonGroup
          size="sm"
          variant="outlined"
          sx={(theme) => ({
            display: 'inline-flex',
            boxShadow: theme.vars.shadow.xs
          })}
          disabled={props.isRunning}
        >
          {Object.entries(AsmEngine.MemoryCellTypeInfo)
            .filter(props.isRunning ? (e) => (e[0] as unknown as AsmEngine.MemoryCellType) == props.type : () => true)
            .map(([type, typeInfo], i) => {
              return (
                <Tooltip key={i} arrow title={typeInfo.displayName}>
                  <Button
                    variant={(type as unknown as AsmEngine.MemoryCellType) == props.type ? 'solid' : 'soft'}
                    onClick={() => props.onMemoryTypeChange(props.index, type as unknown as AsmEngine.MemoryCellType)}
                  >
                    {typeInfo.key}
                  </Button>
                </Tooltip>
              )
            })}
        </ButtonGroup>
      </td>
      <td>
        <AsmMemoryTableRowInput
          index={props.index}
          value={props.isRunning ? props.getInitialValue(parseInt(props.address)) : props.value}
          onValueChange={props.onValueChange}
          editable={!props.isRunning}
        />
      </td>
      <td>
        {props.isRunning ? (
          <Input color="neutral" size="sm" variant="soft" value={props.value} disabled />
        ) : (
          <ButtonGroup size="sm" variant="outlined" sx={classes.buttonGroup}>
            <TooltipIconButton tooltip="Вверх" onClick={() => props.onShiftRow(props.index, -1)}>
              <ArrowUpwardRoundedIcon />
            </TooltipIconButton>
            <TooltipIconButton tooltip="Вниз" onClick={() => props.onShiftRow(props.index, 1)}>
              <ArrowDownwardRoundedIcon />
            </TooltipIconButton>
            <TooltipIconButton tooltip="Удалить" color="danger" onClick={() => props.onDropRow(props.index)}>
              <DeleteOutlineRoundedIcon />
            </TooltipIconButton>
          </ButtonGroup>
        )}
      </td>
    </tr>
  )
}

const MemoizedAsmMemoryTableRow = React.memo(AsmMemoryTableRow)
export default MemoizedAsmMemoryTableRow
