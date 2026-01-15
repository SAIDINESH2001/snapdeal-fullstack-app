import { Container, Row, Col, Accordion } from "react-bootstrap";
import { SpecificationTab } from "../../styles/ProductSummary/productSummary.styles";
import {Link} from 'react-router-dom';

export const ProductTabs = ({ product, loading }) => {
  if (loading || !product) return null;
  return (
    <Container className="bg-white mt-4 p-0 border shadow-sm rounded-1">
      <div className="border-bottom px-3 pt-2 bg-light d-flex">
        <div
          className="text-dark fw-bold px-4 py-2"
          style={{ borderBottom: "3px solid #e40046", cursor: "default" }}
        >
          Item Details
        </div>
        
        <SpecificationTab className="text-muted px-4 py-2" >
          Ratings & Reviews
        </SpecificationTab>
        <SpecificationTab className="text-muted px-4 py-2">
          Questions & Answers
        </SpecificationTab>
      </div>
      <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Highlights</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex flex-column">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Other Specifications</Accordion.Header>
          <Accordion.Body>
            <div><strong>Country of Origin or Manufacture</strong> India</div>
            <div><strong>Common or Generic Name of the product</strong> {product.productType}</div>
          </Accordion.Body>
        </Accordion.Item>
         <Accordion.Item eventKey="2">
          <Accordion.Header>Terms & Conditions</Accordion.Header>
          <Accordion.Body className="ms-2">
            <div className="mb-3">The images represent actual product though color of the image and product may slightly differ.</div>
            <div>Snapdeal does not select, edit, modify, alter, add or supplement the information, description and other specifications provided by the Seller.</div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};
