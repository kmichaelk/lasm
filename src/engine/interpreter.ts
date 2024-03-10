import { MEMORY_ADDRESS_INSTRUCTION_SIZE } from '.'
import {
  DynamicAddress,
  ExecutionContext,
  ExecutionContextCreationResult,
  Instruction,
  Memory,
  OperationArgument,
  Register,
  Registers
} from './types'

export enum Flags {
  Equals = 1 << 0,
  Less = 1 << 4,
  Greater = 1 << 8
}

export const getRegister = (ctx: ExecutionContext, reg: Register): number => {
  if (!(reg in ctx.registers)) {
    ctx.registers[reg] = 0
  }
  return ctx.registers[reg]!
}

export const contextCreationError = (line: number, description: string) => ({
  error: { line, description }
})

export const createContext = (instructions: Instruction[], memory: Memory): ExecutionContextCreationResult => {
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i]
    for (let j = 0; j < instruction.args.length; j++) {
      switch (instruction.operation.args[j]) {
        case OperationArgument.AddressData: {
          if (typeof instruction.args[j] === 'number' && !((instruction.args[j] as number) in memory)) {
            return contextCreationError(i, `неустановленный адрес: ${instruction.args[j]}`)
          }
          break
        }
        case OperationArgument.AddressInstruction: {
          if (instructions.length < (instruction.args[j] as number)) {
            return contextCreationError(i, `переход на несуществущую строку`)
          }
          break
        }
      }
    }
  }

  const registers: Registers = {
    [Register.FLAGS]: 0,
    [Register.IP]: 0
  }

  return {
    ctx: {
      instructions,
      line: 0,
      memory: structuredClone(memory),
      stack: [],
      registers,
      done: false
    }
  }
}

const getDynamicAddressTerm = (ctx: ExecutionContext, term: keyof typeof Register | number) =>
  typeof term === 'number' ? term : getRegister(ctx, Register[term])

export const process = (ctx: ExecutionContext): ExecutionContext => {
  const instruct = ctx.instructions[ctx.line]

  const args = instruct.args.map((arg) => {
    if (typeof arg === 'number') {
      return arg
    }

    const expression = arg as DynamicAddress

    return getDynamicAddressTerm(ctx, expression.term1) + expression.sign * getDynamicAddressTerm(ctx, expression.term2)
  })

  const jmp = instruct.operation.handler(ctx, ...args)

  if (jmp != undefined) {
    ctx.line = jmp
  } else {
    if (ctx.line + 1 >= ctx.instructions.length) {
      ctx.done = true
    } else {
      ctx.line++
    }
  }

  ctx.registers[Register.IP] = ctx.line * MEMORY_ADDRESS_INSTRUCTION_SIZE

  return ctx
}
