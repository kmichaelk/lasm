import React from 'react'

import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import Typography from '@mui/joy/Typography'
import Tooltip from '@mui/joy/Tooltip'
import Link from '@mui/joy/Link'
import { SxProps } from '@mui/joy/styles/types'

import * as AsmEngine from '@/engine'
import { useProject } from '@/context/project'

const classes = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    m: 1
  },
  chip: {
    '--Chip-radius': '8px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}

function OperationsBlock(props: {
  title: string
  names: (keyof typeof AsmEngine.operations)[]
  color: React.ComponentProps<typeof Chip>['color']
}) {
  return (
    <Box>
      <Typography fontSize="sm">{props.title}:</Typography>
      <Box sx={classes.container}>
        {props.names.map((s, i) => (
          <Tooltip
            key={i}
            arrow
            title={AsmEngine.operations[s].args
              .map((argt) => '[' + (argt == AsmEngine.OperationArgument.Register ? 'регистр' : 'адрес') + ']')
              .join(', ')}
            enterTouchDelay={50}
          >
            <Chip color={props.color} sx={classes.chip}>
              {s.toUpperCase()}
            </Chip>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}

type SampleProject = {
  name: string
  project: {
    code: string
    memory: AsmEngine.MemoryCell[]
  }
}
function SampleProjectLink(props: SampleProject) {
  const project = useProject()
  return (
    <Link
      onClick={() => {
        project.setCode(props.project.code)
        project.setMemory(props.project.memory)
      }}
    >
      {props.name}
    </Link>
  )
}

type AsmHelpProps = {
  sx?: SxProps
}

function AsmHelp(props: AsmHelpProps) {
  const samples: SampleProject[] = [
    {
      name: 'Возведение числа в степень',
      project: {
        code: `; 1k - a (число)
; 1k4 - n (степень)
; 1k8 - результат

xor R0, R0, R0 ; ноль
xor R1, R1, R1 ; единица
inc R1

ld [1000], R3 ; a
ld [1004], R4 ; n

cmp R4, R0
je [112]

ld [1008], R5 ; res

and R4, R1, R6 ; n & 1
cmp R6, R1
jne [ +4 ]
mul R5, R3, R5 ; res *= a
mul R3, R3, R3 ; a *= a
shr R4, R1, R4 ; n >>= 1

st R3, [1000]
st R5, [1008]

jmp [44]

nop`,
        memory: [
          { type: AsmEngine.MemoryCellType.Real, value: 2 },
          { type: AsmEngine.MemoryCellType.Real, value: 20 },
          { type: AsmEngine.MemoryCellType.Real, value: 1 }
        ]
      }
    },
    {
      name: 'Поиск максимума в массиве',
      project: {
        code: `; int A[10] = { ... };
; int *p = A, *end = A + 10;
; int max = *p++;
; while (p < end) {
;     if (*p > max) {
;         max = *p;
;     }
;     p++;
; }

; 1k00 - A
; 1k04 - N
; 1k08 - sizeof(*A)
; 1k12 - A[0] = *A - начало массива

ld [1000], R1 ; R1 - p
ld [1004], R2 ; R2 - N
ld [1008], R3 ; R3 - sizeof(*A)

mul R2, R3, R5
add R1, R5, R5 ; R5 - end

ld [R1], R4 ; R4 - max
add R1, R3, R1

ld [R1], R6 ; R6 - *p
cmp R6, R4
jle [+4]
mov R6, R4
add R1, R3, R1
cmp R1, R5
jle [-20]

nop ; ответ в R4`,
        memory: [
          { type: AsmEngine.MemoryCellType.Real, value: 1008 },
          { type: AsmEngine.MemoryCellType.Real, value: 10 },
          { type: AsmEngine.MemoryCellType.Real, value: 4 },
          { type: AsmEngine.MemoryCellType.Real, value: 245 },
          { type: AsmEngine.MemoryCellType.Real, value: 765 },
          { type: AsmEngine.MemoryCellType.Real, value: 8854 },
          { type: AsmEngine.MemoryCellType.Real, value: 243 },
          { type: AsmEngine.MemoryCellType.Real, value: 3456 },
          { type: AsmEngine.MemoryCellType.Real, value: 23 },
          { type: AsmEngine.MemoryCellType.Real, value: 87 },
          { type: AsmEngine.MemoryCellType.Real, value: 999 },
          { type: AsmEngine.MemoryCellType.Real, value: 234 },
          { type: AsmEngine.MemoryCellType.Real, value: 22 }
        ]
      }
    }
  ]

  return (
    <Box sx={props.sx}>
      <Box sx={{ p: 1, height: 1, display: 'flex', flexDirection: 'column', userSelect: 'none', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            Команды:
            <Box sx={{ mt: 1, ml: 1 }}>
              <OperationsBlock title="Инструкции доступа к памяти" names={['ld', 'st', 'mov']} color="primary" />
              <OperationsBlock
                title="Арифметические инструкции"
                names={['add', 'fadd', 'sub', 'mul', 'div', 'cmp', 'and', 'or', 'xor', 'not', 'shr', 'shl']}
                color="primary"
              />
              <OperationsBlock
                title="Инструкции управления"
                names={['je', 'jne', 'jl', 'jle', 'jg', 'jge']}
                color="primary"
              />
            </Box>
          </Box>
          <Box>
            Примеры программ:
            <Box component="ul" sx={{ mt: 1 }}>
              {samples.map((sample, i) => (
                <li key={i}>
                  <SampleProjectLink {...sample} />
                </li>
              ))}
            </Box>
          </Box>
        </Box>

        <div style={{ minHeight: 20, flex: 1 }} />

        <Typography textAlign="end">(c) Михаил К., 2023</Typography>
      </Box>
    </Box>
  )
}

const MemoizedAsmHelp = React.memo(AsmHelp)
export default MemoizedAsmHelp
