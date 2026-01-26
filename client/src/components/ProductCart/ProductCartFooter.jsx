import React from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const ProductCartFooter = () => {
  const trustItems = [
    {
      id: 1,
      img: "/FooterIcons/secure.png",
      head: "100% SECURE PAYMENTS",
      about: "Moving your card details to a much more secured place",
    },
    {
      id: 2,
      img: "/FooterIcons/trust.png",
      head: "TRUSTPAY",
      about: "100% Payment Protection. Easy Return Policy",
    },
    {
      id: 3,
      img: "/FooterIcons/halp.png",
      head: "HELP CENTER",
      about: "Got a question? Look no further. Browse our FAQs or submit your query here.",
    },
    {
      id: 4,
      img: "/FooterIcons/shop.png",
      head: "SHOP ON THE GO",
      about: "Download the app and get exciting app only offers at your fingertips",
    },
  ];

  return (
    <footer className="bg-white border-top mt-5 pt-5 pb-4">
      <Container className="border-bottom pb-5 mb-5">
        <Row className="text-center g-0">
          {trustItems &&
            trustItems.map((item, index) => (
              <Col md={3} key={item.id} className={index !== trustItems.length - 1 ? "border-end px-4" : "px-4"}>
                <img src={item.img} alt={item.head} width={45} className="mb-3" />
                <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>{item.head}</h6>
                <p className="text-muted mb-0" style={{ fontSize: "12px", lineHeight: "1.6" }}>{item.about}</p>
              </Col>
            ))}
        </Row>
      </Container>

      <Container className="pb-4">
        <Row className="gx-5 gy-4">
          <Col md={2}>
            <h6 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px" }}>Policy Info</h6>
            <ul className="list-unstyled d-grid gap-1">
              <li><Link to="https://www.snapdeal.com/page/privacy-policy" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Privacy Policy</Link></li>
              <li><Link to="https://www.snapdeal.com/page/terms-of-sale" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Terms of Sale</Link></li>
              <li><Link to="https://www.snapdeal.com/page/terms-of-use" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Terms of Use</Link></li>
              <li><Link to="https://www.snapdeal.com/page/abuse-policy" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Report Abuse & Takedown Policy</Link></li>
              <li><Link to="https://www.snapdeal.com/page/bis-standard" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Know Your BIS Standard</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px" }}>Company</h6>
            <ul className="list-unstyled d-grid gap-1">
              <li><Link to="/about-us" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>About Us</Link></li>
              <li><Link to="/careers" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Careers</Link></li>
              <li><Link to="/blog" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Blog</Link></li>
              <li><Link to="/sitemap" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Sitemap</Link></li>
              <li><Link to="/contact-us" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Contact Us</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px" }}>Snapdeal Business</h6>
            <ul className="list-unstyled d-grid gap-1">
              <li><Link to="/shopping-app" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Shopping App</Link></li>
              <li><Link to="/sell-on-snapdeal" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Sell on Snapdeal</Link></li>
              <li><Link to="/media-enquiries" target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Media Enquiries</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px" }}>Popular Links</h6>
            <ul className="list-unstyled d-grid gap-1">
              <li><Link to={`/products/trending/${encodeURIComponent("Lehenga")}`} target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Lehenga</Link></li>
              <li><Link to={`/products/trending/${encodeURIComponent("Boy's Clothing")}`} target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Kid's Clothing</Link></li>
              <li><Link to={`/products/trending/${encodeURIComponent("Sarees")}`} target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Sarees</Link></li>
              <li><Link to={`/products/trending/${encodeURIComponent("Winter Wear")}`} target="_blank" className="text-decoration-none text-muted" style={{ fontSize: "12px" }}>Winter Wear</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px" }}>Subscribe</h6>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Your email address"
                className="rounded-0 border-secondary-subtle"
                style={{ fontSize: "13px", height: "40px", backgroundColor: "#f7f7f7" }}
              />
              <Button
                variant="dark"
                className="rounded-0 text-uppercase fw-bold px-4"
                style={{ fontSize: "12px", backgroundColor: "#272727" }}
              >
                Subscribe
              </Button>
            </InputGroup>
            <p className="text-muted" style={{ fontSize: "11px", lineHeight: "1.5" }}>
              Register now to get updates on promotions and coupons.{" "}
              <Link to="/download-app" target="_blank" className="text-primary text-decoration-none fw-semibold">Or Download App</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};