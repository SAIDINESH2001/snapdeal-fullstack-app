import NavBarLoginDropDown from "./NavBarLoginDropDown";
import useAuth from "../../../hooks/useAuth";
import { LoginButton } from "../../../styles/HomePage/homePageNavBar.style";

export default function HomePageNavBarProfile() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="d-flex align-items-center">
      <div className="dropdown me-4">
        <button
          className="btn p-0 border-0 bg-transparent"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ width: "56px" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px", lineHeight: 1 }}
            >
              account_circle
            </span>

            <span className="fw-semibold small text-nowrap">
              {isAuthenticated ? "Profile" : "Login"}
            </span>
          </div>
        </button>

        {isAuthenticated ? (
              <div className="dropdown-menu p-0 border-0 ms-3" style={{ width: "260px" }}>
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
                            <LoginButton
                              className="w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#loginModal"
                              onClick={logout}
                            >
                              LOG OUT
                            </LoginButton>
                          </div>
                </div>
              </div>
        ) : (
          <NavBarLoginDropDown />
        )}
      </div>

      <div
        className="btn d-flex flex-column align-items-center justify-content-center me-4"
        style={{ width: "56px" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "24px", lineHeight: 1 }}
        >
          shopping_cart
        </span>
        <span className="fw-semibold small text-nowrap">My Cart</span>
      </div>
    </div>
  );
}
