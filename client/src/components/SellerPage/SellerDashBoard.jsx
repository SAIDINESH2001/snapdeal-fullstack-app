import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Box, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'; 

export const SellerDashboard = ({sellerProducts}) => {
    const navigate = useNavigate();
    const stats = sellerProducts.reduce((acc, product) => {
    acc[product.status] = (acc[product.status] || 0) + 1;
    acc.total += 1;
    
    return acc;
}, { approved: 0, pending: 0, rejected: 0, total: 0 });


    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Seller Dashboard</h2>
                    <p className="text-muted mb-0">Track your product submissions and store performance</p>
                </div>
                <Button 
                    variant="danger" 
                    className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-bold"
                    onClick={() => navigate('/add-product')}
                >
                    <PlusCircle size={18} /> Add New Product
                </Button>
            </div>

            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                                <Box size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0 small uppercase">Total Listings</h6>
                                <h4 className="fw-bold mb-0">{stats.total}</h4>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0 small">Approved (Live)</h6>
                                <h4 className="fw-bold mb-0">{stats.approved}</h4>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0 small">In Review</h6>
                                <h4 className="fw-bold mb-0">{stats.pending}</h4>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-danger bg-opacity-10 p-3 rounded-3 text-danger">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0 small">Rejected</h6>
                                <h4 className="fw-bold mb-0">{stats.rejected}</h4>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm mb-4 p-4">
                <h5 className="fw-bold mb-3">Approval Health</h5>
                <p className="small text-muted mb-2">{(stats.approved / stats.total * 100).toFixed(0)}% of your products are currently live on the marketplace.</p>
                <ProgressBar style={{ height: '8px' }}>
                    <ProgressBar variant="success" now={(stats.approved / stats.total) * 100} key={1} />
                    <ProgressBar variant="warning" now={(stats.pending / stats.total) * 100} key={2} />
                    <ProgressBar variant="danger" now={(stats.rejected / stats.total) * 100} key={3} />
                </ProgressBar>
                <div className="d-flex gap-4 mt-3 small fw-medium">
                    <span className="text-success">● Live</span>
                    <span className="text-warning">● Pending</span>
                    <span className="text-danger">● Rejected</span>
                </div>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden">
                <Card.Header className="bg-white py-3 border-0">
                    <h5 className="fw-bold mb-0">Recent Submissions & Status</h5>
                </Card.Header>
                <Table responsive hover borderless className="align-middle mb-0">
                    <thead className="bg-light text-muted small">
                        <tr>
                            <th className="px-4 py-3">PRODUCT</th>
                            <th>CATEGORY</th>
                            <th>PRICE</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th className="text-end px-4">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerProducts.map((p) => (
                            <tr key={p._id} className="border-top">
                                <td className="px-4 py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img 
                                            src={p.image[0]} 
                                            alt={p.name} 
                                            className="rounded-2 shadow-sm"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                        />
                                        <div className="fw-semibold">{p.name}</div>
                                    </div>
                                </td>
                                <td>{p.productType}</td>
                                <td>₹{p.mrp}</td>
                                <td>
                                    {p.status === 'approved' && <Badge bg="success-subtle" className="text-success border border-success border-opacity-25 px-2 py-1">LIVE</Badge>}
                                    {p.status === 'pending' && <Badge bg="warning-subtle" className="text-warning border border-warning border-opacity-25 px-2 py-1 text-dark">IN REVIEW</Badge>}
                                    {p.status === 'rejected' && <Badge bg="danger-subtle" className="text-danger border border-danger border-opacity-25 px-2 py-1">REJECTED</Badge>}
                                </td>
                                <td className="text-muted small">{new Date(p.updatedAt).toDateString()}</td>
                                <td className="text-end px-4">
                                    <Button variant="link" className="p-0 text-muted shadow-none">
                                        <Eye size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {sellerProducts.length === 0 && (
                    <div className="text-center py-5">
                        <Box className="text-muted opacity-25 mb-3" size={48} />
                        <p className="text-muted">No products listed yet.</p>
                    </div>
                )}
            </Card>
        </Container>
    );
};