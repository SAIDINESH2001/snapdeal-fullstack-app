import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../../services/axios";

export const OrdersPageMain = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orderProducts, setOrderProducts] = useState([]);

    const fetchOrderData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/my-orders');
            setOrderProducts(res.data.orders || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return { bg: "#f0fdf4", color: "#16a34a", border: "#bcf0da" };
        if (s === 'cancelled') return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
        if (s === 'shipped') return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
    };

    if (isLoading) return null;

    return (
        <div className="w-100 d-flex flex-column align-items-center bg-white" style={{ minHeight: '100vh' }}>
            <div className="p-3 border-bottom w-100 d-flex justify-content-center bg-white sticky-top" style={{ zIndex: 10 }}>
                <div style={{ width: "80%", fontSize: '12px', color: '#888' }}>
                    Home / My Account / <span style={{ color: '#333', fontWeight: '500' }}>My Orders</span>
                </div>
            </div>

            <Container className="py-5" style={{ width: "80%" }}>
                <Row>
                    <Col md={3} className="border-end pr-md-4">
                        <h5 className="fw-bold mb-4" style={{ fontSize: "14px", color: '#e40046', letterSpacing: '0.5px' }}>MY ACCOUNT</h5>
                        
                        <div className="d-flex align-items-center gap-3 mb-4 p-2" style={{ backgroundColor: '#fcfcfc', borderRadius: '4px' }}>
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: "35px", height: "35px" }}>
                                <span className="material-symbols-outlined fs-5">person</span>
                            </div>
                            <div className="overflow-hidden">
                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '12px' }}>{user?.name || "User"}</div>
                                <div className="text-muted text-truncate" style={{ fontSize: "10px" }}>{user?.email}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                                <span className="material-symbols-outlined fs-5">description</span>
                                <span className="fw-bold" style={{ fontSize: '12px' }}>ORDERS</span>
                            </div>
                            <div className="ps-4 fw-bold" style={{ fontSize: '12px', color: '#e40046', cursor: 'pointer' }}>My Orders</div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                                <span className="material-symbols-outlined fs-5">person</span>
                                <span className="fw-bold" style={{ fontSize: '12px' }}>PROFILE</span>
                            </div>
                            <div className="ps-4 text-muted py-1 cursor-pointer" style={{ fontSize: '12px' }}>Saved Addresses</div>
                            <div className="ps-4 text-muted py-1 cursor-pointer" style={{ fontSize: '12px' }}>Saved Cards</div>
                        </div>
                    </Col>

                    <Col md={9} className="ps-md-5">
                        <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4">
                            <h5 className="m-0 fw-normal" style={{ fontSize: '20px', color: '#333' }}>My Orders</h5>
                            <span className="text-muted" style={{ fontSize: '12px' }}>{orderProducts.length} orders total</span>
                        </div>

                        <div style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "8px" }}>
                            {orderProducts.length === 0 ? (
                                <div className="text-center py-5 border rounded-1">
                                    <h6 className="text-muted fw-normal">You haven't placed any orders yet.</h6>
                                </div>
                            ) : (
                                orderProducts.map((order) => {
                                    const status = getStatusStyle(order.orderStatus);
                                    const displayItems = order.items.slice(0, 5); 
                                    const remaining = order.items.length - 5;

                                    return (
                                        <Card key={order._id} className="mb-4 rounded-0" style={{ border: 'none', borderBottom: '1px solid #eee', boxShadow: 'none' }}>
                                            <Card.Body className="p-0 pb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3 p-2 px-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                                   <div className="d-flex gap-5">
                                                        <div>
                                                            <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Order ID</div>
                                                            <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>#{order._id.toUpperCase()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Placed</div>
                                                            <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>{new Date(order.orderedAt).toLocaleDateString('en-GB')}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Total Price</div>
                                                            <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>₹{order.totalAmount.toLocaleString()}</div>
                                                        </div>
                                                   </div>
                                                   <div className="px-2 py-1 fw-bold" style={{ fontSize: '10px', backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: '2px' }}>
                                                        {order.orderStatus.toUpperCase()}
                                                    </div>
                                                </div>

                                                <Row className="align-items-center px-2">
                                                    <Col md={8}>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            {displayItems.map((item, index) => (
                                                                <div key={index} style={{ 
                                                                    position: 'relative', 
                                                                    width: '60px', 
                                                                    height: '60px', 
                                                                    flexShrink: 0, 
                                                                    border: '1px solid #f0f0f0', 
                                                                    borderRadius: '4px',
                                                                    padding: '2px',
                                                                    backgroundColor: '#fff' 
                                                                }}>
                                                                    <img src={item.image[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                    {index === 4 && remaining > 0 && (
                                                                        <div style={{ 
                                                                            position: 'absolute', inset: 0, 
                                                                            backgroundColor: 'rgba(0,0,0,0.5)', 
                                                                            color: '#fff', fontSize: '11px', 
                                                                            display: 'flex', alignItems: 'center', 
                                                                            justifyContent: 'center', fontWeight: 'bold',
                                                                            borderRadius: '3px'
                                                                        }}>
                                                                            +{remaining}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-2 text-dark fw-bold" style={{ fontSize: '13px' }}>
                                                            {order.items[0]?.name.slice(0, 60)}{order.items[0]?.name.length > 60 ? '...' : ''}
                                                            {order.items.length > 1 && <span className="text-muted fw-normal ms-1"> + {order.items.length - 1} other items</span>}
                                                        </div>
                                                    </Col>

                                                    <Col md={4} className="text-end">
                                                        <Button 
                                                            variant="link" 
                                                            className="p-0 text-decoration-none fw-bold" 
                                                            style={{ fontSize: '12px', color: '#e40046' }}
                                                            onClick={() => navigate(`/order-details/${order._id}`)}
                                                        >
                                                            VIEW DETAILS 
                                                            <span className="material-symbols-outlined align-middle fs-6 ms-1">chevron_right</span>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};