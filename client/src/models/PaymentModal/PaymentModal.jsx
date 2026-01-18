import React, { useState } from 'react';
import { Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const PaymentModal = ({ show, handleClose }) => {
  const [step, setStep] = useState('summary'); 
  const [paymentSubStep, setPaymentSubStep] = useState('main'); 
  const [selectedMethod, setSelectedMethod] = useState('upi');
  
  const { cartProducts, quantities, subTotal, savedAddresses, loading } = useCart(show);
  const { user } = useAuth();

  const selectedAddress = savedAddresses?.find(addr => addr.isDefault) || savedAddresses?.[0];

  const handleBack = () => {
    if (paymentSubStep !== 'main') {
      setPaymentSubStep('main');
    } else {
      setStep('summary');
    }
  };
  if(loading) return;
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="checkout-modal" backdrop="static">
      <div className="p-3 d-flex align-items-center justify-content-between text-white" style={{ background: '#e40046', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <span className="fw-bold fs-4 ms-2" style={{ letterSpacing: '-1px' }}>snapdeal</span>
        <div className="d-flex align-items-center gap-3">
          <div className="small d-flex align-items-center gap-1" style={{ cursor: 'pointer' }}>
            English <span className="material-symbols-outlined fs-6">expand_more</span>
          </div>
          <span className="material-symbols-outlined cursor-pointer" style={{ fontSize: '24px' }} onClick={handleClose}>close</span>
        </div>
      </div>

      <div className="bg-white px-4 py-2 border-bottom shadow-sm">
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          {(step === 'payment' || paymentSubStep !== 'main') && (
            <span className="material-symbols-outlined fs-5 me-2 cursor-pointer text-muted" onClick={handleBack}>arrow_back</span>
          )}
          <span className={step === 'summary' ? 'fw-bold text-danger' : 'text-muted'}>Summary</span>
          <span className="text-muted opacity-50 mx-1">»»</span>
          <span className={step === 'payment' ? 'fw-bold text-danger' : 'text-muted'}>Payments</span>
        </div>
      </div>

      <Modal.Body className="p-0" style={{ backgroundColor: '#fff' }}>
        <Row className="g-0">
          <Col md={7} className="p-4 bg-white border-end" style={{ minHeight: '480px' }}>
            {step === 'summary' ? (
              <>
                <div className="mb-4 border-bottom pb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light rounded-circle p-1 d-flex align-items-center">
                        <span className="material-symbols-outlined text-muted fs-5">person</span>
                      </div>
                      <span className="fw-bold small">Contact Details</span>
                    </div>
                    <span className="text-danger extra-small fw-bold cursor-pointer" style={{fontSize: '11px'}}>Change</span>
                  </div>
                  <div className="ps-5 text-muted small">
                    {user?.phone ? `+91 ${user.phone}` : "+91 9059558180"}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-light rounded-circle p-1 d-flex align-items-center">
                      <span className="material-symbols-outlined text-muted fs-5">location_on</span>
                    </div>
                    <span className="fw-bold small">Delivery Address</span>
                  </div>
                  {selectedAddress && (
                    <div className="ps-4 ms-2 border p-3 rounded bg-light position-relative" style={{ borderStyle: 'dashed' }}>
                      <div className="fw-bold small mb-1 text-uppercase">{selectedAddress.name || user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '11px', lineHeight: '1.6' }}>
                        +91 {user?.phone}<br />
                        {selectedAddress.street}<br />
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                      </div>
                      <div className="position-absolute top-0 end-0 p-2">
                         <span className="material-symbols-outlined text-danger fs-5">check_circle</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="payment-area">
                {paymentSubStep === 'main' && (
                  <>
                    <p className="fw-bold small mb-3">UPI, Cards & More</p>
                    <div className="border rounded overflow-hidden">
                      <div className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === 'upi' ? 'bg-light' : ''}`} onClick={() => { setSelectedMethod('upi'); setPaymentSubStep('upi_detail'); }}>
                        <span className="material-symbols-outlined text-danger me-3">payments</span>
                        <div className="flex-grow-1 fw-bold small">UPI</div>
                        <span className="material-symbols-outlined text-muted fs-6">chevron_right</span>
                      </div>
                      <div className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === 'card' ? 'bg-light' : ''}`} onClick={() => { setSelectedMethod('card'); setPaymentSubStep('card_detail'); }}>
                        <span className="material-symbols-outlined text-danger me-3">credit_card</span>
                        <div className="flex-grow-1 fw-bold small">Card</div>
                        <span className="material-symbols-outlined text-muted fs-6">chevron_right</span>
                      </div>
                      <div className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === 'wallet' ? 'bg-light' : ''}`} onClick={() => setSelectedMethod('wallet')}>
                        <span className="material-symbols-outlined text-danger me-3">account_balance_wallet</span>
                        <div className="flex-grow-1 fw-bold small">Wallet</div>
                        {selectedMethod === 'wallet' && <span className="material-symbols-outlined text-danger fs-5">check_circle</span>}
                      </div>
                      <div className={`d-flex align-items-center p-3 cursor-pointer ${selectedMethod === 'cod' ? 'bg-light' : ''}`} onClick={() => setSelectedMethod('cod')}>
                        <span className="material-symbols-outlined text-danger me-3">local_shipping</span>
                        <div className="flex-grow-1">
                          <div className="fw-bold small">Cash On Delivery</div>
                          <div className="extra-small text-muted" style={{fontSize: '10px'}}>Pay at the time of delivery</div>
                        </div>
                        {selectedMethod === 'cod' && <span className="material-symbols-outlined text-danger fs-5">check_circle</span>}
                      </div>
                    </div>
                  </>
                )}

                {paymentSubStep === 'upi_detail' && (
                  <div className="upi-detail">
                    <p className="fw-bold small mb-3">Pay With UPI ID/ Mobile Number</p>
                    <div className="border rounded p-3 mb-3 bg-white">
                       <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-danger">payments</span>
                          <span className="small fw-bold">Add UPI ID/ Mobile Number</span>
                          <span className="material-symbols-outlined ms-auto text-danger">check_circle</span>
                       </div>
                       <Form.Control type="text" placeholder="Enter UPI ID/ Mobile Number" className="mb-2" />
                       <Form.Check type="checkbox" label="Securely save your UPI information" className="extra-small text-muted" style={{fontSize: '11px'}} defaultChecked />
                    </div>
                    <p className="fw-bold small mb-3">Or, Pay Using Phone Number</p>
                    <div className="border rounded p-3 d-flex align-items-center justify-content-between">
                       <div className="d-flex align-items-center gap-3">
                          <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" width="20" alt="" />
                          <div className="small fw-bold">Google Pay</div>
                       </div>
                       <span className="material-symbols-outlined text-muted">radio_button_unchecked</span>
                    </div>
                  </div>
                )}

                {paymentSubStep === 'card_detail' && (
                  <div className="card-detail">
                    <p className="fw-bold small mb-3">Add New Card</p>
                    <Row className="g-3">
                       <Col md={8}><Form.Control placeholder="Card Number" /></Col>
                       <Col md={4}><Form.Control placeholder="Expiry" /></Col>
                       <Col md={8}><Form.Control placeholder="Card Holder's name" /></Col>
                       <Col md={4}><Form.Control placeholder="CVV" /></Col>
                    </Row>
                    <Form.Check type="checkbox" label="Save card securely for future payments" className="mt-3 small text-muted" style={{fontSize: '11px'}} />
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 pt-4 border-top d-flex align-items-center justify-content-between">
              <div className="fw-bold fs-5">₹ {subTotal.toLocaleString()}</div>
              <Button 
                disabled={step === 'summary' && !selectedAddress}
                style={{ background: '#e40046', border: 'none', padding: '10px 60px', borderRadius: '3px', fontWeight: 'bold' }}
                onClick={() => step === 'summary' ? setStep('payment') : alert(`Paying via ${selectedMethod}`)}
              >
                {step === 'summary' ? 'Continue' : 'Pay Now'}
              </Button>
            </div>
          </Col>

          <Col md={5} className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
             <h6 className="text-center fw-bold mb-4 small">Order Summary</h6>
             <div className="pe-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {cartProducts.map((item) => (
                  <div key={item._id} className="d-flex gap-3 mb-3 pb-3 border-bottom align-items-start">
                    <img src={item.image?.[0]} width="45" height="45" style={{ objectFit: 'contain' }} alt="" />
                    <div className="flex-grow-1" style={{ fontSize: '12px' }}>
                      <div className="text-dark mb-1 lh-sm">{item.name}</div>
                      <div className="text-muted">Qty: {quantities?.[item._id] || 1}</div>
                    </div>
                    <div className="fw-bold small">₹{item.sellingPrice.toLocaleString()}</div>
                  </div>
                ))}
             </div>
             <div className="mt-4 pt-2">
                <div className="d-flex justify-content-between small mb-1 text-muted">
                  <span>Price</span><span>₹ {subTotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2 fs-6">
                  <span>Total Amount</span><span>₹ {subTotal.toLocaleString()}</span>
                </div>
                <div className="text-center mt-5">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" width="80" alt="" style={{ opacity: 0.6 }} />
                </div>
             </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};