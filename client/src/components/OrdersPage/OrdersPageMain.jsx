import { Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../../services/axios";

export const OrdersPageMain = () => {
    const {user, loading} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [orderProducts, setOrderProducts] = useState(null);
    const fetchOrderData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/my-orders');
            setOrderProducts(res.data.orders);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    if(isLoading) return;
  return (
    <>
      <div className="w-100 d-flex flex-column align-items-center justify-content-center">
        <div className="p-3 border-bottom" style={{ width: "80%" }}>
          Home / My Account / My Orders
        </div>
        <Container className="py-5" style={{width:"80%"}}>
          <Row>
            <Col md={3} className="border-end">
              <h5
                className="text-danger fw-bold mb-4"
                style={{ fontSize: "16px" }}
              >
                MY ACCOUNT
              </h5>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: "40px", height: "40px" }}
                >
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <div className="fw-bold small text-uppercase">
                    {user?.name || "SAI DINESH"}
                  </div>
                  <div
                    className="text-muted extra-small"
                    style={{ fontSize: "10px" }}
                  >
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="material-symbols-outlined fs-5">
                    description
                  </span>
                  <span className="fw-bold small">ORDERS</span>
                </div>
                <div className="ps-4 text-danger small fw-bold cursor-pointer">
                  Orders
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="material-symbols-outlined fs-5">person</span>
                  <span className="fw-bold small">PROFILE</span>
                </div>
                <div className="ps-4 text-muted small py-1">
                  Saved Addresses
                </div>
                <div className="ps-4 text-muted small py-1">Saved Cards</div>
                <div className="ps-4 text-muted small py-1">
                  Change Password
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="material-symbols-outlined fs-5">
                    account_balance_wallet
                  </span>
                  <span className="fw-bold small">PAYMENTS</span>
                </div>
                <div className="ps-4 text-muted small py-1">
                  E-Gift Voucher Balance
                </div>
              </div>
            </Col>

            <Col md={9} className="ps-md-5">
              <h5
                className="border-bottom pb-3 mb-4 fw-normal"
                style={{ letterSpacing: "0.5px" }}
              >
                MY ORDERS
              </h5>

              {loading ? (
                <div className="text-center py-5 text-muted">
                  Loading your orders...
                </div>
              ) : orderProducts.length === 0 ? (
                <div className="text-center py-5">
                  <h6 className="text-muted fw-normal">NO ORDERS AVAILABLE</h6>
                </div>
              ) : (
                <div className="order-list">
                  {orderProducts.map((order) => (
                    <Card
                      key={order._id}
                      className="mb-4 shadow-sm border-0 rounded-0"
                    >
                      <Card.Header className="bg-light border-0 d-flex justify-content-between align-items-center py-3">
                        <div className="small">
                          <span className="text-muted me-2">ORDER PLACED:</span>
                          <span className="fw-bold">
                            {new Date(order.orderedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="small">
                          <span className="text-muted me-2">TOTAL:</span>
                          <span className="fw-bold">
                            ₹{order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="badge bg-success fw-normal">
                          {order.orderStatus}
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex gap-4 mb-3 align-items-center"
                          >
                            <img
                              src={item.image[0]}
                              width="70"
                              height="70"
                              style={{ objectFit: "contain" }}
                              alt=""
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold small text-dark mb-1">
                                {item.name}
                              </div>
                              <div className="text-muted small">
                                Qty: {item.quantity}
                              </div>
                            </div>
                            <div className="fw-bold text-danger">
                              ₹{item.price.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
