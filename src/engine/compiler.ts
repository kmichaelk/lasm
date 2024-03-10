import { operations } from './operations'
import { MEMORY_ADDRESS_INSTRUCTION_SIZE } from './memory'
import {
  CODE_COMMENT_START,
  CompilationOutput,
  DynamicAddress,
  Instruction,
  OperationArgument,
  Register
} from './types'

const compilationError = (line: number, description: string): CompilationOutput => ({
  errors: [{ line, description }]
})

export const compile = (code: string) => {
  const instructions: Instruction[] = []

  const lines = code.split('\n').map((line) => line.trim())
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    if (line.charAt(0) == CODE_COMMENT_START) {
      instructions.push({
        operation: operations.empty,
        args: []
      })
      continue
    }

    const posComment = line.indexOf(CODE_COMMENT_START)
    if (posComment != -1) {
      line = line.substring(0, posComment)
    }

    const posOpSeparator = line.indexOf(' ')
    let operationName = posOpSeparator == -1 ? line : line.substring(0, posOpSeparator)
    if (operationName == '') {
      operationName = 'empty'
    }
    operationName = operationName.toLowerCase()

    if (!Object.keys(operations).includes(operationName)) {
      return compilationError(i, `неизвестная операция '${operationName}'`)
    }

    const operation = operations[operationName]

    const rest = posOpSeparator == -1 ? '' : line.substring(posOpSeparator + 1)
    const args = rest
      .split(',')
      .map((arg) => arg.trim())
      .filter((arg) => arg.length)

    if (args.length != operation.args.length) {
      return compilationError(i, `дано '${args.length}' аргументов, требуется '${operation.args.length}'`)
    }

    const instruction: Instruction = {
      operation: operation,
      args: []
    }

    for (let j = 0; j < args.length; j++) {
      switch (operation.args[j]) {
        case OperationArgument.AddressData: {
          let addr = args[j].trim()
          if (addr.length < 3 || addr.charAt(0) != '[' || addr.charAt(addr.length - 1) != ']') {
            return compilationError(i, `некорректный формат адреса (аргумент #${j + 1})`)
          }
          addr = addr.substring(1, addr.length - 1).trim()

          if (addr.includes('+') || addr.includes('-')) {
            const terms = addr.split(addr.includes('+') ? '+' : '-')
            if (terms.length != 2) {
              return compilationError(i, `некорректный формат динамического адреса (аргумент #${j + 1})`)
            }

            const [term1, term2] = terms as string[]

            const dynaddr: DynamicAddress = {
              term1: parseInt(term1),
              term2: parseInt(term2),
              sign: addr.includes('+') ? 1 : -1
            }

            if (isNaN(dynaddr.term1 as number)) {
              if (!Object.keys(Register).includes(term1)) {
                return compilationError(i, `неизвестный регистр '${term1}'`)
              }
              dynaddr.term1 = term1 as keyof typeof Register
            }
            if (isNaN(dynaddr.term2 as number)) {
              if (!Object.keys(Register).includes(term2)) {
                return compilationError(i, `неизвестный регистр '${term2}'`)
              }
              dynaddr.term2 = term2 as keyof typeof Register
            }

            instruction.args.push(dynaddr)
          } else {
            const iaddr = parseInt(addr)
            if (isNaN(iaddr)) {
              if (!Object.keys(Register).includes(addr)) {
                return compilationError(i, `некорректный адрес и неизвестный регистр '${addr}'`)
              }
              instruction.args.push({
                term1: 0,
                term2: addr as keyof typeof Register,
                sign: 1
              })
            } else {
              instruction.args.push(iaddr)
            }
          }

          break
        }
        case OperationArgument.AddressInstruction: {
          let addr = args[j].trim()
          if (addr.length < 3 || addr.charAt(0) != '[' || addr.charAt(addr.length - 1) != ']') {
            return compilationError(i, `некорректный формат адреса инструкции (аргумент #${j + 1})`)
          }
          addr = addr.substring(1, addr.length - 1).trim()

          let relativeDir: 1 | 0 | -1 = 0
          if (addr.charAt(0) == '+' || addr.charAt(0) == '-') {
            relativeDir = addr.charAt(0) == '+' ? 1 : -1
            addr = addr.substring(1)
          }

          let iaddr = parseInt(addr)
          if (isNaN(iaddr)) {
            return compilationError(i, `некорректный адрес инструкции (аргумент #${j + 1})`)
          }

          iaddr /= MEMORY_ADDRESS_INSTRUCTION_SIZE

          if (relativeDir != 0) {
            iaddr = i + (relativeDir * (1 + iaddr))
          }

          instruction.args.push(iaddr)

          break
        }
        case OperationArgument.Register: {
          const reg = args[j].toUpperCase().trim()

          if (!Object.keys(Register).includes(reg)) {
            return compilationError(i, `неизвестный регистр '${reg}'`)
          }

          instruction.args.push(Register[reg as keyof typeof Register])

          break
        }
        default: {
          return compilationError(i, 'неподдерживаемый тип аргумента')
        }
      }
    }

    instructions.push(instruction)
  }

  return { instructions }
}
