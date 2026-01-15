import { useState } from "react";
import { Col, Badge, Button, Row, Form } from "react-bootstrap";

export const ProductSummaryRightMain = ({ product, loading }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  if (loading || !product) return null;
  return (
    <Col lg={6} className="ps-lg-5 pt-3 pt-lg-0">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="fw-normal text-dark" style={{ lineHeight: "1.4" }}>
          {product.name}
        </h5>
      </div>

      <div className="my-2 small">
        <span className="text-warning">{product.rating}</span>
        <span className="ms-2 text-primary cursor-pointer">
          {product.ratingsCount > 0 ? `(${product.ratingsCount} ratings)` : 'Be the first to review'}
        </span>
        <span className="mx-2 text-muted">|</span>
        <span className="text-primary cursor-pointer">Have a question?</span>
      </div>

      <hr />

      <div className="mb-3">
        <div className="text-muted small">
          MRP{" "}
          <span className="text-decoration-line-through">
            Rs. {product.mrp}
          </span>{" "}
          (Inclusive of all taxes)
        </div>
        <div className="d-flex align-items-center gap-3 mt-1">
          <h2 className="text-danger fw-bold m-0">
            Rs. {product.sellingPrice}
          </h2>
          <Badge bg="light" text="dark" className="border px-3 py-2 fw-normal">
            {product.discount}% OFF
          </Badge>
        </div>
      </div>

      <div className="mb-4">
        <p className="small fw-bold text-muted mb-2">Color</p>
        <div
          className="border border-primary d-inline-block p-1"
          style={{ width: "60px" }}
        >
          <img src={product.image} alt="color" className="img-fluid" />
          <div
            className="text-center x-small text-muted"
            style={{ fontSize: "10px" }}
          >
            Multicolor
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <p className="small fw-bold text-muted">Size</p>
          <p className="text-primary small cursor-pointer">Size Chart</p>
        </div>
        <div>{console.log(product)}</div>
        <div className="d-flex gap-2 mb-2">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant={
                selectedSize === size ? "outline-primary" : "outline-secondary"
              }
              className={`px-3 ${
                size === 39 || size > 40 ? "text-muted border-light" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
        {(product.stockQuantity <= 10) ? (<div className="text-danger x-small fw-bold">{product.stockQuantity} Left</div>) : (<div className="x-small fw-bold">{product.stockQuantity} Left</div>)}
      </div>
      <div className="d-flex gap-3 mb-4">
        <Button
          variant="dark"
          className="px-5 py-3 fw-bold rounded-0 flex-grow-1"
          style={{ backgroundColor: "#333" }}
        >
          ADD TO CART
        </Button>
        <Button
          variant="danger"
          className="px-5 py-3 fw-bold rounded-0 flex-grow-1"
          style={{ backgroundColor: "#e40046" }}
        >
          BUY NOW
        </Button>
      </div>
      <div className="bg-light p-3 border rounded">
        <Row className="align-items-center g-2">
          <Col xs={12} md={3} className="small fw-bold">
            Delivery
          </Col>
          <Col xs={8} md={6}>
            <Form.Control
              type="text"
              placeholder="Enter pincode"
              className="rounded-0 shadow-none border-secondary"
            />
          </Col>
          <Col xs={4} md={3}>
            <Button
              variant="dark"
              className="w-100 rounded-0"
              style={{ backgroundColor: "#333" }}
            >
              CHECK
            </Button>
          </Col>
        </Row>
        <p className="mt-2 mb-0 x-small text-muted">
          Generally delivered in 7 - 11 days
        </p>
      </div>
    </Col>
  );
};
