import { describe, expect, test } from 'vitest'
import * as AsmEngine from '@/engine'

describe('Engine Samples', () => {
  test('pow(2, 20)', () => {
    const resultCtx = AsmEngine.execute(
      `
; 1k - a (число)
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

nop
    `,
      [
        { type: AsmEngine.MemoryCellType.Real, value: 2 },
        { type: AsmEngine.MemoryCellType.Real, value: 20 },
        { type: AsmEngine.MemoryCellType.Real, value: 1 }
      ]
    )

    expect(resultCtx.memory[1008].value).toBe(Math.pow(2, 20)) // 1048576
  })

  test('max(Real[])', () => {
    const numbers = [245, 765, 8854, 243, 3456, 23, 87, 999, 234, 22]
    const resultCtx = AsmEngine.execute(
      `
; int A[10] = { ... };
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

nop ; ответ в R4
    `,
      [
        { type: AsmEngine.MemoryCellType.Real, value: 1008 },
        { type: AsmEngine.MemoryCellType.Real, value: numbers.length },
        { type: AsmEngine.MemoryCellType.Real, value: 4 },
        //
        ...numbers.map((n) => ({ type: AsmEngine.MemoryCellType.Real, value: n }))
        //
      ]
    )

    expect(AsmEngine.getRegister(resultCtx, AsmEngine.Register.R4)).toBe(Math.max(...numbers))
  })
})
