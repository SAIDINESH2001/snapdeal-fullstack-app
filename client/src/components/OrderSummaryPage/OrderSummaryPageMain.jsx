import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import api from "../../services/axios";
import OrderStatusTracker from "./OrderStatusTracker";
import OrderItemList from "./OrderItemList";
import ReviewModal from "./ReviewModal";

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const stages = [
    { label: "Order Placed", icon: "bi-box-seam" },
    { label: "Processing", icon: "bi-gear" },
    { label: "Order Packed", icon: "bi-box-fill" },
    { label: "Shipped", icon: "bi-truck" },
    { label: "Delivered", icon: "bi-house-check" },
  ];

  const returnStages = [
    { label: "Return Requested", icon: "bi-arrow-left-right" },
    { label: "Returned", icon: "bi-box-check" },
    { label: "Refund Initiated", icon: "bi-wallet2" },
    { label: "Refund Processing", icon: "bi-hourglass-split" },
    { label: "Refunded", icon: "bi-check-circle" },
  ];

  const replaceStages = [
    { label: "Replace Requested", icon: "bi-arrow-repeat" },
    { label: "Processing", icon: "bi-gear" },
    { label: "Shipped", icon: "bi-truck" },
    { label: "Replaced", icon: "bi-house-check" },
  ];

  const checkReviewStatus = useCallback(async (items) => {
    const statusMap = {};
    for (const item of items) {
      try {
        const res = await api.get(
          `/reviews/check-eligibility/${item.productId}`,
        );
        statusMap[item.productId] = res.data.alreadyReviewed;
      } catch (err) {
        console.error(err);
      }
    }
    setReviewedProducts(statusMap);
  }, []);

  const fetchOrderDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/my-orders/${orderId}`);
      setOrder(res.data.order);
      if (res.data.order.orderStatus.toLowerCase() === "delivered") {
        checkReviewStatus(res.data.order.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, checkReviewStatus]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleOrderAction = async () => {
    if (!actionReason.trim()) return alert("Please provide a reason.");
    try {
      setIsActionSubmitting(true);
      await api.post(`/my-orders/${orderId}/${actionType}`, {
        reason: actionReason,
      });
      setShowActionModal(false);
      fetchOrderDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing request");
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const openActionModal = (type) => {
    setActionType(type);
    setActionReason("");
    setShowActionModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedItem(null);
    setRating(0);
    setComment("");
    setHover(0);
  };

  const handleOpenReview = async (item) => {
    setSelectedItem(item);
    setRating(0);
    setComment("");
    
    if (reviewedProducts[item.productId]) {
      try {
        const res = await api.get(`/products/${item.productId}/reviews`);
        const myReview = res.data.reviews.find(
          (r) => (r.user?._id || r.user) === user._id,
        );
        if (myReview) {
          setRating(myReview.rating);
          setComment(myReview.comment);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      setIsSubmitting(true);
      await api.post(`/reviews/upsert/${selectedItem.productId}`, {
        rating,
        comment,
        userName: user.name,
        orderId: order._id,
      });
      
      setReviewedProducts((prev) => ({
        ...prev,
        [selectedItem.productId]: true,
      }));
      
      handleCloseReviewModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (["delivered", "refunded", "replaced"].includes(s))
      return { color: "#16a34a", bg: "#f0fdf4", border: "#bcf0da" };
    if (s === "cancelled")
      return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
    if (s === "shipped" || s === "order packed" || s.includes("pending") || s.includes("processing") || s.includes("initiated"))
      return { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };
    return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  };

  if (isLoading) return <div className="text-center py-5">Loading...</div>;
  if (!order) return <div className="text-center py-5">Order not found.</div>;

  const orderStatus = order.orderStatus.toLowerCase();
  const statusStyle = getStatusStyle(order.orderStatus);

  let activeStages = stages;
  
  const isReturningOrRefunding = [
      "return pending", 
      "returned", 
      "refund initiated", 
      "refund processing", 
      "refunded"
  ].includes(orderStatus);

  const isReplacing = orderStatus.includes("replace");

  let currentStep = 0;

  if (isReturningOrRefunding) {
    activeStages = returnStages;
    if (orderStatus === "return pending") currentStep = 0;
    else if (orderStatus === "returned") currentStep = 1;
    else if (orderStatus === "refund initiated") currentStep = 2;
    else if (orderStatus === "refund processing") currentStep = 3;
    else if (orderStatus === "refunded") currentStep = 4;
  } else if (isReplacing) {
    activeStages = replaceStages;
    if (orderStatus === "replace pending") currentStep = 1;
    else if (orderStatus === "replaced") currentStep = 3;
    else currentStep = 0;
  } else {
      currentStep = stages.findIndex(
        (s) => s.label.toLowerCase() === orderStatus,
      );
  }

  const isDelivered = orderStatus === "delivered";
  const isCancelled = orderStatus === "cancelled";
  
  const isActionLocked = isReturningOrRefunding || isReplacing;

  const actionButtonStyle = { fontSize: "12px", fontWeight: "600" };

  return (
    <div
      className="w-100 d-flex flex-column align-items-center bg-white"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="p-3 border-bottom w-100 d-flex justify-content-center bg-white sticky-top"
        style={{ zIndex: 10 }}
      >
        <div style={{ width: "80%", fontSize: "12px", color: "#888" }}>
          Home / My Orders /{" "}
          <span style={{ color: "#333", fontWeight: "500" }}>
            #{order._id.toUpperCase()}
          </span>
        </div>
      </div>

      <Container className="py-5" style={{ width: "80%" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-normal m-0" style={{ fontSize: "22px" }}>
              Order Details
            </h4>
            <p className="text-muted small m-0">
              Order ID: #{order._id.toUpperCase()}
            </p>
          </div>
          <div className="d-flex gap-2">
            {!isDelivered && !isCancelled && !isActionLocked && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-0 px-3"
                style={actionButtonStyle}
                onClick={() => openActionModal("cancel")}
              >
                CANCEL ORDER
              </Button>
            )}
            {isDelivered && !isActionLocked && (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-0 px-3"
                  style={actionButtonStyle}
                  onClick={() => openActionModal("return")}
                >
                  RETURN
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-0 px-3"
                  style={actionButtonStyle}
                  onClick={() => openActionModal("replace")}
                >
                  REPLACE
                </Button>
              </>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-0 px-3"
              style={actionButtonStyle}
            >
              BACK TO ORDERS
            </Button>
          </div>
        </div>

        {!isCancelled && (
          <div className="mb-5">
            <h6 className="text-center mb-4 text-muted small fw-bold">
              {isReturningOrRefunding
                ? "RETURN & REFUND TRACKER"
                : isReplacing
                  ? "REPLACEMENT TRACKER"
                  : "ORDER TRACKER"}
            </h6>
            <OrderStatusTracker
              stages={activeStages}
              currentStep={currentStep}
            />
          </div>
        )}

        <Row className="g-4 mb-5">
          <Col md={8}>
            <Card
              className="rounded-0 border mb-4"
              style={{
                boxShadow: "none",
                border: `1px solid ${statusStyle.border}`,
              }}
            >
              <Card.Body
                className="p-3 d-flex justify-content-between align-items-center"
                style={{ backgroundColor: statusStyle.bg }}
              >
                <div>
                  <span className="small text-muted me-2">Current Status:</span>
                  <span
                    className="fw-bold"
                    style={{ color: statusStyle.color }}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </Card.Body>
            </Card>
            <OrderItemList
              items={order.items}
              orderStatus={order.orderStatus}
              reviewedProducts={reviewedProducts}
              onOpenReview={handleOpenReview}
            />
          </Col>

          <Col md={4}>
            <Card
              className="rounded-0 border sticky-top"
              style={{ boxShadow: "none", top: "80px" }}
            >
              <Card.Header className="bg-white fw-bold small py-3 border-bottom">
                PRICE & ORDER DETAILS
              </Card.Header>
              <Card.Body className="py-3">
                <div className="d-flex justify-content-between mb-3 small">
                  <span className="text-muted">Total Items</span>
                  <span className="text-dark fw-500">{order.items.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 small">
                  <span className="text-muted">Ordered On</span>
                  <span className="text-dark fw-500">
                    {new Date(order.orderedAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 small">
                  <span className="text-muted">Total MRP</span>
                  <span className="text-dark fw-500">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 small">
                  <span className="text-muted">Delivery Charges</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <hr className="my-3" style={{ opacity: "0.1" }} />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">Amount Paid</span>
                  <span className="fw-bold text-danger fs-5">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card
              className="rounded-0 border h-100"
              style={{ boxShadow: "none" }}
            >
              <Card.Header className="bg-white fw-bold small py-3 border-bottom">
                DELIVERY ADDRESS
              </Card.Header>
              <Card.Body className="p-4">
                <h6
                  className="fw-bold text-dark text-uppercase mb-2"
                  style={{ fontSize: "13px" }}
                >
                  {user?.name}
                </h6>
                <p
                  className="text-muted mb-3"
                  style={{ fontSize: "13px", lineHeight: "1.6" }}
                >
                  {order.shippingAddress.street},<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                  <br />
                  India -{" "}
                  <span className="fw-bold text-dark">
                    {order.shippingAddress.zipCode}
                  </span>
                </p>
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ fontSize: "13px" }}
                >
                  <span className="text-muted">Mobile:</span>
                  <span className="fw-bold text-dark">
                    {order.shippingAddress.phone}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card
              className="rounded-0 border h-100"
              style={{ boxShadow: "none" }}
            >
              <Card.Header className="bg-white fw-bold small py-3 border-bottom">
                PAYMENT INFORMATION
              </Card.Header>
              <Card.Body className="p-4 d-flex flex-column justify-content-center">
                <div className="mb-4">
                  <p
                    className="text-muted mb-2"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    PAYMENT METHOD
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="fw-bold text-dark"
                      style={{ fontSize: "14px" }}
                    >
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  {order.paymentMethod.toUpperCase() === "COD" ? (
                    ""
                  ) : (
                    <>
                      <p
                        className="text-muted mb-2"
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        PAYMENT STATUS
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle"
                          style={{
                            width: "10px",
                            height: "10px",
                            background:
                              order.paymentStatus === "Completed"
                                ? "#16a34a"
                                : "#d97706",
                          }}
                        ></span>
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: "14px",
                            color:
                              order.paymentStatus === "Completed"
                                ? "#16a34a"
                                : "#d97706",
                          }}
                        >
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        centered
        className="rounded-0"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title
            className="fw-normal text-uppercase"
            style={{ fontSize: "16px" }}
          >
            {actionType} Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form.Group>
            <Form.Label className="small text-muted">
              Reason for {actionType}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="rounded-0 shadow-none"
              placeholder="Please provide a reason..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="dark"
            className="w-100 rounded-0 mt-3 py-2 fw-bold"
            disabled={isActionSubmitting}
            onClick={handleOrderAction}
          >
            {isActionSubmitting
              ? "PROCESSING..."
              : `SUBMIT ${actionType.toUpperCase()} REQUEST`}
          </Button>
        </Modal.Body>
      </Modal>

      <ReviewModal
        show={showReviewModal}
        onHide={handleCloseReviewModal}
        selectedItem={selectedItem}
        rating={rating}
        hover={hover}
        comment={comment}
        isSubmitting={isSubmitting}
        setRating={setRating}
        setHover={setHover}
        setComment={setComment}
        onSubmit={submitReview}
      />
    </div>
  );
};