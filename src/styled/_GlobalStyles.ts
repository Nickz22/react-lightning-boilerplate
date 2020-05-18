import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle<any>`
  :root {
    // html
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-size: 62.5%;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
    text-rendering: optimizeLegibility;
    font-family: Lexend Deca, sans-serif;
  }

  #root {
    margin: 0;
    padding: 0;
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  img {
    border-radius: 5px;
    height: auto;
    width: 10rem;
  }

  div {
    text-align: center;
  }

  a {
    text-decoration: none;
  }
`
