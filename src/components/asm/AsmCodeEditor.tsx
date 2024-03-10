/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'

import { useColorScheme } from '@mui/joy/styles'
import { SxProps } from '@mui/joy/styles/types'
import Box from '@mui/joy/Box'

import { LanguageSupport, StreamLanguage } from '@codemirror/language'
import { completeFromList } from '@codemirror/autocomplete'
import CodeMirror, {
  Decoration,
  DecorationSet,
  EditorView,
  ReactCodeMirrorRef,
  StateEffect,
  StateField,
  lineNumbers
} from '@uiw/react-codemirror'

import { useProject } from '@/context/project'
import * as AsmEngine from '@/engine'

/* Language support */
const lasmKeywords = Object.keys(AsmEngine.operations).flatMap((w) => [w, w.toUpperCase()])

const LASMLanguage = StreamLanguage.define<{ count: number }>({
  token(stream, state) {
    if (stream.eatSpace()) return null
    if (stream.match(/^;.*/)) return 'lineComment'
    //if (stream.match(/^"[^"]*"/)) return 'string'
    //if (stream.match(/^\d+/)) return 'number'
    if (stream.match(/^\w+/)) return lasmKeywords.indexOf(stream.current()) >= 0 ? 'keyword' : 'variableName'
    if (stream.match(/^[,]/)) return 'punctuation'
    stream.next()
    return 'invalid'
  }
})

const LASMCompletion = LASMLanguage.data.of({
  autocomplete: completeFromList([
    ...lasmKeywords.map((w) => ({ label: w, type: 'keyword' })),
    ...Object.keys(AsmEngine.Register).map((r) => ({ label: r, type: 'enum' }))
  ])
})

const lasmLang = new LanguageSupport(LASMLanguage, [LASMCompletion])
/* ---------------- */

/* Debugger decoration */
const lineHighlightMarkLight = Decoration.line({
  attributes: { style: 'background-color: #fce1c2' }
})
const lineHighlightMarkDark = Decoration.line({
  attributes: { style: 'background-color: #492b08' }
})

let lineHighlightMark = lineHighlightMarkLight

const addLineHighlight = StateEffect.define<number>()
const removeLineHighlight = StateEffect.define<number>()

const lineHighlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(lines, tr) {
    lines = lines.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(addLineHighlight)) {
        lines = Decoration.none
        lines = lines.update({
          add: [lineHighlightMark.range(e.value)]
        })
      } else if (e.is(removeLineHighlight)) {
        lines = lines.update({
          filter: (from, to, value) => false // todo: proper impl
        })
      }
    }
    return lines
  },
  provide: (f) => EditorView.decorations.from(f)
})
/* ------------------- */

type AsmCodeEditorProps = {
  sx?: SxProps
}

export default function AsmCodeEditor(props: AsmCodeEditorProps) {
  const colorScheme = useColorScheme()

  const project = useProject()

  const [highlightPos, setHighlightPos] = React.useState<number>(-1)
  React.useEffect(() => {
    lineHighlightMark = colorScheme.systemMode == 'dark' ? lineHighlightMarkDark : lineHighlightMarkLight
  }, [colorScheme])

  // https://github.com/uiwjs/react-codemirror/issues/314#issuecomment-1557816378
  const ref = React.useRef<ReactCodeMirrorRef | null>(null)

  const updateHighlight = () => {
    if (!ref.current) {
      return
    }

    if (!project.vmState || project.vmState.done) {
      if (highlightPos != -1) {
        ref.current.view!.dispatch({ effects: removeLineHighlight.of(highlightPos) })
      }
      return
    }

    const docPosition = ref.current.view!.state.doc.line(project.vmState.line + 1).from
    ref.current.view!.dispatch({ effects: addLineHighlight.of(docPosition) })
    setHighlightPos(docPosition)
  }

  React.useEffect(updateHighlight, [ref, project.vmState])

  const refConsumer = (editor: ReactCodeMirrorRef) => {
    if (!ref.current && editor?.editor && editor?.state && editor?.view) {
      ref.current = editor
      updateHighlight()
    }
  }

  return (
    <Box sx={React.useMemo(() => ({ overflow: 'auto', ...props.sx }), [props.sx])}>
      <CodeMirror
        ref={refConsumer}
        width="100%"
        height="100%"
        style={{ width: '100%', height: '100%' /* container */ }}
        theme={colorScheme.systemMode == 'dark' ? 'dark' : 'light'}
        readOnly={!!project.vmState}
        value={project.code}
        onChange={project.setCode}
        extensions={[
          lineNumbers({
            formatNumber: (lineNo, state) =>
              (AsmEngine.MEMORY_ADDRESS_INSTRUCTION_SIZE * (lineNo - 1)).toString().padStart(2, '0')
            //formatNumber: (lineNo, state) => (state.doc.lines >= lineNo && state.doc.line(lineNo).length) ?
            //  (MEMORY_ADDRESS_INSTRUCTION_SIZE * (lineNo - 1)).toString().padStart(2, '0')
            //  : 'ㅤㅤ'
          }),
          lasmLang,
          lineHighlightField
        ]}
      />
    </Box>
  )
}
