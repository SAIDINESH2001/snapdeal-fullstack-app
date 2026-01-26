import React, { useState } from "react";
import { Row, Col, Form, Modal, Container , Button} from "react-bootstrap";
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
                <Col md={3}>Delivery</Col>
                <Col md={1} className="text-end">Subtotal</Col>
              </Row>

              {cartProducts.map((item) => {
                const currentQty = quantities[item._id] || 1;

                return (
                  <S.CartItemRow key={item._id}>
                    <Row className="align-items-start mx-0 py-3 border-bottom">
                      <Col md={5} className="d-flex gap-3">
                        <img src={item.image?.[0]} width="80" height="80" style={{ objectFit: "contain" }} alt="" />
                        <div>
                          <p className="mb-1 small fw-bold text-dark">{item.name}</p>
                          <div 
                            className="text-muted mt-2 d-flex align-items-center gap-1 small cursor-pointer" 
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
                      <Col md={3} className="pt-1 text-success fw-bold small">FREE Delivery</Col>
                      <Col md={1} className="text-end small fw-bold pt-1">
                        Rs. {(item.sellingPrice * currentQty).toLocaleString()}
                      </Col>
                    </Row>
                  </S.CartItemRow>
                );
              })}
            </>
          ) : (
            <div className="text-center py-5">
              <h5 className="text-muted">Your cart is empty</h5>
              <Button className="btn-danger mt-3" onClick={handleClose}>CONTINUE SHOPPING</Button>
            </div>
          )}
        </Modal.Body>

        {cartProducts.length > 0 && (
          <S.StickyPaymentFooter>
            <Container fluid>
              <Row className="align-items-center">
                <Col md={6} className="text-end ms-auto pe-4">
                  <span className="text-secondary small me-3">Sub Total:</span>
                  <span className="text-white fw-bold">Rs. {subTotal.toLocaleString()}</span>
                </Col>
                <Col md={3}>
                  <S.ActionButton onClick={handleOpenPayment}>
                    Proceed to Pay Rs. {subTotal.toLocaleString()}
                  </S.ActionButton>
                </Col>
              </Row>
            </Container>
          </S.StickyPaymentFooter>
        )}
      </S.StyledModal>

      <PaymentModal 
        show={showPayment} 
        handleClose={() => setShowPayment(false)} 
        passedProducts={cartProducts}
        passedQuantities={quantities}
      />
    </>
  );
};