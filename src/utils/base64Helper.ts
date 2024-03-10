function encodeUTF8(str: string) {
  const utf8 = new TextEncoder().encode(str)

  let binaryString = ''
  for (let b = 0; b < utf8.length; ++b) {
    binaryString += String.fromCharCode(utf8[b])
  }

  return binaryString
}

function decodeUTF8(binary: string) {
  const bytes = new Uint8Array(binary.length)

  for (let b = 0; b < bytes.length; ++b) {
    bytes[b] = binary.charCodeAt(b)
  }

  return new TextDecoder('utf-8').decode(bytes)
}

export const encodeBase64 = (str: string) => btoa(encodeUTF8(str))
export const decodeBase64 = (str: string) => decodeUTF8(atob(str))
