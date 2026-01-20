import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import api from "../../services/axios";

export const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewedProducts, setReviewedProducts] = useState({}); 
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stages = [
        { label: 'Order Placed', icon: 'bi-box-seam' },
        { label: 'Processing', icon: 'bi-gear' },
        { label: 'Shipped', icon: 'bi-truck' },
        { label: 'Delivered', icon: 'bi-house-check' }
    ];

    const checkReviewStatus = useCallback(async (items) => {
        const statusMap = {};
        for (const item of items) {
            try {
                const res = await api.get(`/reviews/check-eligibility/${item.productId}`);
                statusMap[item.productId] = res.data.alreadyReviewed;
            } catch (err) {
                console.error("Eligibility check failed", err);
            }
        }
        setReviewedProducts(statusMap);
    }, []);

    const fetchOrderDetail = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/my-orders/${orderId}`);
            const fetchedOrder = res.data.order;
            setOrder(fetchedOrder);
            
            if (fetchedOrder.orderStatus.toLowerCase() === 'delivered') {
                checkReviewStatus(fetchedOrder.items);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [orderId, checkReviewStatus]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    const handleOpenReview = async (item) => {
        setSelectedItem(item);
        setRating(0);
        setComment("");

        if (reviewedProducts[item.productId]) {
            try {
                const res = await api.get(`/products/${item.productId}/reviews`);
                const myReview = res.data.reviews.find(r => (r.user?._id || r.user) === user._id);
                if (myReview) {
                    setRating(myReview.rating);
                    setComment(myReview.comment);
                }
            } catch (err) {
                console.error("Error fetching review", err);
            }
        }
        setShowReviewModal(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post(`/reviews/upsert/${selectedItem.productId}`, {
                rating,
                comment,
                userName: user.name,
                orderId: order._id
            });
            
            setReviewedProducts(prev => ({ ...prev, [selectedItem.productId]: true }));
            setShowReviewModal(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return { color: "#16a34a", bg: "#f0fdf4", border: "#bcf0da" };
        if (s === 'cancelled') return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
        if (s === 'shipped') return { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };
        return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    };

    if (isLoading) return <div className="text-center py-5">Loading Order Details...</div>;
    if (!order) return <div className="text-center py-5">Order not found.</div>;

    const statusStyle = getStatusStyle(order.orderStatus);
    const currentStep = stages.findIndex(s => s.label.toLowerCase() === order.orderStatus.toLowerCase());
    const isCancelled = order.orderStatus.toLowerCase() === 'cancelled';

    return (
        <div className="w-100 d-flex flex-column align-items-center bg-white" style={{ minHeight: '100vh' }}>
            <div className="p-3 border-bottom w-100 d-flex justify-content-center bg-white sticky-top" style={{ zIndex: 10 }}>
                <div style={{ width: "80%", fontSize: '12px', color: '#888' }}>
                    Home / My Orders / <span style={{ color: '#333', fontWeight: '500' }}>#{order._id.toUpperCase()}</span>
                </div>
            </div>

            <Container className="py-5" style={{ width: "80%" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-normal m-0" style={{ fontSize: '22px' }}>Order Details</h4>
                        <p className="text-muted small m-0">Order ID: #{order._id.toUpperCase()}</p>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)} className="rounded-0 border-1 px-3" style={{ fontSize: '12px', fontWeight: '600' }}>
                        BACK TO ORDERS
                    </Button>
                </div>

                {!isCancelled && (
                    <div className="mb-5 px-5">
                        <div className="d-flex justify-content-between position-relative" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div className="position-absolute" style={{ top: '20px', left: '0', right: '0', height: '2px', background: '#eee', zIndex: 0 }}></div>
                            {currentStep > 0 && (
                                <div className="position-absolute" style={{ 
                                    top: '20px', left: '0', 
                                    width: `${(currentStep / (stages.length - 1)) * 100}%`, 
                                    height: '2px', background: '#16a34a', zIndex: 1, transition: 'width 0.4s ease' 
                                }}></div>
                            )}
                            {stages.map((stage, index) => {
                                const isActive = index <= currentStep;
                                return (
                                    <div key={index} className="text-center position-relative" style={{ zIndex: 2 }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                            style={{ 
                                                width: '40px', height: '40px', 
                                                backgroundColor: isActive ? '#16a34a' : '#fff',
                                                border: `2px solid ${isActive ? '#16a34a' : '#eee'}`,
                                                color: isActive ? '#fff' : '#ccc',
                                                fontSize: '18px'
                                            }}>
                                            <i className={`bi ${stage.icon}`}></i>
                                        </div>
                                        <div className="fw-bold" style={{ color: isActive ? '#333' : '#ccc', fontSize: '11px' }}>
                                            {stage.label.toUpperCase()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <Row className="g-4">
                    <Col md={8}>
                        <Card className="rounded-0 border mb-4" style={{ boxShadow: 'none', border: `1px solid ${statusStyle.border}` }}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: statusStyle.bg }}>
                                <div>
                                    <span className="small text-muted me-2">Current Status:</span>
                                    <span className="fw-bold" style={{ color: statusStyle.color }}>{order.orderStatus.toUpperCase()}</span>
                                </div>
                                <div className="small text-muted">
                                    Placed on {new Date(order.orderedAt).toLocaleDateString('en-GB')}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="rounded-0 border mb-4" style={{ boxShadow: 'none' }}>
                            <Card.Header className="bg-white fw-bold small py-3 border-bottom">ITEMS IN THIS ORDER ({order.items.length})</Card.Header>
                            <Card.Body className="p-0">
                                {order.items.map((item, index) => (
                                    <div key={index} className="d-flex align-items-center p-3 border-bottom gap-4">
                                        <div style={{ width: '70px', height: '70px', border: '1px solid #f0f0f0', padding: '2px' }}>
                                            <img src={item.image[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{item.name}</div>
                                            <div className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                                            
                                            {order.orderStatus.toLowerCase() === 'delivered' && (
                                                <button 
                                                    className="btn btn-link p-0 mt-1 text-danger fw-bold text-decoration-none"
                                                    style={{ fontSize: '11px' }}
                                                    onClick={() => handleOpenReview(item)}
                                                >
                                                    {reviewedProducts[item.productId] ? "EDIT REVIEW" : "WRITE A REVIEW"}
                                                </button>
                                            )}
                                        </div>
                                        <div className="fw-bold text-dark">₹{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="rounded-0 border sticky-top" style={{ boxShadow: 'none', top: '80px' }}>
                            <Card.Header className="bg-white fw-bold small border-bottom">PRICE DETAILS</Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-3 small">
                                    <span className="text-muted">Total Price</span>
                                    <span className="text-dark">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 small">
                                    <span className="text-muted">Delivery Charges</span>
                                    <span className="text-success fw-500">FREE</span>
                                </div>
                                <hr className="my-3" style={{ opacity: '0.1' }} />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark">Amount Paid</span>
                                    <span className="fw-bold text-danger fs-5">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered className="rounded-0">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-6 fw-bold">RATE THIS PRODUCT</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center px-4 pb-4">
                    {selectedItem && (
                        <div className="d-flex gap-3 mb-4 align-items-center bg-light p-2 border">
                            <img src={selectedItem.image[0]} width="45" height="45" style={{ objectFit: 'contain' }} alt="" />
                            <span className="small fw-bold text-truncate" style={{maxWidth: '250px'}}>{selectedItem.name}</span>
                        </div>
                    )}
                    <Form onSubmit={submitReview}>
                        <div className="mb-4 d-flex justify-content-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    className="material-symbols-outlined" 
                                    style={{ 
                                        cursor: 'pointer', 
                                        color: (hover || rating) >= star ? '#e40046' : '#ccc', 
                                        fontSize: '40px',
                                        userSelect: 'none'
                                    }}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                >
                                    {(hover || rating) >= star ? 'star' : 'star_outline'}
                                </span>
                            ))}
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={4} 
                            placeholder="Share your experience with this product..." 
                            className="rounded-0 mb-3 shadow-none border"
                            style={{ fontSize: '14px' }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <Button 
                            type="submit" 
                            variant="danger" 
                            className="w-100 rounded-0 fw-bold py-2"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? "SAVING..." : "SAVE REVIEW"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};