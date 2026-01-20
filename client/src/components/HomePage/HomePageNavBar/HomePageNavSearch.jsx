import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomePageNavSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const performSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className="mx-4 d-flex justify-content-end" style={{ width: "720px" }}>
      <div className="input-group border border-dark rounded overflow-hidden">
        <span 
          className="input-group-text bg-white border-end-0" 
          onClick={performSearch}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined fs-5 text-muted">
            search
          </span>
        </span>

        <input
          type="text"
          className="form-control border-start-0 shadow-none"
          placeholder="Search for Brands & Products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            height: "44px",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
};