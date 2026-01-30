import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return { bg: "#f0fdf4", color: "#16a34a", border: "#bcf0da" };
    if (s === 'cancelled') return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
    if (s === 'shipped') return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
    return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  };

  const status = getStatusStyle(order.orderStatus);
  const displayItems = (order.items || []).slice(0, 5);
  const remaining = (order.items?.length || 0) - 5;

  return (
    <Card className="mb-4 rounded-0" style={{ border: 'none', borderBottom: '1px solid #eee', boxShadow: 'none' }}>
      <Card.Body className="p-0 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 p-2 px-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <div className="d-flex gap-5">
            <div>
              <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Order ID</div>
              <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>#{order._id?.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Placed</div>
              <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>{new Date(order.orderedAt).toLocaleDateString('en-GB')}</div>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Total Price</div>
              <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>₹{order.totalAmount?.toLocaleString()}</div>
            </div>
          </div>
          <div className="px-2 py-1 fw-bold" style={{ fontSize: '10px', backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: '2px' }}>
            {order.orderStatus?.toUpperCase()}
          </div>
        </div>

        <Row className="align-items-center px-2">
          <Col md={8}>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              {displayItems.map((item, index) => (
                <div key={index} style={{ position: 'relative', width: '60px', height: '60px', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '2px', backgroundColor: '#fff' }}>
                  <img src={item.image?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  {index === 4 && remaining > 0 && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '3px' }}>
                      +{remaining}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-dark fw-bold" style={{ fontSize: '13px' }}>
              {(order.items?.[0]?.name || "Product details unavailable").slice(0, 60)}
              {(order.items?.[0]?.name?.length || 0) > 60 ? '...' : ''}
              {(order.items?.length || 0) > 1 && <span className="text-muted fw-normal ms-1"> + {order.items.length - 1} other items</span>}
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Button 
              variant="link" 
              className="p-0 text-decoration-none fw-bold" 
              style={{ fontSize: '12px', color: '#e40046' }}
              onClick={() => navigate(`/order-details/${order._id}`)}
            >
              VIEW DETAILS 
              <span className="material-symbols-outlined align-middle fs-6 ms-1">chevron_right</span>
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;