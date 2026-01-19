import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Nav, Card, Table, Button, Badge, Spinner, Form } from "react-bootstrap";
import api from "../../services/axios";

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

  const getStatusConfig = (status) => {
    const config = {
      'Delivered': { bg: '#def7ec', color: '#03543f' },
      'Cancelled': { bg: '#fde8e8', color: '#9b1c1c' },
      'Shipped': { bg: '#e1effe', color: '#1e429f' },
      'Processing': { bg: '#fef3c7', color: '#92400e' },
      'Order Placed': { bg: '#f3f4f6', color: '#374151' }
    };
    return config[status] || config['Order Placed'];
  };

  return (
    <Container fluid className="p-0 bg-[#f8fafc] min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Row className="g-0">
        <Col md={2} className="bg-white border-end px-3 py-4 sticky-top shadow-sm" style={{ height: '100vh' }}>
          <div className="px-3 mb-5 mt-2">
            <span className="text-muted small">Admin Dashboard</span>
          </div>

          <Nav className="flex-column gap-1">
            {[
              { id: 'approvals', label: 'Review Queue', icon: 'pending', count: pendingProducts.length },
              { id: 'products', label: 'Inventory', icon: 'grid_view', count: 0 },
              { id: 'orders', label: 'Orders', icon: 'shopping_bag', count: orderProducts.length }
            ].map(item => (
              <Nav.Link
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`d-flex align-items-center justify-content-between rounded-3 px-3 py-2.5 transition-all ${
                  activeTab === item.id ? "bg-[#f1f5f9] text-[#e40046] fw-bold" : "text-secondary"
                }`}
                style={{ fontSize: '14px' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined fs-5">{item.icon}</span>
                  {item.label}
                </div>
                {item.count > 0 && (
                  <Badge pill bg={activeTab === item.id ? "danger" : "light"} text={activeTab === item.id ? "white" : "dark"} style={{ fontSize: '10px' }}>
                    {item.count}
                  </Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        <Col md={10} className="p-4 p-lg-5">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h4 className="fw-bold text-[#1e293b] mb-1">
                {activeTab === "approvals" ? "Product Approvals" : activeTab === "products" ? "Inventory Manager" : "Customer Orders"}
              </h4>
              <p className="text-muted small mb-0">Overview of your marketplace activity</p>
            </div>
            <Button className="rounded-3 border-0 px-4 py-2 fw-semibold shadow-sm" style={{ backgroundColor: '#e40046' }} onClick={() => (window.location.href = "/add-product")}>
              + New Product
            </Button>
          </div>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold text-[#475569] small">RECENT ACTIVITY</span>
              <Button variant="link" className="text-muted p-0 text-decoration-none" onClick={fetchData}>
                <span className="material-symbols-outlined fs-5">refresh</span>
              </Button>
            </div>

            <Table borderless hover responsive className="mb-0">
              <thead className="bg-[#f8fafc] border-bottom">
                <tr className="text-muted extra-small fw-bold">
                  <th className="ps-4 py-3">INFORMATION</th>
                  <th className="py-3">CONTACT / SOURCE</th>
                  <th className="py-3 text-center">VALUE</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="text-end pe-4 py-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="danger" size="sm" /></td></tr>
                ) : (activeTab === 'orders' ? orderProducts : pendingProducts).length > 0 ? (
                  (activeTab === 'orders' ? orderProducts : pendingProducts).map((item) => {
                    const statusConfig = getStatusConfig(item.orderStatus || 'Pending');
                    return (
                      <tr key={item._id} className="align-middle border-bottom transition-all">
                        <td className="ps-4 py-4">
                          <div className="fw-bold text-[#334155]" style={{ fontSize: '13.5px' }}>
                            {activeTab === 'orders' ? `ORDERID - #${item._id.toUpperCase()}` : item.name}
                          </div>
                          <div className="text-muted extra-small">
                            {activeTab === 'orders' ? `${item.items.length} items • ${item.paymentMethod}` : `${item.brand} • ${item.productType}`}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold text-[#475569]" style={{ fontSize: '13px' }}>
                            {activeTab === 'orders' ? item.shippingAddress.phone : (item.sellerId?.name || "Independent")}
                          </div>
                          {activeTab === 'orders' && <div className="text-muted extra-small">{item.shippingAddress.city}</div>}
                        </td>
                        <td className="fw-bold text-[#1e293b] text-center">
                          ₹{(activeTab === 'orders' ? item.totalAmount : item.sellingPrice).toLocaleString()}
                        </td>
                        <td className="text-center">
                          <Badge 
                            style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, fontSize: '10px' }} 
                            className="rounded-pill px-3 py-2 fw-bold"
                          >
                            {(item.orderStatus || 'PENDING').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="text-end pe-4">
                          {activeTab === 'orders' ? (
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <Form.Select 
                                size="sm" 
                                className="rounded-3 border-light bg-light"
                                style={{ width: '130px', fontSize: '11px', color: '#475569' }}
                                defaultValue={item.orderStatus}
                                id={`sel-${item._id}`}
                              >
                                {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </Form.Select>
                              <Button 
                                variant="dark" 
                                size="sm" 
                                className="rounded-3 px-3 fw-bold border-0"
                                style={{ backgroundColor: '#334155' }}
                                disabled={statusUpdateLoading === item._id}
                                onClick={() => handleOrderStatusUpdate(item._id, document.getElementById(`sel-${item._id}`).value)}
                              >
                                {statusUpdateLoading === item._id ? '...' : 'Save'}
                              </Button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-1">
                              <Button variant="light" size="sm" className="text-success fw-bold rounded-2 px-3" onClick={() => handleStatusUpdate(item._id, "approved")}>Accept</Button>
                              <Button variant="link" size="sm" className="text-danger text-decoration-none fw-bold" onClick={() => handleStatusUpdate(item._id, "rejected")}>Decline</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" className="text-center py-5 text-muted small">No data found in this category.</td></tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};