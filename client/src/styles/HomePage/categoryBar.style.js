import styled from 'styled-components';

export const NavWrapper = styled.div`
  position: relative; 
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eaeaec;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  color: #282c3f;
  border-bottom: 4px solid transparent;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: #ff3f6c;
    border-bottom: 1px solid #ff3f6c;
  }

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 8px;
    object-fit: cover;
  }
`;

export const MegaDropdown = styled.div`
  position: absolute;
  top: 100%; 
  left: 0;
  width: 100%; 
  background: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${({ $show }) => ($show ? "block" : "none")};
  padding: 20px 0;
  border-top: 1px solid #f5f5f6;
`;

export const SectionTitle = styled.h6`
  font-weight: 700;
  font-size: 13px;
  color: #282c3f;
  margin-top: 15px;
  margin-bottom: 8px;
  text-transform: capitalize;
  &:first-child { margin-top: 0; }
`;

export const ListItem = styled.div`
  font-size: 13px;
  color: #7e818c;
  padding: 2px 0;
  cursor: pointer;
  white-space: nowrap;
  &:hover { color: #ff3f6c; font-weight: 500; }
`;

export const ViewAll = styled.div`
  color: #ff3f6c;
  font-size: 12px;
  font-weight: 700;
  margin-top: 4px;
  cursor: pointer;
`;