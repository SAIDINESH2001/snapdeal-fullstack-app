import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Box, DollarSign, TrendingUp } from 'lucide-react'; 

export const SellerDashboard = () => {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Seller Dashboard</h2>
                <Button 
                    variant="danger" 
                    className="d-flex align-items-center gap-2"
                    onClick={() => navigate('/seller/add-product')}
                >
                    <PlusCircle size={20} /> Add New Product
                </Button>
            </div>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="text-center border-0 shadow-sm p-3">
                        <Box className="mx-auto mb-2 text-primary" size={32} />
                        <h5>Total Products</h5>
                        <h3 className="fw-bold">14</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-0 shadow-sm p-3">
                        <DollarSign className="mx-auto mb-2 text-success" size={32} />
                        <h5>Total Sales</h5>
                        <h3 className="fw-bold">₹45,200</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-0 shadow-sm p-3">
                        <TrendingUp className="mx-auto mb-2 text-warning" size={32} />
                        <h5>Stock Alerts</h5>
                        <h3 className="fw-bold text-danger">2</h3>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm p-4">
                <h4>Recent Listings</h4>
                <p className="text-muted">You haven't added any products in the last 24 hours.</p>
            </Card>
        </Container>
    );
};

