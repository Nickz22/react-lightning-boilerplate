import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '../styled/_GlobalStyles'
import { theme } from '../styled/_theme'

import Layout from './pages/Layout'
import Routes from './components/Routes'

export default function App() {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
