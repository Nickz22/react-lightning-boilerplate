import React from 'react'
import styled from 'styled-components'

type StyledContainerProps = {
  fullWidth?: boolean
  fullVertical?: boolean
  small?: boolean
}

export const Container = styled.div<StyledContainerProps>`
  padding-left: ${({ fullWidth }) => {
    if (fullWidth) return 0
    return 'calc((100vw - 100rem) / 2)'
  }};
  padding-right: ${({ fullWidth }) => {
    if (fullWidth) return 0
    return 'calc((100vw - 100rem) / 2)'
  }};
  padding-top: ${({ fullVertical, small }) => {
    if (fullVertical) return 0
    if (small) return '1rem'
    return '1.75rem'
  }};
  padding-bottom: ${({ fullVertical, small }) => {
    if (fullVertical) return 0
    if (small) return '1rem'
    return '1.75rem'
  }};
`
