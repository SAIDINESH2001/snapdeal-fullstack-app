import React, { useState } from "react";
import { Row, Col, Form, Modal, Container, Button } from "react-bootstrap";
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
        <Modal.Header closeButton className="px-3 px-md-4 py-3 py-md-4 border-bottom bg-white">
          <S.ModalHeaderTitle>
            Shopping Cart <span>({cartProducts.length} Items)</span>
          </S.ModalHeaderTitle>
        </Modal.Header>

        <Modal.Body 
          style={{ minHeight: "400px" }} 
          className="px-2 px-md-3 py-3"
        >
          {cartProducts.length > 0 ? (
            <>
              <Row 
                className="text-muted small pb-2 mb-2 border-bottom fw-bold sticky-top bg-white pt-2 mx-0 d-none d-lg-flex"
                style={{ zIndex: 10, top: 0 }}
              >
                <Col lg={5}>Item Details</Col>
                <Col lg={1} className="text-center">Price</Col>
                <Col lg={2} className="text-center">Quantity</Col>
                <Col lg={3}>Delivery</Col>
                <Col lg={1} className="text-end">Subtotal</Col>
              </Row>

              {cartProducts.map((item) => {
                const currentQty = quantities[item._id] || 1;

                return (
                  <React.Fragment key={item._id}>
                    <S.CartItemRow className="d-none d-lg-block">
                      <Row className="align-items-start mx-0 py-3 py-md-4 border-bottom">
                        <Col md={5} className="d-flex gap-2 gap-md-3">
                          <div 
                            className="bg-light rounded p-1 p-md-2 d-flex align-items-center justify-content-center"
                            style={{ flexShrink: 0 }}
                          >
                            <img 
                              src={item.image?.[0]} 
                              width="90" 
                              height="90" 
                              style={{ objectFit: "contain" }} 
                              alt="" 
                            />
                          </div>
                          <div className="flex-grow-1">
                            <p 
                              className="mb-2 fw-semibold text-dark"
                              style={{ fontSize: "14px", lineHeight: "1.4" }}
                            >
                              {item.name}
                            </p>
                            <div 
                              className="text-danger mt-2 d-flex align-items-center gap-1 fw-semibold cursor-pointer"
                              style={{ fontSize: "13px" }}
                              onClick={() => handleRemove(item._id)}
                            >
                              <span 
                                className="material-symbols-outlined"
                                style={{ fontSize: "18px" }}
                              >
                                delete
                              </span>
                              REMOVE
                            </div>
                          </div>
                        </Col>
                        
                        <Col lg={1} className="text-center pt-1" style={{ fontSize: "14px" }}>
                          ₹{item.sellingPrice?.toLocaleString()}
                        </Col>

                        <Col lg={2} className="text-center">
                          <Form.Select 
                            size="sm"
                            value={currentQty}
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            style={{ fontSize: "14px" }}
                          >
                            {[1, 2, 3].map((num) => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </Form.Select>
                        </Col>

                        <Col lg={3} className="pt-1 text-success fw-bold" style={{ fontSize: "13px" }}>
                          FREE Delivery
                        </Col>

                        <Col lg={1} className="text-end fw-bold pt-1" style={{ fontSize: "15px" }}>
                          ₹{(item.sellingPrice * currentQty).toLocaleString()}
                        </Col>
                      </Row>
                    </S.CartItemRow>

                    <div className="d-lg-none mb-3">
                      <S.CartItemCard>
                        <div className="d-flex gap-3">
                          <div 
                            className="bg-light rounded d-flex align-items-center justify-content-center p-2"
                            style={{ width: "100px", height: "100px", flexShrink: 0 }}
                          >
                            <img 
                              src={item.image?.[0]} 
                              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                              alt="" 
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h6 
                              className="mb-2 fw-semibold text-dark"
                              style={{ fontSize: "15px", lineHeight: "1.4" }}
                            >
                              {item.name}
                            </h6>
                            <div className="mb-2">
                              <span 
                                className="text-danger fw-bold"
                                style={{ fontSize: "20px" }}
                              >
                                ₹{item.sellingPrice?.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-success small fw-semibold mb-3">
                              <span 
                                className="material-symbols-outlined align-middle me-1"
                                style={{ fontSize: "16px" }}
                              >
                                local_shipping
                              </span>
                              FREE Delivery
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2">
                                <span className="text-muted small">Quantity:</span>
                                <Form.Select 
                                  size="sm"
                                  value={currentQty}
                                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                  style={{ width: "70px", fontSize: "14px" }}
                                >
                                  {[1, 2, 3].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </Form.Select>
                              </div>
                              <div 
                                className="text-danger d-flex align-items-center gap-1 fw-semibold cursor-pointer"
                                style={{ fontSize: "13px" }}
                                onClick={() => handleRemove(item._id)}
                              >
                                <span 
                                  className="material-symbols-outlined"
                                  style={{ fontSize: "18px" }}
                                >
                                  delete
                                </span>
                                REMOVE
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                          <span className="text-muted small">Item Subtotal:</span>
                          <span 
                            className="fw-bold text-dark"
                            style={{ fontSize: "18px" }}
                          >
                            ₹{(item.sellingPrice * currentQty).toLocaleString()}
                          </span>
                        </div>
                      </S.CartItemCard>
                    </div>
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <div className="text-center py-5">
              <h5 className="text-muted">Your cart is empty</h5>
              <Button 
                className="btn-danger mt-3" 
                onClick={handleClose}
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          )}
        </Modal.Body>

        {cartProducts.length > 0 && (
          <S.StickyPaymentFooter>
            <Container fluid className="px-0">
              <Row className="align-items-center mx-0 g-3">
                <Col xs={12} md={6} className="text-center text-md-end ms-auto pe-md-4">
                  <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                    <span className="text-white small">Sub Total:</span>
                    <span 
                      className="text-white fw-bold"
                      style={{ fontSize: "22px" }}
                    >
                      ₹{subTotal.toLocaleString()}
                    </span>
                  </div>
                </Col>
                <Col xs={12} md={3} className="px-2 px-md-0">
                  <S.ActionButton onClick={handleOpenPayment}>
                    Proceed to Pay ₹{subTotal.toLocaleString()}
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