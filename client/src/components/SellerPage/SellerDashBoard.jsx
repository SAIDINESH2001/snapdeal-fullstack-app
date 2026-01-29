import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Box, ShoppingBag, Clock, IndianRupee } from 'lucide-react'; 
import api from '../../services/axios';

export const SellerDashboard = ({ sellerProducts }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [tempStatus, setTempStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchSellerOrders = async () => {
            try {
                const res = await api.get('/seller/orders'); 
                if (res.data.success) {
                    setOrders(res.data.orders);
                    setAnalytics(res.data.analytics);
                }
            } catch (error) {
                console.error("Error fetching seller orders", error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchSellerOrders();
    }, []);

    const productStats = sellerProducts.reduce((acc, product) => {
        acc[product.status] = (acc[product.status] || 0) + 1;
        acc.total += 1;
        return acc;
    }, { approved: 0, pending: 0, rejected: 0, total: 0 });

    const handleShowOrder = (order) => {
        setSelectedOrder(order);
        setTempStatus(order.orderStatus);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setTempStatus("");
    };

    const handleSaveChanges = async () => {
        if (!selectedOrder || !tempStatus) return;
        
        if (tempStatus === selectedOrder.orderStatus) {
            alert("No changes to save.");
            return;
        }

        setUpdatingStatus(true);
        try {
            const res = await api.put(`/seller/orders/${selectedOrder._id}/status`, { status: tempStatus });
            
            if (res.data.success) {
                const updatedOrder = { ...selectedOrder, orderStatus: tempStatus };
                setSelectedOrder(updatedOrder);
                setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updatedOrder : o));
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update status: " + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            case 'shipped': return 'info';
            case 'order packed': return 'primary';
            case 'processing': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Seller Dashboard</h4>
                    <p className="text-muted small mb-0">Overview of your store's performance</p>
                </div>
                <Button 
                    variant="danger" 
                    className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-bold"
                    onClick={() => navigate('/add-product')}
                >
                    <PlusCircle size={18} /> Add New Product
                </Button>
            </div>

            <Row className="g-4 mb-5">
                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#d1fae5' }}>
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-white p-3 rounded-circle text-success shadow-sm d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small fw-bold text-uppercase" style={{fontSize: '11px'}}>Total Revenue</h6>
                                <h4 className="fw-bold text-success mb-0">₹{analytics.totalRevenue.toLocaleString()}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#dbeafe' }}>
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-white p-3 rounded-circle text-primary shadow-sm d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small fw-bold text-uppercase" style={{fontSize: '11px'}}>Total Orders</h6>
                                <h4 className="fw-bold text-primary mb-0">{analytics.totalOrders}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#ffedd5' }}>
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-white p-3 rounded-circle text-warning shadow-sm d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small fw-bold text-uppercase" style={{fontSize: '11px'}}>Pending Orders</h6>
                                <h4 className="fw-bold text-warning mb-0">{analytics.pendingOrders}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#f3f4f6' }}>
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-white p-3 rounded-circle text-secondary shadow-sm d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <Box size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small fw-bold text-uppercase" style={{fontSize: '11px'}}>Total Products</h6>
                                <h4 className="fw-bold text-secondary mb-0">{productStats.total}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={12}>
                    <Card className="border-0 shadow-sm p-4">
                        <h6 className="fw-bold mb-3 text-muted small text-uppercase">Product Approval Status</h6>
                        <ProgressBar style={{ height: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                            <ProgressBar variant="success" now={(productStats.approved / productStats.total) * 100} label={productStats.approved > 0 ? `${productStats.approved} Live` : ''} key={1} />
                            <ProgressBar variant="warning" text="dark" now={(productStats.pending / productStats.total) * 100} label={productStats.pending > 0 ? `${productStats.pending} Review` : ''} key={2} />
                            <ProgressBar variant="danger" now={(productStats.rejected / productStats.total) * 100} label={productStats.rejected > 0 ? `${productStats.rejected} Rejected` : ''} key={3} />
                        </ProgressBar>
                    </Card>
                </Col>
            </Row>

            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: '16px' }}>Recent Customer Orders</h5>
            <Card className="border-0 shadow-sm overflow-hidden mb-5 rounded-3">
                 <Table responsive hover className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr className="text-muted small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                            <th className="py-3 ps-4" style={{ width: '20%' }}>Order ID</th>
                            <th className="py-3" style={{ width: '15%' }}>Customer</th>
                            <th className="py-3" style={{ width: '35%' }}>Items Sold</th>
                            <th className="py-3 text-center" style={{ width: '15%' }}>Earnings</th>
                            <th className="py-3 text-center" style={{ width: '15%' }}>Status</th>
                            <th className="py-3 text-end pe-4" style={{ width: '10%' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingOrders ? (
                             <tr><td colSpan="6" className="text-center py-5 text-muted">Loading orders...</td></tr>
                        ) : orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td className="ps-4">
                                        <div 
                                            className="fw-bold text-primary" 
                                            style={{ fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => handleShowOrder(order)}
                                        >
                                            #{order._id.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="text-dark fw-semibold" style={{ fontSize: '13px' }}>{order.user?.name || "Guest"}</td>
                                    <td className="py-3">
                                        {order.items.slice(0, 1).map((item, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-3">
                                                 <img 
                                                    src={item.image[0]} 
                                                    width="40" height="40" 
                                                    style={{ objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px', padding: '2px' }} 
                                                    alt="" 
                                                 />
                                                 <div style={{ lineHeight: '1.3' }}>
                                                     <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '250px', fontSize: '13px' }}>{item.name}</div>
                                                     <div className="small text-muted" style={{ fontSize: '11px' }}>Qty: {item.quantity}</div>
                                                 </div>
                                            </div>
                                        ))}
                                        {order.items.length > 1 && (
                                            <div className="small text-muted fw-bold ps-5 mt-1" style={{ fontSize: '11px' }}>
                                                + {order.items.length - 1} more items
                                            </div>
                                        )}
                                    </td>
                                    <td className="fw-bold text-success text-center" style={{ fontSize: '14px' }}>₹{order.sellerTotal.toLocaleString()}</td>
                                    <td className="text-center">
                                        <Badge bg={getStatusVariant(order.orderStatus)} className="px-2 py-1 fw-normal" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                                            {order.orderStatus}
                                        </Badge>
                                    </td>
                                    <td className="text-end pe-4 text-muted small">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                             <tr><td colSpan="6" className="text-center py-5 text-muted small">No orders received yet.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: '16px' }}>Product Catalog</h5>
            <Card className="border-0 shadow-sm overflow-hidden rounded-3">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr className="text-muted small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                            <th className="ps-4 py-3" style={{ width: '45%' }}>Product Details</th>
                            <th className="py-3" style={{ width: '15%' }}>Category</th>
                            <th className="py-3" style={{ width: '15%' }}>Price</th>
                            <th className="py-3" style={{ width: '15%' }}>Stock</th>
                            <th className="py-3 text-center" style={{ width: '10%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerProducts.length > 0 ? (
                            sellerProducts.map((p) => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <img 
                                                src={p.image[0]} 
                                                alt={p.name} 
                                                className="rounded border p-1 bg-white"
                                                style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
                                            />
                                            <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{p.name}</div>
                                        </div>
                                    </td>
                                    <td className="text-muted small">{p.productType}</td>
                                    <td className="fw-bold text-dark" style={{ fontSize: '13px' }}>₹{p.sellingPrice.toLocaleString()}</td>
                                    <td className={`small fw-bold ${p.stockQuantity < 5 ? 'text-danger' : 'text-success'}`}>
                                        {p.stockQuantity} Units
                                    </td>
                                    <td className="text-center">
                                        {p.status === 'approved' && <Badge bg="success" className="px-2 py-1" style={{ fontSize: '10px' }}>LIVE</Badge>}
                                        {p.status === 'pending' && <Badge bg="warning" text="dark" className="px-2 py-1" style={{ fontSize: '10px' }}>REVIEW</Badge>}
                                        {p.status === 'rejected' && <Badge bg="danger" className="px-2 py-1" style={{ fontSize: '10px' }}>REJECTED</Badge>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-5 text-muted small">No products listed yet.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold" style={{ fontSize: '18px' }}>
                        Order Details <span className="text-primary">#{selectedOrder?._id.toUpperCase()}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    {selectedOrder && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3 bg-light p-3 rounded">
                                <div>
                                    <p className="mb-0 small text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Customer</p>
                                    <p className="mb-0 fw-bold text-dark" style={{ fontSize: '14px' }}>{selectedOrder.user?.name || "Guest"}</p>
                                </div>
                                <div className="text-end">
                                    <p className="mb-0 small text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Date</p>
                                    <p className="mb-0 text-dark" style={{ fontSize: '14px' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-3 small text-uppercase text-muted" style={{ fontSize: '12px' }}>Items Ordered</h6>
                            <div className="border rounded mb-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center gap-3 p-3 border-bottom last-border-0">
                                        <img 
                                            src={item.image[0]} 
                                            width="50" height="50" 
                                            style={{ objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }} 
                                            alt="" 
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{item.name}</div>
                                            <div className="small text-muted" style={{ fontSize: '12px' }}>Price: ₹{item.price} x {item.quantity}</div>
                                        </div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 p-3 bg-light rounded gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div>
                                        <p className="mb-1 small text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Update Status</p>
                                        <div className="d-flex gap-2">
                                            <Form.Select 
                                                size="sm" 
                                                value={tempStatus} 
                                                onChange={(e) => setTempStatus(e.target.value)}
                                                disabled={updatingStatus}
                                                style={{ width: '180px', fontSize: '13px', fontWeight: '500' }}
                                                className="border-secondary"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Order Packed">Order Packed</option>
                                            </Form.Select>
                                            <Button 
                                                variant="dark" 
                                                size="sm" 
                                                onClick={handleSaveChanges} 
                                                disabled={updatingStatus || tempStatus === selectedOrder.orderStatus}
                                                className="fw-bold"
                                                style={{ fontSize: '12px' }}
                                            >
                                                {updatingStatus ? 'Saving...' : 'Update Status'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <p className="mb-0 small text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Earnings</p>
                                    <h4 className="fw-bold text-success mb-0">₹{selectedOrder.sellerTotal.toLocaleString()}</h4>
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};