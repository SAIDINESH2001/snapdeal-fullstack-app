import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/axios";
import AccountSidebar from "./OrdersSideBar";
import OrderCard from "./OrdersCard";

export const OrdersPageMain = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [orderProducts, setOrderProducts] = useState([]);

    useEffect(() => {
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
        fetchOrderData();
    }, []);

    if (isLoading) return null;

    return (
        <div className="w-100 d-flex flex-column align-items-center bg-white" style={{ minHeight: '100vh' }}>
            {/* Breadcrumb Header */}
            <div className="p-3 border-bottom w-100 d-flex justify-content-center bg-white sticky-top" style={{ zIndex: 10 }}>
                <div style={{ width: "80%", fontSize: '12px', color: '#888' }}>
                    Home / My Account / <span style={{ color: '#333', fontWeight: '500' }}>My Orders</span>
                </div>
            </div>

            <Container className="py-5" style={{ width: "80%" }}>
                <Row>
                    <Col md={3}>
                        <AccountSidebar user={user} />
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
                                orderProducts.map((order) => (
                                    <OrderCard key={order._id} order={order} />
                                ))
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};