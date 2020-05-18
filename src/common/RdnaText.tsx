import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

// types
import { HTMLAttributes } from 'react'

/*
USE:

// An html paragraph tag styled as an h2 with color of secondary, text aligned right and class of .p-as-h2

import RdnaType from '@ringdna/common/src/components/RdnaType'

<RdnaType variant="h2" component="p" color="neutral" align="right" className="p-as-h2">My Text</RdnaType>

*/

// If RdnaType has onClick, it automatically has cursor pointer

export const variants = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'subtitle1',
  subtitle2: 'subtitle2',
  body1: 'body1',
  body2: 'body2',
  body3: 'body3',
  meta: 'meta',
  overline: 'overline',
}

export const components = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  caption: 'caption',
  span: 'span',
}

export const colorpalettes = {
  primary: 'primary',
  neutral: 'neutral',
  link: 'link',
  alert: 'alert',
  contrast: 'contrast',
  action: 'action',
}

export const alignments = {
  left: 'left',
  right: 'right',
  center: 'center',
  justify: 'justify',
}

const mapVariants = (variant: keyof typeof variants) => {
  if (variant.includes('subtitle')) return 'h6'
  if (variant.includes('body') || variant === 'meta') return 'span'
  if (variant === variants.overline) return 'span'
  return variant
}

type TypeBaseProps = {
  variant?: keyof typeof variants
  color?: keyof typeof colorpalettes
  align?: keyof typeof alignments
  bold?: boolean
  link?: boolean
}

const StyledText = styled.p<TypeBaseProps>`
  font-family: ${(props) => props.theme.typography.fontFamily};
  ${(props) => props.variant && { ...props.theme.typography[props.variant] }}
  ${(props) =>
    props.color &&
    css`
      color: ${props.theme.palette.text[props.color]};
    `}
  ${(props) =>
    props.align &&
    css`
      text-align: ${props.align};
    `}
  ${(props) => props.bold && 'font-weight: bold;'}
  ${(props) =>
    props.link &&
    css`
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`

type Props = TypeBaseProps &
  HTMLAttributes<HTMLElement> & {
    children: React.ReactNode
    component?: keyof typeof components | undefined
    className?: string
  }

const RdnaText = forwardRef(
  (
    {
      bold,
      variant = 'body1',
      color = 'primary',
      children,
      component,
      className,
      align,
      ...rest
    }: Props,
    ref
  ) => (
    <StyledText
      // @ts-ignore
      as={component || mapVariants(variant)}
      variant={variant}
      className={className}
      align={align}
      color={color}
      ref={ref as any}
      bold={bold}
      link={!!rest.onClick}
      {...rest}
    >
      {children}
    </StyledText>
  )
)

RdnaText.displayName = 'RdnaText'

export default RdnaText
