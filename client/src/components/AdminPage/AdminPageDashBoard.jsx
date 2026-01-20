import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import api from "../../services/axios";
import Sidebar from "./AdminSideBar"
import DashboardHeader from "./AdminDashboardHeader";
import ActivityTable from "./AdminActivity";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("approvals");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, ordersRes] = await Promise.all([
        api.get("/products/pending"),
        api.get("/orders")
      ]);
      setPendingProducts(pendingRes.data.data || []);
      setOrderProducts(ordersRes.data.orders || []);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error("Order Update Error:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      await api.patch(`/products/${productId}/status`, { status: newStatus });
      fetchData(); 
    } catch (error) {
      console.log("Status update failed.", error);
    }
  };

  return (
    <Container fluid className="p-0 bg-[#f8fafc] min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Row className="g-0">
        <Col md={2}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            pendingCount={pendingProducts.length} 
            ordersCount={orderProducts.length} 
          />
        </Col>

        <Col md={10} className="p-4 p-lg-5">
          <DashboardHeader activeTab={activeTab} />
          
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold text-[#475569] small">RECENT ACTIVITY</span>
              <button className="btn btn-link p-0 text-muted text-decoration-none" onClick={fetchData}>
                <span className="material-symbols-outlined fs-5">refresh</span>
              </button>
            </div>

            <ActivityTable 
              loading={loading}
              activeTab={activeTab}
              data={activeTab === 'orders' ? orderProducts : pendingProducts}
              statusUpdateLoading={statusUpdateLoading}
              handleOrderStatusUpdate={handleOrderStatusUpdate}
              handleStatusUpdate={handleStatusUpdate}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};