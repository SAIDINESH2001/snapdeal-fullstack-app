import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BreadcrumbAndTrending = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { mainCategory } = useParams();
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
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="small fw-bold text-muted me-2">📈 TRENDING:</span>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-secondary"></div>
          ) : (
            trends.map((item) => (
              <button
                key={item}
                className="btn btn-white border btn-sm rounded-pill px-3 shadow-sm bg-white"
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