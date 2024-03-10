import React from 'react'

import * as AsmEngine from '@/engine'

import { decodeBase64, encodeBase64 } from '@/utils/base64Helper'

type ProjectError = {
  title: string
  message: string
}

interface ProjectContextType {
  code: string
  setCode: (code: string) => void
  //
  memory: AsmEngine.MemoryCell[]
  setMemory: (mem: AsmEngine.MemoryCell[]) => void

  error: ProjectError | null
  setError: (err: ProjectError | null) => void

  vmState: AsmEngine.ExecutionContext | null
  setVmState: (ctx: AsmEngine.ExecutionContext | null) => void

  //

  handleRun: () => void
  handleDebug: () => void
  handleShare: () => void
}

const ProjectContext = React.createContext<ProjectContextType | null>(null)

type ProjectProviderProps = React.PropsWithChildren

function ProjectProvider(props: ProjectProviderProps) {
  const [code, setCode] = React.useState<string>('')
  const [memory, setMemory] = React.useState<AsmEngine.MemoryCell[]>([])

  const [error, setError] = React.useState<ProjectError | null>(null)

  const [vmState, setVmState] = React.useState<AsmEngine.ExecutionContext | null>(null)

  ////////////////////////////////////////////////////////////////////////////

  const createExecutionContext = React.useCallback((): AsmEngine.ExecutionContext | undefined => {
    const line = (i: number) => (AsmEngine.MEMORY_ADDRESS_INSTRUCTION_SIZE * i).toString().padStart(2, '0')

    const compilation = AsmEngine.compile(code)
    if (compilation.errors) {
      compilation.errors.forEach((err) => {
        setError({
          title: `Компиляция: строка ${line(err.line)}`,
          message: err.description
        })
      })
      return
    }

    const build = AsmEngine.createContext(compilation.instructions!, AsmEngine.mapMemoryCells(memory))
    if (build.error) {
      setError({
        title: `Сборка: строка ${line(build.error.line)}`,
        message: build.error.description
      })
      return
    }

    return build.ctx
  }, [code, memory])

  const handleRun = React.useCallback(() => {
    setError(null)

    if (vmState) {
      setVmState(null)
      return
    }

    const ctx = createExecutionContext()
    if (!ctx) return

    let depth = 0
    while (!ctx.done) {
      try {
        AsmEngine.process(ctx)
      } catch (err) {
        setError({
          title: `Исполнение: строка ${ctx.line * AsmEngine.MEMORY_ADDRESS_INSTRUCTION_SIZE}`,
          message: err!.toString()
        })
        break
      }
      if (depth++ == 5000) {
        setError({
          title: `Достигнута максимальная глубина вызовов`,
          message: 'Скорее всего, программа работает неправильно'
        })
        break
      }
    }

    setVmState(ctx)
  }, [createExecutionContext, vmState])

  const handleDebug = React.useCallback(() => {
    if (!vmState) {
      setError(null)

      let ctx = createExecutionContext()
      if (!ctx) return

      while (!ctx.done && ctx.instructions[ctx.line].operation == AsmEngine.operations.empty) {
        ctx = AsmEngine.process(ctx)
      }

      setVmState(ctx)
      return
    }

    let ctx: AsmEngine.ExecutionContext
    do {
      try {
        ctx = AsmEngine.process(vmState)
      } catch (err) {
        setError({
          title: `Ошибка при исполнении`,
          message: err!.toString()
        })
        return
      }
    } while (!ctx.done && ctx.instructions[ctx.line].operation == AsmEngine.operations.empty)

    setVmState({ ...ctx })
  }, [createExecutionContext, vmState])

  ////////////////////////////////////////////////////////////////////////////

  // quick & naive impl ... shame
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const vmmem = params.get('vmmem')
      if (!vmmem) return

      const { code, memory } = JSON.parse(decodeBase64(vmmem))
      setCode(code)
      setMemory(memory)
    } catch (err) {
      console.log('Failed to decode shared state')
    }
  }, [])

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set(
      'vmmem',
      encodeBase64(
        JSON.stringify({
          code: code,
          memory: memory
        })
      )
    )
    window.history.pushState({}, '', url)
  }

  ////////////////////////////////////////////////////////////////////////////

  return (
    <ProjectContext.Provider
      value={{
        code,
        setCode,
        //
        memory,
        setMemory,

        error,
        setError,

        vmState,
        setVmState,

        //

        handleRun,
        handleDebug,
        handleShare
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  )
}

function useProject() {
  return React.useContext(ProjectContext)!
}

export { ProjectProvider, useProject }
