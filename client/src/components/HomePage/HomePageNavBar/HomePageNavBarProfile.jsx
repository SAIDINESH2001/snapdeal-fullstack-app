import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from "../../../styles/HomePage/homePageNavBar.style";

const NavBarLoginContent = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-dark text-white rounded-3 overflow-hidden">
      <div className="px-3 py-2 d-flex align-items-center gap-2">
        <span className="material-symbols-outlined">person</span>
        <span className="fw-medium" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
          Your Account
        </span>
      </div>
      <div className="px-3 py-2 d-flex align-items-center gap-2">
        <span className="material-symbols-outlined">box</span>
        <span className="fw-medium">Your Orders</span>
      </div>
      <hr className="m-0 border-secondary" />
      <div className="text-center text-secondary small mt-2">If you are a new user</div>
      <div
        className="btn w-100 text-center fw-medium text-white mb-2"
        data-bs-toggle="modal"
        data-bs-target="#signUpModal"
      >
        Register
      </div>
      <div className="px-3 pb-3">
        <LoginButton
          className="w-100"
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
        >
          LOGIN
        </LoginButton>
      </div>
    </div>
  );
};


export default function HomePageNavBarProfile({ onCartClick }) {
  const { user, logout, loading } = useAuth();
  const isAuthenticated = !!user;
  const dropdownContainerRef = useRef(null);

  useEffect(() => {
    const dropdownElement = dropdownContainerRef.current;
    if (!dropdownElement || loading) return;

    const toggleBtn = dropdownElement.querySelector('[data-bs-toggle="dropdown"]');
    
    if (toggleBtn) {
      const oldInstance = bootstrap.Dropdown.getInstance(toggleBtn);
      if (oldInstance) {
        oldInstance.dispose();
      }

      new bootstrap.Dropdown(toggleBtn);
    }
  }, [isAuthenticated, loading]); 

  if (loading) {
    return <div style={{ width: "56px" }} className="me-4"></div>;
  }

  return (
    <div className="d-flex align-items-center">
      <div className="dropdown me-4" ref={dropdownContainerRef}>
        <button
          className="btn p-0 border-0 bg-transparent shadow-none"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "56px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "24px", lineHeight: 1 }}>
              account_circle
            </span>
            <span className="fw-semibold small text-nowrap">
              {isAuthenticated ? user.name.split(' ')[0] : "Login"}
            </span>
          </div>
        </button>

        <div className="dropdown-menu p-0 border-0 ms-3 shadow" style={{ width: "260px" }}>
          {isAuthenticated ? (
            <div className="bg-dark text-white rounded-3 overflow-hidden">
              <div className="px-3 py-2 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined">box</span>
                <span className="fw-medium">Orders</span>
              </div>
              <div className="px-3 py-2 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined">featured_seasonal_and_gifts</span>
                <span className="fw-medium">E - Gift Voucher</span>
              </div>
              <hr className="m-0 border-secondary mb-3" />
              <div className="px-3 pb-3">
                <LoginButton className="w-100" onClick={logout}>
                  LOG OUT
                </LoginButton>
              </div>
            </div>
          ) : (
            <NavBarLoginContent />
          )}
        </div>
      </div>

      <div 
        className="btn d-flex flex-column align-items-center justify-content-center me-4 p-0 border-0 shadow-none" 
        style={{ width: "56px", cursor: 'pointer' }}
        onClick={() => {
          console.log("Homepage Cart Clicked");
          onCartClick();
        }}
      >
        <span className="material-symbols-outlined pe-none" style={{ fontSize: "24px", lineHeight: 1 }}>
          shopping_cart
        </span>
        <span className="fw-semibold small text-nowrap pe-none">My Cart</span>
      </div>
    </div>
  );
}