import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
  Modal,
  Form,
  Tabs,
  Tab,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Box,
  ShoppingBag,
  Clock,
  IndianRupee,
  Edit3,
  AlertCircle,
  Package,
} from "lucide-react";
import api from "../../services/axios";

export const SellerDashboard = ({ sellerProducts }) => {
  const navigate = useNavigate();
  const [key, setKey] = useState("analytics");
  const [orders, setOrders] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStockQty, setNewStockQty] = useState(0);
  const [updatingStock, setUpdatingStock] = useState(false);

  useEffect(() => {
    if (sellerProducts) {
      setLocalProducts(sellerProducts);
    }
  }, [sellerProducts]);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const res = await api.get("/seller/orders");
        if (res.data.success) {
          setOrders(res.data.orders);
          setAnalytics(res.data.analytics);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchSellerOrders();
  }, []);

  const productStats = localProducts.reduce(
    (acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0, total: 0 },
  );

  const handleShowOrder = (order) => {
    setSelectedOrder(order);
    setTempStatus(order.orderStatus);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setTempStatus("");
  };

  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
    setNewStockQty(product.stockQuantity);
    setShowStockModal(true);
  };

  const handleCloseStockModal = () => {
    setShowStockModal(false);
    setSelectedProduct(null);
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct) return;
    setUpdatingStock(true);
    try {
      const res = await api.patch(`/products/${selectedProduct._id}/stock`, {
        stockQuantity: newStockQty,
      });
      if (res.data.success) {
        setLocalProducts((prev) =>
          prev.map((p) =>
            p._id === selectedProduct._id
              ? { ...p, stockQuantity: Number(newStockQty) }
              : p,
          ),
        );
        handleCloseStockModal();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder || !tempStatus) return;

    if (tempStatus === selectedOrder.orderStatus) {
      alert("No changes to save.");
      return;
    }

    setUpdatingStatus(true);
    try {
      const res = await api.put(`/seller/orders/${selectedOrder._id}/status`, {
        status: tempStatus,
      });

      if (res.data.success) {
        const updatedOrder = { ...selectedOrder, orderStatus: tempStatus };
        setSelectedOrder(updatedOrder);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? updatedOrder : o)),
        );
        handleCloseOrderModal();
      }
    } catch (error) {
      alert(
        "Failed to update status: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "cancelled":
      case "rejected":
      case "returned":
      case "replaced":
        return "danger";
      case "shipped":
        return "info";
      case "order packed":
        return "primary";
      case "processing":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getOrderReason = (order) => {
    if (order.cancellationReason) return order.cancellationReason;
    if (order.returnReason) return order.returnReason;
    if (order.comments) return order.comments;

    if (order.actionHistory && order.actionHistory.length > 0) {
      const latestAction = order.actionHistory[order.actionHistory.length - 1];
      if (latestAction && latestAction.reason) {
        return latestAction.reason;
      }
    }

    return "No specific reason provided.";
  };

  return (
    <Container
      className="py-5"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Seller Dashboard</h4>
          <p className="text-muted small mb-0">
            Overview of your store's performance
          </p>
        </div>
        <Button
          variant="danger"
          className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-bold"
          onClick={() => navigate("/add-product")}
        >
          <PlusCircle size={18} /> Add New Product
        </Button>
      </div>

      <Tabs
        id="seller-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="analytics" title="Overview & Analytics">
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card
                className="border-0 shadow-sm h-100"
                style={{ backgroundColor: "#d1fae5" }}
              >
                <Card.Body className="d-flex align-items-center gap-3 p-4">
                  <div
                    className="bg-white p-3 rounded-circle text-success shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <IndianRupee size={24} />
                  </div>
                  <div>
                    <h6
                      className="text-muted mb-1 small fw-bold text-uppercase"
                      style={{ fontSize: "11px" }}
                    >
                      Total Revenue
                    </h6>
                    <h4 className="fw-bold text-success mb-0">
                      ₹{analytics.totalRevenue.toLocaleString()}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="border-0 shadow-sm h-100"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <Card.Body className="d-flex align-items-center gap-3 p-4">
                  <div
                    className="bg-white p-3 rounded-circle text-primary shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h6
                      className="text-muted mb-1 small fw-bold text-uppercase"
                      style={{ fontSize: "11px" }}
                    >
                      Total Orders
                    </h6>
                    <h4 className="fw-bold text-primary mb-0">
                      {analytics.totalOrders}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="border-0 shadow-sm h-100"
                style={{ backgroundColor: "#ffedd5" }}
              >
                <Card.Body className="d-flex align-items-center gap-3 p-4">
                  <div
                    className="bg-white p-3 rounded-circle text-warning shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <Clock size={24} />
                  </div>
                  <div>
                    <h6
                      className="text-muted mb-1 small fw-bold text-uppercase"
                      style={{ fontSize: "11px" }}
                    >
                      Pending Orders
                    </h6>
                    <h4 className="fw-bold text-warning mb-0">
                      {analytics.pendingOrders}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="border-0 shadow-sm h-100"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <Card.Body className="d-flex align-items-center gap-3 p-4">
                  <div
                    className="bg-white p-3 rounded-circle text-secondary shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <Box size={24} />
                  </div>
                  <div>
                    <h6
                      className="text-muted mb-1 small fw-bold text-uppercase"
                      style={{ fontSize: "11px" }}
                    >
                      Total Products
                    </h6>
                    <h4 className="fw-bold text-secondary mb-0">
                      {productStats.total}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3 text-muted small text-uppercase">
              Product Approval Status
            </h6>
            <ProgressBar
              style={{ height: "20px", fontSize: "11px", fontWeight: "bold" }}
            >
              <ProgressBar
                variant="success"
                now={(productStats.approved / productStats.total) * 100}
                label={
                  productStats.approved > 0
                    ? `${productStats.approved} Live`
                    : ""
                }
                key={1}
              />
              <ProgressBar
                variant="warning"
                text="dark"
                now={(productStats.pending / productStats.total) * 100}
                label={
                  productStats.pending > 0
                    ? `${productStats.pending} Review`
                    : ""
                }
                key={2}
              />
              <ProgressBar
                variant="danger"
                now={(productStats.rejected / productStats.total) * 100}
                label={
                  productStats.rejected > 0
                    ? `${productStats.rejected} Rejected`
                    : ""
                }
                key={3}
              />
            </ProgressBar>
          </Card>
        </Tab>

        <Tab eventKey="inventory" title="Inventory Management">
          <Card className="border-0 shadow-sm overflow-hidden">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr
                  className="text-muted small text-uppercase"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <th className="ps-4 py-3" style={{ width: "40%" }}>
                    Product Details
                  </th>
                  <th className="py-3" style={{ width: "15%" }}>
                    Category
                  </th>
                  <th className="py-3" style={{ width: "15%" }}>
                    Price
                  </th>
                  <th className="py-3" style={{ width: "20%" }}>
                    Stock Level
                  </th>
                  <th className="py-3 text-center" style={{ width: "10%" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {localProducts.length > 0 ? (
                  localProducts.map((p) => (
                    <tr
                      key={p._id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.image[0]}
                            alt={p.name}
                            className="rounded border p-1 bg-white"
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "contain",
                            }}
                          />
                          <div>
                            <div
                              className="fw-bold text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              {p.name}
                            </div>
                            <div
                              className="small text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              ID: {p._id.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-muted small"
                        style={{ fontSize: "13px" }}
                      >
                        {p.productType}
                      </td>
                      <td
                        className="fw-bold text-dark"
                        style={{ fontSize: "14px" }}
                      >
                        ₹{p.sellingPrice.toLocaleString()}
                      </td>
                      <td className="small">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`fw-bold ${p.stockQuantity < 5 ? "text-danger" : "text-success"}`}
                            style={{ fontSize: "13px" }}
                          >
                            {p.stockQuantity} Units
                          </span>
                          <Button
                            variant="light"
                            size="sm"
                            className="p-1 rounded-circle border"
                            onClick={() => handleOpenStockModal(p)}
                          >
                            <Edit3 size={14} className="text-muted" />
                          </Button>
                        </div>
                      </td>
                      <td className="text-center">
                        {p.status === "approved" && (
                          <Badge
                            bg="success"
                            className="px-2 py-1"
                            style={{ fontSize: "10px" }}
                          >
                            LIVE
                          </Badge>
                        )}
                        {p.status === "pending" && (
                          <Badge
                            bg="warning"
                            text="dark"
                            className="px-2 py-1"
                            style={{ fontSize: "10px" }}
                          >
                            REVIEW
                          </Badge>
                        )}
                        {p.status === "rejected" && (
                          <Badge
                            bg="danger"
                            className="px-2 py-1"
                            style={{ fontSize: "10px" }}
                          >
                            REJECTED
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted small"
                    >
                      No products listed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="orders" title="Customer Orders">
          <Card className="border-0 shadow-sm overflow-hidden mb-5">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr
                  className="text-muted small text-uppercase"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <th className="py-3 ps-4" style={{ width: "20%" }}>
                    Order ID
                  </th>
                  <th className="py-3" style={{ width: "20%" }}>
                    Customer
                  </th>
                  <th className="py-3" style={{ width: "30%" }}>
                    Items
                  </th>
                  <th className="py-3 text-center" style={{ width: "10%" }}>
                    Total
                  </th>
                  <th className="py-3 text-center" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th className="py-3 text-end pe-4" style={{ width: "10%" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td className="ps-4">
                        <div
                          className="fw-bold text-primary"
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleShowOrder(order)}
                        >
                          #{order._id.toUpperCase()}
                        </div>
                      </td>
                      <td
                        className="text-dark fw-semibold"
                        style={{ fontSize: "13px" }}
                      >
                        {order.user?.name || "Guest"}
                        <div
                          className="small text-muted fw-normal"
                          style={{ fontSize: "11px" }}
                        >
                          {order.user?.email}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={order.items[0]?.image[0]}
                            width="35"
                            height="35"
                            className="rounded border bg-white p-1"
                            style={{ objectFit: "contain" }}
                            alt=""
                          />
                          <div>
                            <div
                              className="text-truncate fw-bold text-dark"
                              style={{ maxWidth: "180px", fontSize: "13px" }}
                            >
                              {order.items[0]?.name}
                            </div>
                            {order.items.length > 1 && (
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                + {order.items.length - 1} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="fw-bold text-success text-center"
                        style={{ fontSize: "14px" }}
                      >
                        ₹{order.sellerTotal.toLocaleString()}
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={getStatusVariant(order.orderStatus)}
                          className="px-2 py-1 fw-normal"
                          style={{
                            fontSize: "10px",
                            textTransform: "uppercase",
                          }}
                        >
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td
                        className="text-end pe-4 text-muted small"
                        style={{ fontSize: "12px" }}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-muted small"
                    >
                      No orders received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Tab>
      </Tabs>

      <Modal
        show={showOrderModal}
        onHide={handleCloseOrderModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold" style={{ fontSize: "18px" }}>
            Order{" "}
            <span className="text-primary">
              #{selectedOrder?._id.toUpperCase()}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-4 px-4">
          {selectedOrder && (
            <>
              {(selectedOrder.orderStatus === "Cancelled" ||
                selectedOrder.orderStatus === "Returned" ||
                selectedOrder.orderStatus === "Replaced") && (
                <div className="alert alert-danger d-flex gap-3 align-items-start mb-4 rounded-3">
                  <AlertCircle size={20} className="mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">
                      Customer Comment ({selectedOrder.orderStatus})
                    </h6>
                    <p className="mb-0 small">
                      {getOrderReason(selectedOrder)}
                    </p>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded-3">
                <div>
                  <p
                    className="mb-0 small text-muted text-uppercase fw-bold"
                    style={{ fontSize: "11px" }}
                  >
                    Customer Details
                  </p>
                  <p
                    className="mb-0 fw-bold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    {selectedOrder.user?.name || "Guest"}
                  </p>
                  <p className="mb-0 small text-muted">
                    {selectedOrder.shippingAddress?.phone}
                  </p>
                </div>
                <div className="text-end">
                  <p
                    className="mb-0 small text-muted text-uppercase fw-bold"
                    style={{ fontSize: "11px" }}
                  >
                    Order Date
                  </p>
                  <p className="mb-0 text-dark" style={{ fontSize: "14px" }}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <h6
                className="fw-bold mb-3 small text-uppercase text-muted"
                style={{ fontSize: "12px" }}
              >
                Items Ordered
              </h6>
              <div className="border rounded-3 mb-4 overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center gap-3 p-3 border-bottom bg-white"
                  >
                    <div
                      className="border rounded p-1"
                      style={{ width: 50, height: 50 }}
                    >
                      <img
                        src={item.image[0]}
                        className="w-100 h-100 object-fit-contain"
                        alt=""
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div
                        className="fw-bold text-dark"
                        style={{ fontSize: "14px" }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="small text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        Unit Price: ₹{item.price} | Qty: {item.quantity}
                      </div>
                    </div>
                    <div
                      className="fw-bold text-dark"
                      style={{ fontSize: "14px" }}
                    >
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
                <div className="bg-light p-3 text-end">
                  <span className="text-muted small fw-bold text-uppercase me-2">
                    Total Earnings:
                  </span>
                  <span className="fw-bold text-success fs-5">
                    ₹{selectedOrder.sellerTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              {["Order Placed", "Processing", "Order Packed"].includes(
                selectedOrder.orderStatus,
              ) && (
                <div className="d-flex align-items-end gap-3 bg-light p-4 rounded-3">
                  <div className="flex-grow-1">
                    <label
                      className="small fw-bold text-muted text-uppercase mb-2"
                      style={{ fontSize: "11px" }}
                    >
                      Update Order Status
                    </label>
                    <Form.Select
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value)}
                      disabled={updatingStatus}
                      className="border-secondary w-50"
                      style={{ fontSize: "14px" }}
                    >
                      <option value="select">Select</option>
                      <option value="Processing">Processing</option>
                      <option value="Order Packed">Order Packed</option>
                    </Form.Select>
                  </div>
                  <Button
                    variant="dark"
                    onClick={handleSaveChanges}
                    disabled={
                      updatingStatus || tempStatus === selectedOrder.orderStatus
                    }
                    className="fw-bold px-4"
                    style={{ fontSize: "13px" }}
                  >
                    {updatingStatus ? "Saving..." : "Update Status"}
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showStockModal} onHide={handleCloseStockModal} centered>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold h5">Update Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-4 px-4">
          {selectedProduct && (
            <div>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                <div
                  className="bg-white border rounded p-2"
                  style={{ width: 60, height: 60 }}
                >
                  <img
                    src={selectedProduct.image[0]}
                    alt=""
                    className="w-100 h-100 object-fit-contain"
                  />
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1 text-dark line-clamp-1"
                    style={{ fontSize: "14px" }}
                  >
                    {selectedProduct.name}
                  </h6>
                  <div
                    className="small text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    Current SKU: {selectedProduct._id.toUpperCase()}
                  </div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label
                  className="small fw-bold text-uppercase text-muted"
                  style={{ fontSize: "11px" }}
                >
                  Stock Quantity
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <Package size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="0"
                    className="border-start-0 ps-0 fw-bold"
                    style={{ fontSize: "15px" }}
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(e.target.value)}
                  />
                </InputGroup>
                <Form.Text
                  className="text-muted small"
                  style={{ fontSize: "11px" }}
                >
                  Current Stock:{" "}
                  <span className="fw-bold text-dark">
                    {selectedProduct.stockQuantity}
                  </span>
                </Form.Text>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0 px-4 pb-4">
          <Button
            variant="light"
            onClick={handleCloseStockModal}
            className="fw-bold text-muted"
            style={{ fontSize: "13px" }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={updatingStock}
            onClick={handleStockUpdate}
            className="px-4 fw-bold"
            style={{ fontSize: "13px" }}
          >
            {updatingStock ? "Updating..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
