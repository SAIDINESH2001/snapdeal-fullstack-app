import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
    z-index: 1060 !important;
  .modal-content {
    height: 85vh;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: none;
    overflow: hidden;
  }

  .modal-body {
    flex: 1 1 auto; 
    overflow-y: auto; 
    padding: 0 24px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
  }
`;

export const ModalHeaderTitle = styled.h5`
  color: #666;
  font-weight: 400;
  font-size: 1.1rem;
  span {
    font-size: 0.85rem;
    color: #999;
  }
`;

export const CartItemRow = styled.div`
  border-bottom: 1px solid #f1f1f1;
  padding: 20px 0;
`;

export const StickyPaymentFooter = styled.div`
  background-color: #2d2d2d;
  color: #fff;
  padding: 20px 30px;
  flex-shrink: 0; 
  border-top: 1px solid #444;
  width: 100%;
`;

export const ActionButton = styled(Button)`
  background-color: #e40046 !important;
  border: none !important;
  font-weight: 700;
  border-radius: 2px;
  font-size: 14px;
  padding: 12px 20px;
  text-transform: uppercase;
  width: 100%;
`;