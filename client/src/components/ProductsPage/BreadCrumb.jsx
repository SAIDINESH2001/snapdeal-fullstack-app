import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export const BreadcrumbAndTrending = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { mainCategory, subCategory, category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const query = mainCategory ? `?category=${encodeURIComponent(mainCategory)}` : "";
        const response = await fetch(`http://localhost:5000/api/trending${query}`);
        const data = await response.json();
        setTrends(data);
      } catch (error) {
        console.log(error);
        setTrends(["Shirts", "Wallets", "Sunglasses", "T-Shirts", "Sarees"]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [mainCategory]);

  return (
    <div className="border-top bg-light">
      <div className="container-fluid px-5 py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-3" style={{ fontSize: "14px" }}>
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            {mainCategory && (
              <li className={`breadcrumb-item ${!subCategory ? "active fw-bold" : ""}`}>
                {subCategory ? <Link to={`/products/${mainCategory}`} className="text-decoration-none text-muted">{decodeURIComponent(mainCategory)}</Link> : decodeURIComponent(mainCategory)}
              </li>
            )}
            {subCategory && (
              <li className={`breadcrumb-item ${!category ? "active fw-bold" : ""}`}>
                {category ? <Link to={`/products/${mainCategory}/${subCategory}`} className="text-decoration-none text-muted">{decodeURIComponent(subCategory)}</Link> : decodeURIComponent(subCategory)}
              </li>
            )}
            {category && <li className="breadcrumb-item active fw-bold">{decodeURIComponent(category)}</li>}
          </ol>
        </nav>
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="fw-bold text-muted small">📈 TRENDING:</span>
          {!loading && trends.map((item) => (
            <button key={item} className="btn btn-white border px-2 bg-white small shadow-sm" onClick={() => navigate(`/products/trending/${encodeURIComponent(item)}`)}>{item}</button>
          ))}
        </div>
      </div>
    </div>
  );
};