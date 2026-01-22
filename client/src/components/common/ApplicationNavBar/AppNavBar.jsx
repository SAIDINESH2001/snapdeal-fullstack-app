import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCartContext } from "../../../contexts/cartContext";
import { fetchCategory } from "../../HomePage/CategoryBar/categoryService"; 
import { Container, Row, Col } from 'react-bootstrap';

export const MainNavbar = ({ user, onCartClick }) => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const { cartCount, fetchCartCount } = useCartContext();

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const data = await fetchCategory(); //
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoriesData();
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

  const handleItemClick = (catName, sectionName, itemName) => {
    navigate(`/products/${encodeURIComponent(catName)}/${encodeURIComponent(sectionName)}/${encodeURIComponent(itemName)}`);
    setActiveTab(null);
  };

  return (
    <nav
      className="py-1 shadow-sm"
      style={{
        backgroundColor: "#E40046",
        position: "sticky",
        top: "0",
        zIndex: "1050",
      }}
      onMouseLeave={() => setActiveTab(null)}
    >
      <div className="container-fluid d-flex align-items-center gap-4 px-5">
        <div className="d-flex align-items-center gap-3 text-white fw-bold fs-4">
          <Link to={user?.role === "seller" ? "/seller" : "/"}>
            <img src="/snapdeal-white.png" alt="Logo" width={150} height={30} style={{ objectFit: "cover" }} />
          </Link>
          
          <div className="position-relative d-flex align-items-center" style={{ height: "50px" }}>
            <span 
              className="btn fs-3 text-white border-0 p-0 d-flex align-items-center justify-content-center"
              onMouseEnter={() => setActiveTab(activeTab || categories[0]?._id)}
              style={{ width: "45px", height: "100%" }}
            >
              <span className="material-symbols-outlined pe-none">menu</span>
            </span>

            {activeTab && (
              <div 
                className="position-absolute shadow-lg bg-white text-dark fw-normal d-flex"
                style={{ 
                  top: '100%', 
                  left: '-165px', 
                  width: '1050px', 
                  height: '550px',
                  zIndex: '2000',
                  borderTop: '1px solid #ddd',
                }}
              >
                <div 
                  className="border-end bg-[#f7f7f7]" 
                  style={{ 
                    width: '240px', 
                    minWidth: '240px', 
                    maxWidth: '240px', 
                    overflowY: 'auto',
                    flexShrink: 0 
                  }}
                >
                  <div className="px-3 py-3 small fw-bold text-muted border-bottom bg-white" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    TOP CATEGORIES
                  </div>
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="px-3 py-2 d-flex align-items-center gap-3 transition-all"
                      style={{ 
                        cursor: 'pointer', 
                        fontSize: '13px', 
                        backgroundColor: activeTab === cat._id ? '#fff' : 'transparent',
                        borderLeft: activeTab === cat._id ? '4px solid #E40046' : '4px solid transparent',
                        color: activeTab === cat._id ? '#E40046' : '#333'
                      }}
                      onMouseEnter={() => setActiveTab(cat._id)}
                      onClick={() => navigate(`/products/${encodeURIComponent(cat.categoryName)}`)}
                    >
                      <img src={cat.categoryImage} width={28} height={28} alt="" className="rounded-circle border" />
                      <span className={activeTab === cat._id ? "fw-bold" : ""}>{cat.categoryName}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-grow-1 p-4 bg-white" style={{ overflowY: 'auto' }}>
                  <Row className="gx-5">
                    {categories.find(c => c._id === activeTab)?.sections?.map((section, secIdx) => (
                      <Col key={secIdx} md={4} className="mb-4">
                        <h6 
                          className="fw-bold mb-2 text-uppercase" 
                          style={{ fontSize: '11px', color: '#222', letterSpacing: '0.8px', borderBottom: '1px solid #f0f0f0', paddingBottom: '5px' }}
                        >
                          {section.sectionName}
                        </h6>
                        <ul className="list-unstyled m-0">
                          {section.items.map((item, i) => (
                            <li 
                              key={i} 
                              className="mb-1 text-muted"
                              style={{ 
                                fontSize: '12.5px', 
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => e.target.style.color = '#E40046'}
                              onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                              onClick={() => handleItemClick(categories.find(c => c._id === activeTab).categoryName, section.sectionName, item.itemName)}
                            >
                              {item.itemName}
                            </li>
                          ))}
                        </ul>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            )}
          </div>
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
            <div className="btn text-light d-flex align-items-center gap-2 border-0 p-2 position-relative" onClick={onCartClick}>
              <span className="pe-none" style={{ fontSize: '14px' }}>Cart</span>
              <span className="material-symbols-outlined pe-none">shopping_cart</span>
              {cartCount > 0 && (
                <span className="position-absolute d-flex align-items-center justify-content-center text-danger rounded-circle fw-bold" 
                  style={{ top: '0px', right: '-5px', fontSize: '10px', background: '#fff', width: '18px', height: '18px' }}>
                  {cartCount}
                </span>
              )}
            </div>
          )}
          <div className="d-flex align-items-center gap-3">
            <div className="btn text-light d-flex align-items-center gap-2 border-0 p-0">
              <span style={{ fontSize: '14px' }}>{user?.name || "Profile"}</span>
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