import styled from "styled-components";

export const HeaderBar = styled.header`
  height: auto; 
  min-height: 60px;    
  border-bottom: 1px dashed #eee;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  padding:8px 12px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  
  @media (min-width: 768px) {
    min-height: 70px;
    padding: 10px 16px;
  }
  
  @media (min-width: 1024px) {
    min-height: 80px;
    padding: 12px 24px;
  }

  @media (min-width: 1400px) {
  min-height: 90px;
  padding: 14px 32px
  }
`;

export const DownloadBtn = styled.button`
  background: #e40046;     
  color: #fff;
  border: none;
  height: 36px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  width:auto;
  white-space: nowrap;

  @media (min-width: 768px) {
    height: 40px;
    padding: 0px 16px;
    font-size: 13px;
  }
  
  @media (min-width: 1024px) {
    min-height: 44px;
    padding: 0px 20px;
    font-size: 14px;
    width: 170px;
  }
`;

export const LoginButton = styled.button`
  background: #e40046;
  border: none;
  color: #fff;
  font-weight: 400;
  height: 44px;
  border-radius: 6px;
`;

