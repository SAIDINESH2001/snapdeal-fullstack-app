import React, { useState } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const PaymentModal = ({ show, handleClose }) => {
  const [step, setStep] = useState('summary'); 
  const [selectedMethod, setSelectedMethod] = useState('upi');
  
  const { cartProducts, quantities, subTotal, savedAddresses, loading } = useCart(show);
  const { user } = useAuth();

  const selectedAddress = savedAddresses?.find(addr => addr.isDefault) || savedAddresses?.[0];

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      centered 
      className="checkout-modal"
      backdrop="static" 
    >

      <div 
        className="p-3 d-flex align-items-center justify-content-between text-white" 
        style={{ background: '#e40046', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
      >
        <span className="fw-bold fs-4 ms-2" style={{ letterSpacing: '-1px' }}>snapdeal</span>
        <div className="d-flex align-items-center gap-3">
          <div className="small d-flex align-items-center gap-1" style={{ cursor: 'pointer' }}>
            English <span className="material-symbols-outlined fs-6">expand_more</span>
          </div>

          <span 
            className="material-symbols-outlined cursor-pointer" 
            style={{ fontSize: '24px', userSelect: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            close
          </span>
        </div>
      </div>

 
      <div className="bg-white px-4 py-2 border-bottom shadow-sm">
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          {step === 'payment' && (
            <span 
              className="material-symbols-outlined fs-5 me-2 cursor-pointer text-muted" 
              onClick={() => setStep('summary')}
            >
              arrow_back
            </span>
          )}
          <span className={step === 'summary' ? 'fw-bold text-danger' : 'text-muted'}>Summary</span>
          <span className="text-muted opacity-50 mx-1">»»</span>
          <span className={step === 'payment' ? 'fw-bold text-danger' : 'text-muted'}>Payments</span>
        </div>
      </div>

      <Modal.Body className="p-0" style={{ backgroundColor: '#fff', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', overflow: 'hidden' }}>
        <Row className="g-0">
      
          <Col md={7} className="p-4 bg-white border-end" style={{ minHeight: '450px' }}>
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
                  
                  {loading ? (
                    <div className="ps-5 small text-muted">Loading address details...</div>
                  ) : selectedAddress ? (
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
                  ) : (
                    <div className="ps-5 text-muted small italic">No saved addresses found.</div>
                  )}
                </div>
              </>
            ) : (
    
              <div className="payment-methods">
                <p className="fw-bold small mb-3">UPI, Cards & More</p>
                <div className="border rounded overflow-hidden">
                  {[
                    { id: 'upi', label: 'UPI', icon: 'payments', sub: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', label: 'Card', icon: 'credit_card', sub: 'Visa, Mastercard, RuPay' },
                    { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet', sub: 'Airtel Money, Freecharge' },
                    { id: 'cod', label: 'Cash On Delivery', icon: 'local_shipping', sub: 'Pay at the time of delivery' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === method.id ? 'bg-light' : ''}`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <span className="material-symbols-outlined text-danger me-3">{method.icon}</span>
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{method.label}</div>
                        <div className="extra-small text-muted" style={{ fontSize: '10px' }}>{method.sub}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <span className="material-symbols-outlined text-danger fs-5">check_circle</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-top d-flex align-items-center justify-content-between">
              <div>
                 <div className="extra-small text-muted" style={{fontSize: '10px'}}>Total Payable</div>
                 <div className="fw-bold fs-5">₹ {subTotal.toLocaleString()}</div>
              </div>
              <Button 
                disabled={step === 'summary' && (!selectedAddress || loading)}
                style={{ background: '#e40046', border: 'none', padding: '10px 60px', borderRadius: '3px', fontWeight: 'bold' }}
                onClick={() => step === 'summary' ? setStep('payment') : alert("Initiating Razorpay...")}
              >
                {step === 'summary' ? 'Continue' : 'Pay Now'}
              </Button>
            </div>
          </Col>

          <Col md={5} className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
             <h6 className="text-center fw-bold mb-4 small">Order Summary</h6>
             
             <div className="pe-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center py-4 small text-muted">Loading items...</div>
                ) : cartProducts.map((item) => (
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
                <div className="d-flex justify-content-between small mb-2 text-muted">
                  <span>Delivery Charges</span><span className="text-success fw-bold">Free</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2 fs-6">
                  <span>Total Amount</span><span>₹ {subTotal.toLocaleString()}</span>
                </div>
                <div className="text-center mt-4 pt-3">
                   <div className="extra-small text-muted mb-1" style={{fontSize: '10px'}}>Secured by</div>
                   <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                    width="80" 
                    alt="razorpay" 
                    style={{ opacity: 0.6 }} 
                   />
                </div>
             </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};