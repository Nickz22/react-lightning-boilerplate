import React, { HTMLAttributes, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Colors } from '../utils/constants'

/*
USE:

// An small, outlined button with text of Click Me along with a caret icon placed after text
//Defaults: color = primary, size = medium, variant = contained, disabled = false, iconPlacement = before

import RdnaButton from '@ringdna/common/src/components/RdnaButton'
import SmallDownCaret from '../../../assets/images/SmallDownCaret'

<RdnaButton
  variant="outlined"
  text="Click Me"
  Icon={SmallDownCaret}
  iconPlacement="after"
/>

// Async Example: resetPending true reenables the button after async onClick function resolves

<RdnaButton
  type="outlined"
  text="Click Me"
  onClick={async function}
  asyncButton
  resetPending
/>


*/

export const variants = {
  contained: 'contained',
  outlined: 'outlined',
  text: 'text',
}
export const colorpalettes = {
  primary: 'primary',
  neutral: 'neutral',
  action: 'action',
  alert: 'alert',
}
export const iconplacements = {
  before: 'before',
  after: 'after',
}

const StyledButton = styled.button<{ color: keyof typeof colorpalettes }>`
  font-family: ${(props) => props.theme.typography.fontFamily};
  ${(props) => ({ ...props.theme.typography.button })};
  padding: ${(props) => `${1.5 * props.theme.spacing}px`}
    ${(props) => `${2 * props.theme.spacing}px`};
  border-radius: ${(props) => props.theme.spacing}px;
  display: inline-flex;
  border: 0;
  cursor: pointer;
  transition: 0.25s;
  align-items: center;
  user-select: none;

  &:disabled {
    pointer-events: none;
  }

  & .icon-wrapper {
    display: flex;
  }

  & .icon-wrapper.before {
    margin-right: ${(props) => props.theme.spacing}px;
  }

  & .icon-wrapper.after {
    margin-left: ${(props) => props.theme.spacing}px;
  }

  &.contained {
    color: ${(props) => props.theme.palette[props.color].contrastText};
    background-color: ${(props) => props.theme.palette[props.color].dark};
  }

  &.contained:hover {
    background-color: ${(props) => props.theme.palette[props.color].main};
  }

  &.contained:disabled {
    background-color: ${(props) => props.theme.palette.disabled};
  }

  &.outlined {
    border: 1px solid ${(props) => props.theme.palette[props.color].dark};
    color: ${(props) => props.theme.palette[props.color].dark};
    background-color: transparent;
  }

  &.outlined:hover {
    color: ${(props) => props.theme.palette[props.color].contrastText};
    background-color: ${(props) => props.theme.palette[props.color].main};
  }

  &.outlined:disabled {
    border: 1px solid ${(props) => props.theme.palette.disabled};
    color: ${(props) => props.theme.palette.disabled};
    background-color: transparent;
  }

  &.text {
    color: ${(props) => props.theme.palette[props.color].dark};
    background-color: transparent;
  }

  &.text:hover {
    color: ${(props) => props.theme.palette[props.color].main};
  }

  &.text:disabled {
    color: ${(props) => props.theme.palette.disabled};
  }
`

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  color?: keyof typeof colorpalettes
  Icon?: ({ color }: { color?: Colors }) => JSX.Element
  iconPlacement?: keyof typeof iconplacements
  text?: string
  disabled?: boolean
  name?: string
  className?: string
  type?: 'submit' | 'reset' | 'button'
  href?: string | null
  target?: string | null
  rel?: string | null
  asyncButton?: boolean
  onClick?: any
  resetPending?: boolean
}

export default function RdnaButton({
  variant = 'contained',
  color = 'primary',
  Icon,
  iconPlacement = 'before',
  text,
  disabled,
  name,
  className,
  type,
  href,
  target,
  rel,
  asyncButton = false,
  onClick,
  resetPending,
  ...rest
}: Props) {
  const [isHovering, setIsHovering] = useState(false)
  const [pending, setPending] = useState(false)

  const themeContext = useContext(ThemeContext)
  const theme = themeContext.palette[color]

  const getIconContainer = () => {
    if (!Icon) return null
    let iconColor = variant === 'contained' ? theme.contrastText : theme.main
    if (variant === 'text' && isHovering) iconColor = theme.main
    if (variant === 'outlined' && isHovering) iconColor = theme.contrastText
    if (variant !== 'contained' && disabled) iconColor = theme.light
    return (
      <div className={`icon-wrapper ${iconPlacement}`}>
        <Icon color={iconColor} />
      </div>
    )
  }

  const onPendingClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setPending(true)
    try {
      await onClick(event)
      resetPending && setPending(false)
    } catch (err) {
      setPending(false)
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore temporarily incompatible contentEditable types
    <StyledButton
      as={href ? 'a' : 'button'}
      color={color}
      className={`rdna-button ${variant} ${className || ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={disabled || pending}
      {...(onClick ? { onClick: !asyncButton ? onClick : onPendingClick } : {})}
      {...(type ? { type } : {})}
      {...(name ? { name } : {})}
      {...(href ? { href } : {})}
      {...(target ? { target } : {})}
      {...(rel ? { rel } : {})}
      {...rest}
    >
      {iconPlacement === 'before' && getIconContainer()}
      {text}
      {iconPlacement === 'after' && getIconContainer()}
    </StyledButton>
  )
}
