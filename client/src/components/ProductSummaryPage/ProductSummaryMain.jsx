import { Container, Row, Col, Button, Form, Badge } from "react-bootstrap";
import { ProductSummaryRightMain } from "./ProductSummaryRightMain";

export const ProductDetails = ({ product, loading }) => {
  if (loading || !product) return null;

  return (
    <>
      <Container className="mt-4 bg-white p-4 shadow-sm rounded">
        <Row>
          <Col lg={1} md={2} className="d-none d-md-block">
            {product.image &&
              product.image.map((img, index) => {
                return (
                  <div key={index} className="d-flex flex-column gap-2">
                    <img src={img} alt={product.name} />
                  </div>
                );
              })}
          </Col>

          <Col lg={5} md={10} className="text-center">
            <div className="position-relative border p-2">
              <img src={product.image} alt="Product" className="img-fluid" />
              <div className="mt-2 text-muted small">
                <i className="bi bi-search"></i> Hover to zoom
              </div>
            </div>
          </Col>
          <ProductSummaryRightMain product={product} loading={loading}/>
        </Row>
      </Container>
    </>
  );
};
