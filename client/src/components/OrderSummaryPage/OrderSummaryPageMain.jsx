import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import api from "../../services/axios";
import OrderStatusTracker from "./OrderStatusTracker";
import OrderItemList from "./OrderItemList";
import ReviewModal from "./ReviewModal";

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
            } catch (err) { console.error(err); }
        }
        setReviewedProducts(statusMap);
    }, []);

    const fetchOrderDetail = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/my-orders/${orderId}`);
            setOrder(res.data.order);
            if (res.data.order.orderStatus.toLowerCase() === 'delivered') {
                checkReviewStatus(res.data.order.items);
            }
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    }, [orderId, checkReviewStatus]);

    useEffect(() => { fetchOrderDetail(); }, [fetchOrderDetail]);

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
            } catch (err) { console.error(err); }
        }
        setShowReviewModal(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post(`/reviews/upsert/${selectedItem.productId}`, {
                rating, comment, userName: user.name, orderId: order._id
            });
            setReviewedProducts(prev => ({ ...prev, [selectedItem.productId]: true }));
            setShowReviewModal(false);
        } catch (err) { alert(err.response?.data?.message || "Error"); }
        finally { setIsSubmitting(false); }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return { color: "#16a34a", bg: "#f0fdf4", border: "#bcf0da" };
        if (s === 'cancelled') return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
        if (s === 'shipped') return { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };
        return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    };

    if (isLoading) return <div className="text-center py-5">Loading...</div>;
    if (!order) return <div className="text-center py-5">Order not found.</div>;

    const statusStyle = getStatusStyle(order.orderStatus);
    const currentStep = stages.findIndex(s => s.label.toLowerCase() === order.orderStatus.toLowerCase());

    return (
        <div className="w-100 d-flex flex-column align-items-center bg-white" style={{ minHeight: '100vh' }}>
            {/* Header / Breadcrumb */}
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
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)} className="rounded-0 px-3" style={{ fontSize: '12px', fontWeight: '600' }}>
                        BACK TO ORDERS
                    </Button>
                </div>

                {order.orderStatus.toLowerCase() !== 'cancelled' && (
                    <OrderStatusTracker stages={stages} currentStep={currentStep} />
                )}

                <Row className="g-4">
                    <Col md={8}>
                        <Card className="rounded-0 border mb-4" style={{ boxShadow: 'none', border: `1px solid ${statusStyle.border}` }}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: statusStyle.bg }}>
                                <div>
                                    <span className="small text-muted me-2">Current Status:</span>
                                    <span className="fw-bold" style={{ color: statusStyle.color }}>{order.orderStatus.toUpperCase()}</span>
                                </div>
                                <div className="small text-muted">Placed on {new Date(order.orderedAt).toLocaleDateString('en-GB')}</div>
                            </Card.Body>
                        </Card>

                        <OrderItemList 
                            items={order.items} 
                            orderStatus={order.orderStatus} 
                            reviewedProducts={reviewedProducts} 
                            onOpenReview={handleOpenReview} 
                        />
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

            <ReviewModal 
                show={showReviewModal} 
                onHide={() => setShowReviewModal(false)}
                selectedItem={selectedItem}
                rating={rating}
                hover={hover}
                comment={comment}
                isSubmitting={isSubmitting}
                setRating={setRating}
                setHover={setHover}
                setComment={setComment}
                onSubmit={submitReview}
            />
        </div>
    );
};