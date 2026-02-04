import React, { useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProductSummaryRightMain } from "./ProductSummaryRightMain";
import styled from "styled-components";

const MainImageArea = styled.div`
  position: relative;
  border: 1px solid #eaeaec;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: zoom-in;
  background: #fff;

  img {
    transition: transform 0.1s ease-out;
    transform-origin: ${props => props.$origin || "center center"};
    transform: ${props => (props.$zoom ? "scale(2.5)" : "scale(1)")};
    max-height: 100%;
    width: auto;
    pointer-events: none;
  }
`;

const ThumbnailBox = styled.div`
  cursor: pointer;
  border: 1px solid ${props => (props.$active ? "#000" : "#eaeaec")};
  margin-bottom: 10px;
  padding: 2px;
  transition: border 0.2s ease;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const ProductDetails = ({ product, loading }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("center center");
  const containerRef = useRef(null);

  if (loading || !product) return null;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <Container className="mt-4 bg-white p-4 shadow-sm rounded">
      <Row>
        <Col lg={1} md={2} className="d-none d-md-block">
          {product.image?.map((img, index) => (
            <ThumbnailBox
              key={index}
              $active={selectedIdx === index}
              onClick={() => setSelectedIdx(index)}
            >
              <img src={img} alt={`Thumb ${index}`} />
            </ThumbnailBox>
          ))}
        </Col>

        <Col lg={5} md={10} className="text-center">
          <MainImageArea
            ref={containerRef}
            $origin={origin}
            $zoom={zoom}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={product.image[selectedIdx]}
              alt={product.name}
            />
          </MainImageArea>
          <div className="mt-2 text-muted small">
            <i className="bi bi-search"></i> Hover to zoom
          </div>
        </Col>

        <ProductSummaryRightMain product={product} loading={loading} />
      </Row>
    </Container>
  );
};