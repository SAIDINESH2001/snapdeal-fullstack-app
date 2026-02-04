import styled from "styled-components";

export const Bar = styled.div`
  background-color: #fdecec;   
  height: auto;
  min-height: 32px;               
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #333;;
  padding: 12px 16px;
  width: 100%;

  @media (max-width: 768px) {
  font-size: 10px;
  padding: 10px 12px;
  }

  @media (max=width: 480px) {
  font-size: 9px;
  padding: 6px 8px;
  }
`;

