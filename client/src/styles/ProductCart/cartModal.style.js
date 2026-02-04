import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
  z-index: 1060 !important;
  
  .modal-content {
    height: 90vh;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: none;
    overflow: hidden;
  }

  .modal-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 0 16px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
  }

  @media (min-width: 768px) {
    .modal-content {
      height: 85vh;
      border-radius: 12px;
    }

    .modal-body {
      padding: 0 24px;
    }
  }

  @media (max-width: 767px) {
    &.modal.show .modal-dialog {
      margin: 0;
      max-width: 100%;
    }
  }
`;

export const ModalHeaderTitle = styled.h5`
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;

  span {
    font-size: 0.85rem;
    color: #999;
    font-weight: 400;
  }

  @media (min-width: 768px) {
    font-size: 1.3rem;

    span {
      font-size: 0.95rem;
    }
  }
`;

export const CartItemCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }

  .cursor-pointer {
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      /* Hover styles continue as per component logic */
    }
  }
`;

export const CartItemRow = styled.div`
  border-bottom: 1px solid #f1f1f1;
  padding: 20px 0;
`;

export const StickyPaymentFooter = styled.div`
  background-color: #2d2d2d;
  color: #fff;
  padding: 16px 20px;
  flex-shrink: 0;
  border-top: 1px solid #444;
  width: 100%;

  @media (min-width: 768px) {
    padding: 20px 30px;
  }
`;

export const ActionButton = styled(Button)`
  background-color: #e40046 !important;
  border: none !important;
  font-weight: 700;
  border-radius: 6px;
  font-size: 13px;
  padding: 14px 20px;
  text-transform: uppercase;
  width: 100%;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(228, 0, 70, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background-color: #c7003d !important;
    box-shadow: 0 4px 12px rgba(228, 0, 70, 0.4);
  }

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 12px 20px;
    border-radius: 4px;
  }
`;