import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import api from '../../services/axios';

export const AdminDashboard = ({user}) => {
    const [activeTab, setActiveTab] = useState('approvals');
    const [pendingProducts, setPendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProductsByPending = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products/pending');
            setPendingProducts(res.data.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (productId, newStatus) => {
        try {
            await api.patch(`/products/${productId}/status`, { status: newStatus });
            fetchProductsByPending();
        } catch (error) {
            alert("Something went wrong. Please try again.", error);
        }
    };

    useEffect(() => {
        fetchProductsByPending();
    }, []);

    return (
        <Container fluid className="p-0 bg-light min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Row className="g-0">
                <Col md={2} className="bg-white border-end p-4 shadow-sm z-1">
                    <Nav className="flex-column gap-3">
                        <Nav.Link 
                            onClick={() => setActiveTab('approvals')}
                            className={`rounded-3 px-3 py-2 transition-all ${activeTab === 'approvals' ? "bg-danger text-white shadow" : "text-secondary"}`}
                        >
                            Review Queue {pendingProducts.length > 0 && <Badge pill bg="light" text="danger" className="ms-2">{pendingProducts.length}</Badge>}
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => setActiveTab('products')}
                            className={`rounded-3 px-3 py-2 ${activeTab === 'products' ? "bg-danger text-white shadow" : "text-secondary"}`}
                        >
                            Inventory
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => setActiveTab('orders')}
                            className={`rounded-3 px-3 py-2 ${activeTab === 'orders' ? "bg-danger text-white shadow" : "text-secondary"}`}
                        >
                            Orders
                        </Nav.Link>
                    </Nav>
                </Col>

                <Col md={10} className="p-5">
                    <header className="d-flex justify-content-between align-items-end mb-5">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">
                                {activeTab === 'approvals' ? `Hello, ${user?.name}` : activeTab === 'products' ? "Store Inventory" : "Customer Orders"}
                            </h2>
                            <p className="text-muted mb-0">
                                {activeTab === 'approvals' ? `You have ${pendingProducts.length} items waiting for your review today.` : "Keep track of your marketplace performance."}
                            </p>
                        </div>
                        <Button variant="dark" className="rounded-pill px-4 py-2 fw-semibold shadow-sm" onClick={() => window.location.href='/add-product'}>
                            + Create Product
                        </Button>
                    </header>

                    {activeTab === 'approvals' && (
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Table hover responsive className="mb-0">
                                <thead className="bg-light border-bottom">
                                    <tr>
                                        <th className="ps-4 py-3 text-muted fw-medium small">PRODUCT DETAILS</th>
                                        <th className="py-3 text-muted fw-medium small">SELLER INFO</th>
                                        <th className="py-3 text-muted fw-medium small">PRICE</th>
                                        <th className="text-end pe-4 py-3 text-muted fw-medium small">DECISION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-5"><Spinner animation="grow" variant="danger" size="sm" /></td></tr>
                                    ) : pendingProducts.length > 0 ? (
                                        pendingProducts.map(p => (
                                            <tr key={p._id} className="align-middle border-bottom">
                                                <td className="ps-4 py-4">
                                                    <div className="fw-bold text-dark">{p.name}</div>
                                                    <div className="text-muted small">{p.productType} • {p.brand}</div>
                                                </td>
                                                <td className="text-secondary">{p.sellerId?.name || "Independent Seller"}</td>
                                                <td className="fw-semibold text-dark">₹{p.sellingPrice}</td>
                                                <td className="text-end pe-4">
                                                    <Button 
                                                        variant="success" 
                                                        className="rounded-pill btn-sm px-3 me-2 border-0" 
                                                        style={{ backgroundColor: '#2dce89' }}
                                                        onClick={() => handleStatusUpdate(p._id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        variant="link" 
                                                        className="text-danger text-decoration-none btn-sm fw-medium"
                                                        onClick={() => handleStatusUpdate(p._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="text-muted py-4">
                                                    <div className="mb-2">✨</div>
                                                    <p className="mb-0">The queue is empty! Great job keeping up.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};