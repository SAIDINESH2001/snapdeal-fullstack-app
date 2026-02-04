import React from "react";
import { Link } from "react-router-dom";

export const ProductSummaryBreadCrumb = ({ product, loading }) => {
  if (loading || !product) return null;

  return (
    <nav aria-label="breadcrumb" className="mt-3 ms-5">
      <ol className="breadcrumb" style={{ fontSize: "14px" }}>
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
        </li>
        {product.productMainCategory && (
          <li className="breadcrumb-item">
            <Link 
              to={`/products/${encodeURIComponent(product.productMainCategory)}`} 
              className="text-decoration-none text-muted"
            >
              {product.productMainCategory}
            </Link>
          </li>
        )}
        {product.subCategory && (
          <li className="breadcrumb-item">
            <Link 
              to={`/products/${encodeURIComponent(product.productMainCategory)}/${encodeURIComponent(product.subCategory)}`} 
              className="text-decoration-none text-muted"
            >
              {product.subCategory}
            </Link>
          </li>
        )}
        <li className="breadcrumb-item active fw-bold" aria-current="page">
          {product.name}
        </li>
      </ol>
    </nav>
  );
};