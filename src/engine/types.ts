// Memory //

export enum MemoryCellType {
  Real,
  Float
}

export interface MemoryCell {
  type: MemoryCellType
  value: number
}

export type Memory = Record<number, MemoryCell>

// Registers //

// prettier-ignore
export enum Register {
  FLAGS,
  IP, SP,
  R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15,
  F0, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15
}

export type Registers = Partial<Record<Register, number>>

export type Address = number

// Stack //

export const STACK_MEM_OFFSET = 0
export const STACK_ITEM_SIZE = 4
export const STACK_MAX_ITEMS = 1000

// Engine //

export enum OperationArgument {
  Register,
  AddressData,
  AddressInstruction
}

export interface Operation {
  args: OperationArgument[]
  handler: (ctx: ExecutionContext, ...args: number[]) => number | void
}

export type Operations = Record<string, Operation>

export type DynamicAddress = {
  term1: keyof typeof Register | number
  term2: keyof typeof Register | number
  sign: 1 | -1
}

export interface Instruction {
  operation: Operation
  args: (DynamicAddress | number)[]
}

export interface ExecutionContext {
  instructions: Instruction[]
  line: number
  memory: Memory
  stack: number[]
  registers: Registers
  done: boolean
}

export type ExecutionContextCreationResult = {
  ctx?: ExecutionContext
  error?: {
    line: number
    description: string
  }
}

export const CODE_COMMENT_START = ';'

export interface CompilationOutput {
  instructions?: Instruction[]
  errors?: {
    line: number
    description: string
  }[]
}
