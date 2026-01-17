import { useRef } from "react";
import { Container, Accordion, useAccordionButton } from "react-bootstrap";
import { SpecificationTab } from "../../styles/ProductSummary/productSummary.styles";
import '../../styles/ProductSummary/productSummary.css';


function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 py-3 bg-light border-bottom cursor-pointer"
      onClick={decoratedOnClick}
      style={{ cursor: 'pointer' }}
    >
      <span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '14px' }}>
        {children}
      </span>
      <span className="material-symbols-outlined fs-5">
        remove
      </span>
    </div>
  );
}

export const ProductTabs = ({ product, loading }) => {
  const reviewsRef = useRef(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        
        <SpecificationTab className="text-muted px-4 py-2" onClick={scrollToReviews} style={{cursor: 'pointer'}}>
          Ratings & Reviews
        </SpecificationTab>
        <SpecificationTab className="text-muted px-4 py-2" style={{cursor: 'pointer'}}>
          Questions & Answers
        </SpecificationTab>
      </div>

      <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen className="custom-accordion">
        <div className="accordion-section border-bottom">
          <CustomToggle eventKey="0">Highlights</CustomToggle>
          <Accordion.Collapse eventKey="0">
            <div className="p-4">
              <div className="cols">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="col mb-3 d-flex gap-2 align-items-baseline">
                    <div className="text-muted small">•</div>
                    <div className="small">
                        <span className="text-muted">{key}:</span> {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion.Collapse>
        </div>

        <div className="accordion-section border-bottom">
          <CustomToggle eventKey="1">Other Specifications</CustomToggle>
          <Accordion.Collapse eventKey="1">
            <div className="p-4 small">
              <div className="mb-2"><span className="fw-bold">Country of Origin or Manufacture:</span> India</div>
              <div><span className="fw-bold">Common or Generic Name of the product:</span> {product.productType}</div>
            </div>
          </Accordion.Collapse>
        </div>

        <div className="accordion-section border-bottom">
          <CustomToggle eventKey="2">Terms & Conditions</CustomToggle>
          <Accordion.Collapse eventKey="2">
            <div className="p-4 small text-muted">
              <p>The images represent actual product though color of the image and product may slightly differ.</p>
              <p className="mb-0">Snapdeal does not select, edit, modify, alter, add or supplement the information, description and other specifications provided by the Seller.</p>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>

      <div ref={reviewsRef} style={{ height: '1px' }} />
    </Container>
  );
};