import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/axios';

export const PaymentModal = ({ show, handleClose, passedProducts, passedQuantities }) => {
  const [step, setStep] = useState('summary');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tempSelectedAddressId, setTempSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });

  const navigate = useNavigate();
  const { cartProducts, quantities, savedAddresses, loading, refreshCart } = useCart(show);
  const { user } = useAuth();

  const activeProducts = passedProducts || cartProducts;
  const activeQuantities = passedQuantities || quantities;

  const activeSubTotal = useMemo(() => {
    return activeProducts.reduce((acc, item) => {
      const qty = activeQuantities[item._id] || 1;
      return acc + (item.sellingPrice * qty);
    }, 0);
  }, [activeProducts, activeQuantities]);

  const activeAddress = savedAddresses?.find(addr => 
    tempSelectedAddressId ? addr._id === tempSelectedAddressId : addr.isDefault
  ) || savedAddresses?.[0];

  useEffect(() => {
    if (savedAddresses?.length > 0 && !tempSelectedAddressId) {
      const def = savedAddresses.find(a => a.isDefault);
      setTempSelectedAddressId(def ? def._id : savedAddresses[0]._id);
    }
  }, [savedAddresses, tempSelectedAddressId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleAddressSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await api.post('/add-address', { ...newAddress, isDefault: savedAddresses?.length === 0 });
      if (res.data.success) {
        if (refreshCart) await refreshCart();
        setStep('summary');
        setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'India' });
      }
    } catch (error) { alert("Failed to save address.", error); }
    finally { setIsProcessing(false); }
  };

  const handlePayment = async () => {
    if (!activeAddress) return alert("Please select a delivery address");
    setIsProcessing(true);

    const shippingData = {
      street: activeAddress.street, city: activeAddress.city, state: activeAddress.state,
      zipCode: activeAddress.zipCode, phone: user?.phone || activeAddress.phone
    };

    const orderItems = activeProducts.map(item => ({
      productId: item._id,
      quantity: activeQuantities[item._id] || 1,
      price: item.sellingPrice,
      size: item.selectedSize || item.size || null,
      name: item.name,           
      image: item.image          
    }));

    try {
      if (selectedMethod === 'cod') {
        const verifyRes = await api.post("/users/verify-payment", {
          paymentMethod: 'COD', shippingAddress: shippingData, items: orderItems,
          razorpay_payment_id: 'COD_PAYMENT_' + Date.now(), razorpay_order_id: 'COD_ORDER_' + Date.now(), razorpay_signature: 'COD_SIG'
        });
        if (verifyRes.data.success) { handleClose(); navigate('/'); }
        return;
      }

      const { data } = await api.post("/users/create-order", { items: orderItems });
      if (data.success) {
        const options = {
          key: data.keyId, amount: data.amount, currency: "INR", name: "Snapdeal Clone", order_id: data.orderId,
          handler: async function (response) {
            const verificationData = { ...response, paymentMethod: selectedMethod === 'card' ? 'Card' : 'UPI', shippingAddress: shippingData, items: orderItems };
            const verifyRes = await api.post("/users/verify-payment", verificationData);
            if (verifyRes.data.success) { handleClose(); navigate('/'); }
          },
          prefill: { name: user?.name, contact: user?.phone },
          theme: { color: "#e40046" },
          modal: { ondismiss: () => setIsProcessing(false) }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) { alert("Payment failed.", error); }
    finally { if (selectedMethod === 'cod') setIsProcessing(false); }
  };

  if (loading && !activeProducts.length) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="checkout-modal" backdrop="static">
      <div className="p-3 d-flex align-items-center justify-content-between text-white" style={{ background: '#e40046', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <span className="fw-bold fs-4 ms-2" style={{ letterSpacing: '-1px' }}>snapdeal</span>
        <span className="material-symbols-outlined cursor-pointer" onClick={handleClose}>close</span>
      </div>

      <div className="bg-white px-4 py-2 border-bottom shadow-sm">
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
          {step !== 'summary' && <span className="material-symbols-outlined fs-5 me-2 cursor-pointer text-muted" onClick={() => setStep('summary')}>arrow_back</span>}
          <span className={step === 'summary' ? 'fw-bold text-danger' : 'text-muted'}>Summary</span>
          <span className="text-muted opacity-50 mx-1">»</span>
          <span className={step === 'address' ? 'fw-bold text-danger' : 'text-muted'}>Add Address</span>
          <span className="text-muted opacity-50 mx-1">»</span>
          <span className={step === 'payment' ? 'fw-bold text-danger' : 'text-muted'}>Payments</span>
        </div>
      </div>

      <Modal.Body className="p-0">
        <Row className="g-0">
          <Col md={7} className="p-4 bg-white border-end" style={{ minHeight: '500px' }}>
            {step === 'summary' && (
              <>
                <div className="mb-4 border-bottom pb-3">
                  <span className="fw-bold small d-block mb-2">Contact Details</span>
                  <div className="ps-3 text-muted small">{user?.phone ? `+91 ${user.phone}` : "+91 9059558180"}</div>
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold small">Delivery Address</span>
                    <Button variant="link" className="text-danger text-decoration-none p-0 small fw-bold" onClick={() => setStep('address')}>+ ADD NEW</Button>
                  </div>
                  <div className="address-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {savedAddresses?.map((addr) => (
                      <div key={addr._id} className={`p-3 rounded mb-2 border cursor-pointer position-relative ${tempSelectedAddressId === addr._id ? 'border-danger bg-light' : ''}`} onClick={() => setTempSelectedAddressId(addr._id)}>
                        <div className="fw-bold small mb-1 text-uppercase">{addr.name || user?.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</div>
                        {tempSelectedAddressId === addr._id && <span className="material-symbols-outlined text-danger position-absolute top-0 end-0 p-2 fs-6">check_circle</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 'address' && (
              <div className="address-form">
                <p className="fw-bold small mb-3">Add New Delivery Address</p>
                <Row className="g-3">
                  <Col md={12}><Form.Control size="sm" placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} /></Col>
                  <Col md={6}><Form.Control size="sm" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} /></Col>
                  <Col md={6}><Form.Control size="sm" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} /></Col>
                  <Col md={6}><Form.Control size="sm" placeholder="Pincode" value={newAddress.zipCode} onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })} /></Col>
                </Row>
                <div className="mt-4 d-flex gap-2">
                  <Button variant="danger" size="sm" className="px-4 fw-bold" onClick={handleAddressSubmit} disabled={isProcessing}>SAVE ADDRESS</Button>
                  <Button variant="light" size="sm" className="px-4 fw-bold border" onClick={() => setStep('summary')}>CANCEL</Button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="payment-selection">
                <p className="fw-bold small mb-3">Select Payment Method</p>
                <div className="border rounded overflow-hidden">
                  {[{ id: 'upi', label: 'UPI', icon: 'payments' }, { id: 'card', label: 'Card', icon: 'credit_card' }, { id: 'cod', label: 'COD', icon: 'local_shipping' }].map((method) => (
                    <div key={method.id} className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedMethod === method.id ? 'bg-light' : ''}`} onClick={() => setSelectedMethod(method.id)}>
                      <span className="material-symbols-outlined text-danger me-3">{method.icon}</span>
                      <span className="flex-grow-1 fw-bold small">{method.label}</span>
                      {selectedMethod === method.id && <span className="material-symbols-outlined text-danger fs-5">check_circle</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step !== 'address' && (
              <div className="mt-auto pt-4 border-top d-flex align-items-center justify-content-between">
                <div className="fw-bold fs-5">₹ {activeSubTotal.toLocaleString()}</div>
                <Button disabled={isProcessing || (step === 'summary' && !activeAddress)} style={{ background: '#e40046', border: 'none', padding: '10px 40px', borderRadius: '3px', fontWeight: 'bold' }} onClick={() => step === 'summary' ? setStep('payment') : handlePayment()}>
                  {isProcessing ? 'Processing...' : step === 'summary' ? 'CONTINUE' : (selectedMethod === 'cod' ? 'PLACE ORDER' : 'PAY NOW')}
                </Button>
              </div>
            )}
          </Col>

          <Col md={5} className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
            <h6 className="text-center fw-bold mb-4 small">Order Summary</h6>
            <div className="pe-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {activeProducts.map((item) => (
                <div key={item._id} className="d-flex gap-3 mb-3 pb-3 border-bottom align-items-start">
                  <img src={item.image?.[0]} width="40" height="40" style={{ objectFit: 'contain' }} alt="" />
                  <div className="flex-grow-1" style={{ fontSize: '11px' }}>
                    <div className="text-dark mb-1">{item.name}</div>
                    <div className="text-muted">Qty: {activeQuantities[item._id] || 1}</div>
                    {(item.selectedSize || item.size) && <div className="text-muted">Size: {item.selectedSize || item.size}</div>}
                  </div>
                  <div className="fw-bold small">₹{(item.sellingPrice * (activeQuantities[item._id] || 1)).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-top pt-2">
              <div className="d-flex justify-content-between fw-bold fs-6">
                <span>Total Amount</span><span>₹ {activeSubTotal.toLocaleString()}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};