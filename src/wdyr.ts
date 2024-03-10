import * as React from 'react'

if (!import.meta.env.DEV) {
  console.warn('WDYR is enabled in production build')
}

const { default: wdyr } = await import('@welldone-software/why-did-you-render')

wdyr(React, {
  include: [/.*/],
  exclude: [/^BrowserRouter/, /^Link/, /^Route/],
  trackHooks: true,
  trackAllPureComponents: true
})
