import React from "react";
import { Card } from "react-bootstrap";

const OrderItemList = ({
  items,
  orderStatus,
  reviewedProducts,
  onOpenReview,
}) => {
  const isDelivered = orderStatus.toLowerCase() === "delivered";

  return (
    <Card className="rounded-0 border mb-4" style={{ boxShadow: "none" }}>
      <Card.Header className="bg-white fw-bold small py-3 border-bottom">
        ITEMS IN THIS ORDER ({items.length})
      </Card.Header>
      <Card.Body className="p-0">
        {items.map((item, index) => (
          <div
            key={index}
            className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center p-3 border-bottom gap-3 gap-sm-4"
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                border: "1px solid #f0f0f0",
                padding: "2px",
                flexShrink: 0,
              }}
            >
              <img
                src={item.image[0]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="flex-grow-1 w-100">
              <div
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "14px" }}
              >
                {item.name}
              </div>
              <div className="text-muted" style={{ fontSize: "12px" }}>
                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
              </div>

              {isDelivered && (
                <button
                  className="btn btn-link p-0 mt-1 text-danger fw-bold text-decoration-none"
                  style={{ fontSize: "11px" }}
                  onClick={() => onOpenReview(item)}
                >
                  {reviewedProducts[item.productId]
                    ? "EDIT REVIEW"
                    : "WRITE A REVIEW"}
                </button>
              )}
            </div>
            <div className="fw-bold text-dark align-self-start align-self-sm-center">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default OrderItemList;
