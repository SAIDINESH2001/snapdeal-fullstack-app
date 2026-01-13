import NavBarLoginDropDown from "./NavBarLoginDropDown";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export default function HomePageNavBarProfile() {
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
            <span className="fw-semibold small text-nowrap">Login</span>
          </div>
        </button>

        <NavBarLoginDropDown />
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
