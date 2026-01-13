import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  .btn.dropdown-toggle.no-caret::after {
    display: none !important;
  }
`;