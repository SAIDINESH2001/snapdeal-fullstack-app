import React, { useState } from "react";
import { Row, Col, Form, Modal, Container } from "react-bootstrap";
import * as S from "../../styles/ProductCart/cartModal.style";
import { useCart } from "../../hooks/useCart"; 
import { PaymentModal } from "../PaymentModal/PaymentModal"; 
export const CartModal = ({ show, handleClose }) => {
  const { 
    cartProducts, 
    quantities, 
    loading, 
    subTotal, 
    handleQuantityChange, 
    handleRemove 
  } = useCart(show);

  const [showPayment, setShowPayment] = useState(false);

  const handleOpenPayment = () => {
    handleClose();
    setShowPayment(true); 
  };

  if (loading && cartProducts.length === 0) {
    return (
      <S.StyledModal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-muted">Loading your cart...</p>
        </Modal.Body>
      </S.StyledModal>
    );
  }

  return (
    <>
      <S.StyledModal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton className="px-4 border-0 pt-4 bg-white">
          <S.ModalHeaderTitle>
            Shopping Cart <span>({cartProducts.length} Items)</span>
          </S.ModalHeaderTitle>
        </Modal.Header>

        <Modal.Body style={{ minHeight: "400px" }}>
          {cartProducts.length > 0 ? (
            <>
              <Row className="text-muted small pb-2 border-bottom fw-bold sticky-top bg-white pt-2 mx-0" style={{ zIndex: 10 }}>
                <Col md={5}>Item Details</Col>
                <Col md={1} className="text-center">Price</Col>
                <Col md={2} className="text-center">Quantity</Col>
                <Col md={3}>Delivery with Charges</Col>
                <Col md={1} className="text-end">Subtotal</Col>
              </Row>

              {cartProducts.map((item) => {
                const currentQty = (quantities && quantities[item._id]) ? quantities[item._id] : 1;

                return (
                  <S.CartItemRow key={item._id}>
                    <Row className="align-items-start mx-0 py-3 border-bottom">
                      <Col md={5} className="d-flex gap-3">
                        <img 
                          src={item.image?.[0]} 
                          width="80" 
                          height="80" 
                          alt={item.name} 
                          style={{ objectFit: "contain" }} 
                        />
                        <div>
                          <p className="mb-1 small fw-bold text-dark">{item.name}</p>
                          <p className="extra-small text-muted mb-0" style={{ fontSize: "11px" }}>Brand: {item.brand}</p>
                          <div 
                            className="text-muted mt-2 d-flex align-items-center gap-1 small cursor-pointer"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRemove(item._id)}
                          >
                            <span className="material-symbols-outlined fs-6">close</span> REMOVE
                          </div>
                        </div>
                      </Col>
                      
                      <Col md={1} className="text-center small pt-1">Rs. {item.sellingPrice}</Col>
                      
                      <Col md={2} className="text-center">
                        <Form.Select 
                          size="sm" 
                          value={currentQty} 
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      
                      <Col md={3} className="pt-1">
                        <p className="text-success mb-0 fw-bold small">FREE Delivery</p>
                      </Col>
                      
                      <Col md={1} className="text-end small fw-bold pt-1">
                        Rs. {(item.sellingPrice * currentQty).toLocaleString()}
                      </Col>
                    </Row>
                  </S.CartItemRow>
                );
              })}
            </>
          ) : (
            <EmptyCartView handleClose={handleClose} />
          )}
        </Modal.Body>

        {cartProducts.length > 0 && (
          <CartFooter subTotal={subTotal} onProceed={handleOpenPayment} />
        )}
      </S.StyledModal>

      <PaymentModal 
        show={showPayment} 
        handleClose={() => setShowPayment(false)} 
      />
    </>
  );
};

const EmptyCartView = ({ handleClose }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <span className="material-symbols-outlined text-muted" style={{ fontSize: "64px" }}>shopping_basket</span>
    <h5 className="mt-3 text-muted">Your cart is empty</h5>
    <button className="btn btn-danger mt-3 rounded-0 px-4" onClick={handleClose}>CONTINUE SHOPPING</button>
  </div>
);

const CartFooter = ({ subTotal, onProceed }) => (
  <S.StickyPaymentFooter>
    <Container fluid>
      <Row className="align-items-center">
        <Col md={5}>
          <div className="d-flex flex-column gap-1 small text-secondary">
            <span className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-6 text-white">verified_user</span> Safe Payments
            </span>
          </div>
        </Col>
        <Col md={3} className="ms-auto text-end pe-4">
          <div className="d-flex justify-content-between mb-1 small text-secondary">
            <span>Sub Total:</span>
            <span className="text-white">Rs. {subTotal.toLocaleString()}</span>
          </div>
        </Col>
        <Col md={3}>
          <S.ActionButton onClick={onProceed}>
            Proceed to Pay Rs. {subTotal.toLocaleString()}
          </S.ActionButton>
        </Col>
      </Row>
    </Container>
  </S.StickyPaymentFooter>
);