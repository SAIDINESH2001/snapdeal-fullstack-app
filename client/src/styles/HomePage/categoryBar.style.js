import styled from 'styled-components';

export const NavWrapper = styled.div`
  position: relative;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eaeaec;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    gap: 8px;
    padding: 10px 24px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
    padding: 12px 32px;
  }
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
  color: #282c3f;
  border-bottom: 4px solid transparent;
  transition: all 0.2s;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: #ff3f6c;
    border-bottom: 1px solid #ff3f6c;
  }

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 4px;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    padding: 5px;
    font-size: 13px;

    img {
      width: 32px;
      height: 32px;
      margin-right: 6px;
    }
  }

  @media (min-width: 1024px) {
    font-size: 14px;

    img {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
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
  padding: 12px 0;
  border-top: 1px solid #f5f5f6;
  max-height: 70vh;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 16px 0;
    max-height: 80vh;
  }

  @media (min-width: 1024px) {
    padding: 20px 0;
    max-height: none;
  }
`;

export const SectionTitle = styled.h6`
  font-weight: 700;
  font-size: 13px;
  color: #282c3f;
  margin-top: 15px;
  margin-bottom: 8px;
  text-transform: capitalize;

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    color: #ff3f6c;
  }
`;

export const ListItem = styled.div`
  font-size: 13px;
  color: #7e818c;
  padding: 2px 0;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #ff3f6c;
    font-weight: 500;
  }
`;

export const ViewAll = styled.div`
  color: #ff3f6c;
  font-size: 12px;
  font-weight: 700;
  margin-top: 4px;
  cursor: pointer;
`;