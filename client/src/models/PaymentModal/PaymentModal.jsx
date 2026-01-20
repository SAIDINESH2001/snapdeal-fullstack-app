import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/axios';

export const PaymentModal = ({ show, handleClose }) => {
  const [step, setStep] = useState('summary');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { cartProducts, quantities, subTotal, savedAddresses, loading } = useCart(show);
  const { user } = useAuth();

  const selectedAddress = savedAddresses?.find(addr => addr.isDefault) || savedAddresses?.[0];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);

    const shippingData = {
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      zipCode: selectedAddress.zipCode,
      phone: user?.phone || selectedAddress.phone
    };

    const orderItems = cartProducts.map(item => ({
      productId: item._id,
      quantity: quantities[item._id] || 1,
      price: item.sellingPrice
    }));

    try {
      if (selectedMethod === 'cod') {
        const verifyRes = await api.post("/users/verify-payment", {
          paymentMethod: 'COD',
          shippingAddress: shippingData,
          items: orderItems,
          razorpay_payment_id: 'COD_PAYMENT_' + Date.now(),
          razorpay_order_id: 'COD_ORDER_' + Date.now(),
          razorpay_signature: 'COD_SIG'
        });

        if (verifyRes.data.success) {
          handleClose();
          navigate('/'); 
        }
        return;
      }

      const { data } = await api.post("/users/create-order", { items: orderItems });

      if (data.success) {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          name: "Snapdeal Clone",
          order_id: data.orderId,
          handler: async function (response) {
            const verificationData = {
              ...response,
              paymentMethod: selectedMethod === 'card' ? 'Card' : 'UPI',
              shippingAddress: shippingData,
              items: orderItems
            };

            const verifyRes = await api.post("/users/verify-payment", verificationData);
            if (verifyRes.data.success) {
              handleClose();
              navigate('/'); 
            }
          },
          prefill: {
            name: user?.name,
            contact: user?.phone,
          },
          theme: { color: "#e40046" },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      if (selectedMethod === 'cod') setIsProcessing(false);
    }
  };

  if (loading) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="checkout-modal" backdrop="static">
      <div className="p-3 d-flex align-items-center justify-content-between text-white" style={{ background: '#e40046', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <span className="fw-bold fs-4 ms-2" style={{ letterSpacing: '-1px' }}>snapdeal</span>
        <span className="material-symbols-outlined cursor-pointer" onClick={handleClose}>close</span>
      </div>

      <div className="bg-white px-4 py-2 border-bottom shadow-sm">
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          {step === 'payment' && (
            <span className="material-symbols-outlined fs-5 me-2 cursor-pointer text-muted" onClick={() => setStep('summary')}>arrow_back</span>
          )}
          <span className={step === 'summary' ? 'fw-bold text-danger' : 'text-muted'}>Summary</span>
          <span className="text-muted opacity-50 mx-1">»»</span>
          <span className={step === 'payment' ? 'fw-bold text-danger' : 'text-muted'}>Payments</span>
        </div>
      </div>

      <Modal.Body className="p-0">
        <Row className="g-0">
          <Col md={7} className="p-4 bg-white border-end" style={{ minHeight: '450px' }}>
            {step === 'summary' ? (
              <>
                <div className="mb-4 border-bottom pb-3">
                  <span className="fw-bold small d-block mb-2">Contact Details</span>
                  <div className="ps-3 text-muted small">{user?.phone ? `+91 ${user.phone}` : "+91 9059558180"}</div>
                </div>
                <div className="mb-4">
                  <span className="fw-bold small d-block mb-3">Delivery Address</span>
                  {selectedAddress && (
                    <div className="ps-3 border p-3 rounded bg-light position-relative" style={{ borderStyle: 'dashed' }}>
                      <div className="fw-bold small mb-1 text-uppercase">{selectedAddress.name || user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                      </div>
                      <span className="material-symbols-outlined text-danger position-absolute top-0 end-0 p-2">check_circle</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="payment-selection">
                <p className="fw-bold small mb-3">Select Payment Method</p>
                <div className="border rounded overflow-hidden">
                  {[
                    { id: 'upi', label: 'UPI', icon: 'payments' },
                    { id: 'card', label: 'Debit/Credit Card', icon: 'credit_card' },
                    { id: 'cod', label: 'Cash On Delivery', icon: 'local_shipping' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === method.id ? 'bg-light' : ''}`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <span className="material-symbols-outlined text-danger me-3">{method.icon}</span>
                      <span className="flex-grow-1 fw-bold small">{method.label}</span>
                      {selectedMethod === method.id && <span className="material-symbols-outlined text-danger fs-5">check_circle</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-top d-flex align-items-center justify-content-between">
              <div className="fw-bold fs-5">₹ {subTotal.toLocaleString()}</div>
              <Button
                disabled={(step === 'summary' && !selectedAddress) || isProcessing}
                style={{ background: '#e40046', border: 'none', padding: '10px 60px', borderRadius: '3px', fontWeight: 'bold' }}
                onClick={() => step === 'summary' ? setStep('payment') : handlePayment()}
              >
                {step === 'summary' ? 'Continue' : isProcessing ? 'Processing...' : (selectedMethod === 'cod' ? 'Place Order' : 'Pay Now')}
              </Button>
            </div>
          </Col>

          <Col md={5} className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
            <h6 className="text-center fw-bold mb-4 small">Order Summary</h6>
            <div className="pe-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {cartProducts.map((item) => {
                const itemQty = quantities?.[item._id] || 1;
                return (
                  <div key={item._id} className="d-flex gap-3 mb-3 pb-3 border-bottom align-items-start">
                    <img src={item.image?.[0]} width="40" height="40" style={{ objectFit: 'contain' }} alt="" />
                    <div className="flex-grow-1" style={{ fontSize: '11px' }}>
                      <div className="text-dark mb-1">{item.name}</div>
                      <div className="text-muted">Qty: {itemQty}</div>
                    </div>
                    <div className="fw-bold small">₹{(item.sellingPrice * itemQty).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-top pt-2">
              <div className="d-flex justify-content-between fw-bold fs-6">
                <span>Total Amount</span><span>₹ {subTotal.toLocaleString()}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};