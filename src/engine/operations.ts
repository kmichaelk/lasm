import { Flags, getRegister } from './interpreter'
import { Address, ExecutionContext, MemoryCell, OperationArgument, Operations, Register } from './types'

const readMemoryOrThrowError = (ctx: ExecutionContext, addr: Address): MemoryCell => {
  const mem = ctx.memory[addr]
  if (!mem) {
    throw `Неустановленный адрес: ${addr}`
  }
  return mem
}

export const operations: Operations = {
  ld: {
    args: [OperationArgument.AddressData, OperationArgument.Register],
    handler: (ctx: ExecutionContext, addr1: Address, reg1: Register) => {
      ctx.registers[reg1] = readMemoryOrThrowError(ctx, addr1).value!
    }
  },
  st: {
    args: [OperationArgument.Register, OperationArgument.AddressData],
    handler: (ctx: ExecutionContext, reg1: Register, addr1: Address) => {
      readMemoryOrThrowError(ctx, addr1).value = getRegister(ctx, reg1)
    }
  },
  mov: {
    args: [OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register) => {
      ctx.registers[reg2] = getRegister(ctx, reg1)
    }
  },

  inc: {
    args: [OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register) => {
      ctx.registers[reg1] = getRegister(ctx, reg1) + 1
    }
  },
  dec: {
    args: [OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register) => {
      ctx.registers[reg1] = getRegister(ctx, reg1) - 1
    }
  },

  add: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) + getRegister(ctx, reg2)
    }
  },
  fadd: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) + getRegister(ctx, reg2)
    }
  },
  //
  mul: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) * getRegister(ctx, reg2)
    }
  },
  fmul: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) * getRegister(ctx, reg2)
    }
  },
  //
  div: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = Math.round(getRegister(ctx, reg1) / getRegister(ctx, reg2))
    }
  },
  fdiv: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = Math.round(getRegister(ctx, reg1) / getRegister(ctx, reg2))
    }
  },
  //
  sub: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) - getRegister(ctx, reg2)
    }
  },
  fsub: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) - getRegister(ctx, reg2)
    }
  },

  cmp: {
    args: [OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register) => {
      const val1 = getRegister(ctx, reg1)
      const val2 = getRegister(ctx, reg2)

      if (val1 == val2) {
        ctx.registers[Register.FLAGS]! |= Flags.Equals
      } else {
        ctx.registers[Register.FLAGS]! &= ~Flags.Equals
      }

      if (val1 < val2) {
        ctx.registers[Register.FLAGS]! |= Flags.Less
      } else {
        ctx.registers[Register.FLAGS]! &= ~Flags.Less
      }

      if (val1 > val2) {
        ctx.registers[Register.FLAGS]! |= Flags.Greater
      } else {
        ctx.registers[Register.FLAGS]! &= ~Flags.Greater
      }
    }
  },

  and: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) & getRegister(ctx, reg2)
    }
  },
  or: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) | getRegister(ctx, reg2)
    }
  },
  xor: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) ^ getRegister(ctx, reg2)
    }
  },
  not: {
    args: [OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg: Register, reg3: Register) => {
      ctx.registers[reg3] = ~getRegister(ctx, reg)
    }
  },

  shr: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) >> getRegister(ctx, reg2)
    }
  },
  shl: {
    args: [OperationArgument.Register, OperationArgument.Register, OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg1: Register, reg2: Register, reg3: Register) => {
      ctx.registers[reg3] = getRegister(ctx, reg1) << getRegister(ctx, reg2)
    }
  },

  jmp: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      return addr1
    }
  },

  je: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (ctx.registers[Register.FLAGS]! & Flags.Equals) {
        return addr1
      }
    }
  },
  jne: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (!(ctx.registers[Register.FLAGS]! & Flags.Equals)) {
        return addr1
      }
    }
  },
  jl: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (!(ctx.registers[Register.FLAGS]! & Flags.Less)) {
        return addr1
      }
    }
  },
  jle: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (ctx.registers[Register.FLAGS]! & Flags.Less || ctx.registers[Register.FLAGS]! & Flags.Equals) {
        return addr1
      }
    }
  },
  jg: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (ctx.registers[Register.FLAGS]! & Flags.Greater) {
        return addr1
      }
    }
  },
  jge: {
    args: [OperationArgument.AddressInstruction],
    handler: (ctx: ExecutionContext, addr1: Address) => {
      if (ctx.registers[Register.FLAGS]! & Flags.Greater || ctx.registers[Register.FLAGS]! & Flags.Equals) {
        return addr1
      }
    }
  },

  push: {
    args: [OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg: Register) => {
      if (!ctx.registers[Register.SP]) {
        ctx.registers[Register.SP] = 0
      }
      ctx.stack.splice(ctx.registers[Register.SP]++, 0, ctx.registers[reg] ?? 0)
    }
  },
  pop: {
    args: [OperationArgument.Register],
    handler: (ctx: ExecutionContext, reg: Register) => {
      if (!ctx.registers[Register.SP]) {
        throw `Стек пуст`
      }
      ctx.registers[reg] = ctx.stack[--ctx.registers[Register.SP]]
    }
  },
  call: {
    args: [],
    handler: (ctx: ExecutionContext) => {
      if (!ctx.registers[Register.SP]) {
        ctx.registers[Register.SP] = 0
      }
      ctx.stack.splice(ctx.registers[Register.SP]++, 0, (ctx.line! + 1) * 4)
      return 0
    }
  },
  ret: {
    args: [],
    handler: (ctx: ExecutionContext) => {
      if (!ctx.registers[Register.SP]) {
        throw `Стек пуст, адрес возврата не установлен`
      }
      console.log(ctx.stack)
      return ctx.stack[--ctx.registers[Register.SP]] / 4
    }
  },

  nop: {
    args: [],
    handler: () => {}
  },
  empty: {
    args: [],
    handler: () => {}
  }
}
