import React from 'react'

import Header from './components/Header'
import { Container } from '../../../styled/Container'

type LayoutProps = {
  children: React.ReactNode
}

export default React.memo(function Layout({ children }: LayoutProps) {
  return (
    <Container fullVertical>
      <Header />
      <Container fullVertical fullWidth>
        {children}
      </Container>
    </Container>
  )
})
