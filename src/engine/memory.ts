import { Memory, MemoryCell, MemoryCellType } from './types'

export const MEMORY_ADDRESS_DATA_START = 1000
export const MEMORY_ADDRESS_INSTRUCTION_SIZE = 4

export const MemoryCellTypeInfo: Record<
  MemoryCellType,
  {
    key: string
    displayName: string
    size: number
    parse: (str: string) => number
  }
> = {
  [MemoryCellType.Real]: {
    key: 'R',
    displayName: 'Целое число',
    size: 4,
    parse: (str: string) => parseInt(str)
  },
  [MemoryCellType.Float]: {
    key: 'F',
    displayName: 'Вещественное число',
    size: 8,
    parse: (str: string) => parseFloat(str)
  }
}

export const mapMemoryCells = (cells: MemoryCell[]) => {
  const memory: Memory = {}

  let address = MEMORY_ADDRESS_DATA_START
  for (const cell of cells) {
    memory[address] = cell
    address += MemoryCellTypeInfo[cell.type].size
  }

  return memory
}
