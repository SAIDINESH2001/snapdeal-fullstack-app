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
    <div className="w-100 d-flex justify-content-center" >
      <div className="input-group border border-dark rounded overflow-hidden w-100">
        <span 
          className="input-group-text bg-white border-end-0 px-2 px-md-3" 
          onClick={performSearch}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined fs-5 text-muted" style={{fontSize: "clamp(18px, 3vw, 20px)"}}>
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
            height: "clamp(36px, 5vw, 44px)",
            fontSize: "clamp(12px, 2vw, 14px)",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
};