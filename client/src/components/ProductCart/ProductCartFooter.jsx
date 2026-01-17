import React from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";

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
      about:
        "Got a question? Look no further. Browse our FAQs or submit your query here.",
    },
    {
      id: 4,
      img: "/FooterIcons/shop.png",
      head: "SHOP ON THE GO",
      about:
        "Download the app and get exciting app only offers at your fingertips",
    },
  ];
  return (
    <footer className="bg-white border-top mt-5 pt-4 pb-5">
      <Container className="border-bottom pb-4 mb-4">
        <Row className="text-center">
          {trustItems &&
            trustItems.map((item) => {
              return (
                <Col md={3} key={item.id} className="border-end">
                  <img
                    src={item.img}
                    alt={item.head}
                    width={50}
                    className="mb-3"
                  />
                  <h6 className="fw-bold text-uppercase small">{item.head}</h6>
                  <p className="text-muted extra-small" style={{fontSize: '14px'}}>{item.about}</p>
                </Col>
              );
            })}
        </Row>
      </Container>

      <Container>
        <Row className="gy-4">
          <Col md={2}>
            <h6 className="fw-bold small mb-3 text-uppercase">Policy Info</h6>
            <ul className="list-unstyled footer-links" style={{fontSize: '14px'}}>
              <li>Privacy Policy</li>
              <li>Terms of Sale</li>
              <li>Terms of Use</li>
              <li>Report Abuse & Takedown Policy</li>
              <li>Know Your BIS Standard</li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold small mb-3 text-uppercase">Company</h6>
            <ul className="list-unstyled footer-links" style={{fontSize: '14px'}}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Sitemap</li>
              <li>Contact Us</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="fw-bold small mb-3 text-uppercase">
              Snapdeal Business
            </h6>
            <ul className="list-unstyled footer-links" style={{fontSize: '14px'}}>
              <li>Shopping App</li>
              <li>Sell on Snapdeal</li>
              <li>Media Enquiries</li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold small mb-3 text-uppercase">Popular Links</h6>
            <ul className="list-unstyled footer-links" style={{fontSize: '14px'}}>
              <li>Lehenga</li>
              <li>Kid's Clothing</li>
              <li>Sarees</li>
              <li>Winter Wear</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="fw-bold small mb-3 text-uppercase">Subscribe</h6>
            <InputGroup className="mb-2">
              <Form.Control
                placeholder="Your email address"
                className="rounded-0 border-end-0 small bg-light"
                style={{ fontSize: "14px" }}
              />
              <Button
                variant="dark"
                className="rounded-0 text-uppercase fw-bold"
                style={{ fontSize: "11px", backgroundColor: "#333" }}
              >
                Subscribe
              </Button>
            </InputGroup>
            <p className="extra-small text-muted mt-3" style={{fontSize: '12px'}}>
              Register now to get updates on promotions and coupons.{" "}
              <span className="text-primary cursor-pointer">
                Or Download App
              </span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
