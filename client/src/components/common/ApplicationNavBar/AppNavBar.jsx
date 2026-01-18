import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCartContext } from "../../../contexts/cartContext";

export const MainNavbar = ({ user, onCartClick }) => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { cartCount, fetchCartCount } = useCartContext();

  useEffect(() => {
    if (user?.role === "customer") {
      fetchCartCount();
    }
  }, [user, fetchCartCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav
      className="py-1 shadow-sm"
      style={{
        backgroundColor: "#E40046",
        position: "sticky",
        top: "0",
        zIndex: "1030",
      }}
    >
      <div className="container-fluid d-flex align-items-center gap-4 px-5">
        <div className="d-flex align-items-center gap-3 text-white fw-bold fs-4">
          <Link to={user?.role === "seller" ? "/seller" : "/"}>
            <img src="/snapdeal-white.png" alt="Logo" width={150} height={30} style={{ objectFit: "cover" }} />
          </Link>
          <span className="btn fs-3 text-white border-0">
            <span className="material-symbols-outlined pe-none">menu</span>
          </span>
        </div>

        <div className="flex-grow-1">
          <form onSubmit={handleSearch} className="input-group w-75 mx-auto">
            <input
              type="text"
              className="form-control px-3 border-0 shadow-none"
              placeholder="Search products & brands"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-dark px-4 border-0" style={{ backgroundColor: '#2d2d2d' }}>
              Search
            </button>
          </form>
        </div>

        <div className="d-flex align-items-center gap-4 text-white">
          
          {user?.role === "customer" && (
            <div
              className="btn text-light d-flex align-items-center gap-2 border-0 p-2 position-relative"
              onClick={onCartClick}
              style={{ cursor: "pointer", zIndex: 5 }}
            >
              <span className="pe-none" style={{ fontSize: '14px' }}>Cart</span>
              <span className="material-symbols-outlined pe-none">shopping_cart</span>
              
              {cartCount > 0 && (
                <span 
                  className="position-absolute d-flex align-items-center justify-content-center text-danger rounded-circle fw-bold" 
                  style={{
                    top: '0px', 
                    right: '-5px', 
                    fontSize: '10px', 
                    background: '#fff', 
                    width: '18px', 
                    height: '18px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          )}

          <div className="d-flex align-items-center gap-3">
            <div className="btn text-light d-flex align-items-center gap-2 border-0 p-0">
              <span style={{ fontSize: '14px' }}>
                {user?.name || "Profile"}
              </span>
              <span className="material-symbols-outlined">person</span>
            </div>

            {(user?.role === "seller" || user?.role === "admin") && (
              <div className="btn text-light d-flex align-items-center gap-2 border-0 p-0" onClick={logout}>
                <span className="pe-none" style={{ fontSize: '14px' }}>Log Out</span>
                <span className="material-symbols-outlined pe-none">logout</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};