import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { IndianRupee, ShoppingBag, Clock, Box } from "lucide-react"; 
import api from "../../services/axios";
import Sidebar from "./AdminSideBar"
import DashboardHeader from "./AdminDashboardHeader";
import ActivityTable from "./AdminActivity";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingProducts, setPendingProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [inventoryProducts, setInventoryProducts] = useState([]); 
  const [analytics, setAnalytics] = useState({ 
      totalRevenue: 0, 
      totalOrders: 0, 
      pendingOrders: 0,
      productStats: { approved: 0, pending: 0, rejected: 0, total: 0 }
  });
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
      
      if (ordersRes.data.analytics) {
          setAnalytics(ordersRes.data.analytics);
      }

      const inventoryRes = await api.get("/products/admin/all");
      setInventoryProducts(inventoryRes.data.data || []);

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

  const postSaleStatuses = [
    'delivered', 'returned', 'replaced', 'return pending', 
    'replace pending', 'refund initiated', 'refund processing', 'refunded'
  ];
  
  const deliveredOrders = orderProducts.filter(order => 
    postSaleStatuses.includes(order.orderStatus?.toLowerCase())
  );
  
  const activeOrders = orderProducts.filter(order => 
    !postSaleStatuses.includes(order.orderStatus?.toLowerCase()) && order.orderStatus?.toLowerCase() !== 'cancelled'
  );

  const getTabData = () => {
    if (activeTab === 'inventory') return inventoryProducts;
    if (activeTab === 'orders') return activeOrders;
    if (activeTab === 'delivered') return deliveredOrders;
    return pendingProducts;
  };

  return (
    <Container fluid className="p-0 bg-[#f8fafc] min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Row className="g-0">
        <Col md={2}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            pendingCount={pendingProducts.length} 
            ordersCount={activeOrders.length} 
            deliveredCount={deliveredOrders.length}
          />
        </Col>

        <Col md={10} className="p-4 p-lg-5">
          <DashboardHeader activeTab={activeTab} />
          
          {activeTab === 'overview' ? (
            <div className="fade-in">
                <Row className="g-4 mb-5">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#d1fae5' }}>
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-white p-3 rounded-circle text-success shadow-sm">
                                    <IndianRupee size={28} />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0 small fw-bold">TOTAL REVENUE</h6>
                                    <h3 className="fw-bold text-success mb-0">₹{analytics.totalRevenue.toLocaleString()}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#dbeafe' }}>
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-white p-3 rounded-circle text-primary shadow-sm">
                                    <ShoppingBag size={28} />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0 small fw-bold">TOTAL ORDERS</h6>
                                    <h3 className="fw-bold text-primary mb-0">{analytics.totalOrders}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#ffedd5' }}>
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-white p-3 rounded-circle text-warning shadow-sm">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0 small fw-bold">PENDING ORDERS</h6>
                                    <h3 className="fw-bold text-warning mb-0">{analytics.pendingOrders}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#f3f4f6' }}>
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-white p-3 rounded-circle text-secondary shadow-sm">
                                    <Box size={28} />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0 small fw-bold">TOTAL PRODUCTS</h6>
                                    <h3 className="fw-bold text-secondary mb-0">{analytics.productStats.total}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col md={12}>
                        <Card className="border-0 shadow-sm p-4">
                            <h6 className="fw-bold mb-3 text-muted small">PLATFORM PRODUCT HEALTH</h6>
                            <ProgressBar style={{ height: '25px', fontSize: '12px', fontWeight: 'bold' }}>
                                <ProgressBar variant="success" now={(analytics.productStats.approved / analytics.productStats.total) * 100} label={analytics.productStats.approved > 0 ? `${analytics.productStats.approved} Live` : ''} key={1} />
                                <ProgressBar variant="warning" text="dark" now={(analytics.productStats.pending / analytics.productStats.total) * 100} label={analytics.productStats.pending > 0 ? `${analytics.productStats.pending} Review` : ''} key={2} />
                                <ProgressBar variant="danger" now={(analytics.productStats.rejected / analytics.productStats.total) * 100} label={analytics.productStats.rejected > 0 ? `${analytics.productStats.rejected} Rejected` : ''} key={3} />
                            </ProgressBar>
                        </Card>
                    </Col>
                </Row>
            </div>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <span className="fw-bold text-[#475569] small">
                    {activeTab === 'inventory' ? 'FULL PRODUCT INVENTORY' : 
                     activeTab === 'delivered' ? 'POST-SALE ACTIVITY' : 'RECENT ACTIVITY'}
                </span>
                <button className="btn btn-link p-0 text-muted text-decoration-none" onClick={fetchData}>
                    <span className="material-symbols-outlined fs-5">refresh</span>
                </button>
                </div>

                <ActivityTable 
                loading={loading}
                activeTab={activeTab}
                data={getTabData()}
                statusUpdateLoading={statusUpdateLoading}
                handleOrderStatusUpdate={handleOrderStatusUpdate}
                handleStatusUpdate={handleStatusUpdate}
                />
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};