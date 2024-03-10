import React from 'react'

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(window.matchMedia(query).matches)

  React.useEffect(() => {
    const matchQueryList = window.matchMedia(query)
    setMatches(matchQueryList.matches)
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    matchQueryList.addEventListener('change', handleChange)
  }, [query])

  return matches
}
