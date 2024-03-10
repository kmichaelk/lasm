import { ExecutionContext, MemoryCell, compile, createContext, mapMemoryCells, process } from '.'

enum ExecutionErrorType {
  Compilation,
  ContextCreation,
  Runtime
}

class ExecutionError extends Error {
  type: ExecutionErrorType
  data: unknown | null

  constructor(message: string, type: ExecutionErrorType, data: unknown | null) {
    super(message)

    this.type = type
    this.data = data
  }
}

export const execute = (code: string, memory: MemoryCell[], maxDepth: number = 5000): ExecutionContext => {
  const compilation = compile(code)
  if (compilation.errors) {
    throw new ExecutionError('Failed to compile', ExecutionErrorType.Compilation, compilation.errors)
  }

  const build = createContext(compilation.instructions!, mapMemoryCells(memory))
  if (build.error) {
    throw new ExecutionError('Failed to create context', ExecutionErrorType.ContextCreation, build.error)
  }

  const ctx = build.ctx!

  let depth = 0
  while (!ctx.done) {
    try {
      process(ctx)
    } catch (err) {
      throw new ExecutionError('Runtime error', ExecutionErrorType.Runtime, {
        context: ctx,
        error: err
      })
    }
    if (depth++ == maxDepth) {
      throw new ExecutionError('Max depth exceeded', ExecutionErrorType.Runtime, {
        context: ctx
      })
    }
  }

  return ctx
}
