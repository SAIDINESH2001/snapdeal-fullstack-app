import React from 'react';
import { Container, Row, Col, Form, Modal } from 'react-bootstrap';
import * as S from '../../styles/ProductCart/cartModal.style'; 

export const CartModal = ({ show, handleClose }) => {
  const mockCartItems = [
    {
      id: 1,
      name: "Dazller Eyeliner, Black, Velvet Matte, Washable, Water-resistant, Smudge-proof, 6.5 ml ,Pack of 3",
      price: 164,
      img: "https://via.placeholder.com/80", 
      shade: "Black",
      quantity: 1
    },
    {
      id: 2,
      name: "Renee Black Matte Kajal 1 g Pencil ( Pack of 1 )",
      price: 389,
      img: "https://via.placeholder.com/80",
      shade: "Black",
      quantity: 1
    },
    {
      id: 3,
      name: "Lakme Absolute Skin Gloss Gel Day Cream 50g",
      price: 450,
      img: "https://via.placeholder.com/80",
      shade: "N/A",
      quantity: 1
    }
  ];

  const subTotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <S.StyledModal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="px-4 border-0 pt-4 bg-white">
        <S.ModalHeaderTitle>
          Shopping Cart <span>({mockCartItems.length} Items)</span>
        </S.ModalHeaderTitle>
      </Modal.Header>

      <Modal.Body>
        <Row className="text-muted small pb-2 border-bottom fw-bold sticky-top bg-white pt-2 mx-0" style={{ zIndex: 10 }}>
          <Col md={5}>Item Details</Col>
          <Col md={1} className="text-center">Price</Col>
          <Col md={2} className="text-center">Quantity</Col>
          <Col md={3}>Delivery with Charges
                            <div className="d-flex gap-2">
                  <Form.Control size="sm" placeholder="Pincode" className="w-25 mt-2" style={{fontSize: '12px'}} />
                  <button className="btn btn-dark btn-sm mt-2" style={{fontSize: '11px'}}>CHECK</button>
                </div>
          </Col>
          
          <Col md={1} className="text-end">Subtotal</Col>
        </Row>

        {mockCartItems.map((item) => (
          <S.CartItemRow key={item.id}>
            <Row className="align-items-start mx-0">
              <Col md={5} className="d-flex gap-3">
                <img src={item.img} alt="item" width="80" height="80" style={{objectFit: 'contain'}} />
                <div>
                  <p className="mb-1 small text-dark" style={{lineHeight: '1.4'}}>{item.name}</p>
                  <p className="extra-small text-muted mb-0" style={{fontSize: '11px'}}>Colour Shade: {item.shade}</p>
                  <div className="text-muted mt-2 d-flex align-items-center gap-1" style={{fontSize: '11px', cursor: 'pointer'}}>
                    <span className="material-symbols-outlined fs-6">close</span> REMOVE
                  </div>
                </div>
              </Col>
              <Col md={1} className="text-center small">Rs. {item.price}</Col>
              <Col md={2} className="text-center">
                <Form.Select size="sm" className="w-75 mx-auto" style={{fontSize: '12px'}}>
                  <option>{item.quantity}</option>
                  <option>2</option>
                  <option>3</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <p className="text-muted mb-2" style={{fontSize: '11px'}}>Check delivery for your pincode</p>
              </Col>
              <Col md={1} className="text-end small">Rs. {item.price * item.quantity}</Col>
            </Row>
          </S.CartItemRow>
        ))}
      </Modal.Body>

      <S.StickyPaymentFooter>
        <Container fluid>
          <Row className="align-items-center">
            <Col md={5}>
              <div className="d-flex flex-column gap-1 small text-secondary">
                <span className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined fs-6 text-white">verified_user</span> 
                  Safe and Secure Payments
                </span>
                <span className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined fs-6 text-white">assignment_return</span> 
                  100% Payment Protection, Easy Returns
                </span>
              </div>
            </Col>
            <Col md={3} className="ms-auto text-end pe-4">
              <div className="d-flex justify-content-between mb-1 small text-secondary">
                <span>Sub Total:</span>
                <span className="text-white">Rs. {subTotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between small text-secondary">
                <span>Delivery Charges:</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
            </Col>
            <Col md={3}>
              <S.ActionButton>Proceed to Pay Rs. {subTotal.toLocaleString()}</S.ActionButton>
            </Col>
          </Row>
        </Container>
      </S.StickyPaymentFooter>
    </S.StyledModal>
  );
};