import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  .btn.dropdown-toggle.no-caret::after {
    display: none !important;
  }

  /* Responsive border utility */
  @media (min-width: 768px) {
    .border-end-md {
      border-right: 1px solid #dee2e6 !important;
    }
  }
`;