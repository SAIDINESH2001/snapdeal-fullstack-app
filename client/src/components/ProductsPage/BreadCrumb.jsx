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
          <ol className="breadcrumb mb-3" style={{ fontSize: "14px", backgroundColor: "transparent" }}>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            
            {mainCategory && (
              <li className={`breadcrumb-item ${!subCategory ? "active fw-bold text-dark" : ""}`}>
                {subCategory ? (
                  <Link to={`/products/${mainCategory}`} className="text-decoration-none text-muted">
                    {decodeURIComponent(mainCategory)}
                  </Link>
                ) : (
                  decodeURIComponent(mainCategory)
                )}
              </li>
            )}

            {subCategory && (
              <li className={`breadcrumb-item ${!category ? "active fw-bold text-dark" : ""}`}>
                {category ? (
                  <Link to={`/products/${mainCategory}/${subCategory}`} className="text-decoration-none text-muted">
                    {decodeURIComponent(subCategory)}
                  </Link>
                ) : (
                  decodeURIComponent(subCategory)
                )}
              </li>
            )}

            {category && (
              <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">
                {decodeURIComponent(category)}
              </li>
            )}
          </ol>
        </nav>

        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="fw-bold text-muted" style={{ fontSize: "13px" }}>📈 TRENDING:</span>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-secondary"></div>
          ) : (
            trends.map((item) => (
              <button
                key={item}
                className="btn btn-white border px-3 shadow-sm bg-white"
                style={{ fontSize: "13px", paddingBlock: "4px" }}
                onClick={() => navigate(`/products/${encodeURIComponent(item)}`)}
              >
                {item}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};