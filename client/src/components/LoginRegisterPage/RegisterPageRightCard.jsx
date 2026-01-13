import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";

export const RegisterPageRightCard = () => {
  return (
    <div
      className="bg-white shadow rounded-3 p-4 position-absolute top-50 translate-middle-y"
      style={{ width: "320px", right: "140px", minHeight: "405px" }}
    >
      <h5 className="fw-semibold mb-1" style={{ fontSize: "14px" }}>
        Sign Up
      </h5>
      <p className="small text-muted mb-3" style={{ fontSize: "10px" }}>
        Create an account on Snapdeal
      </p>
      <div className="position-relative mb-3" style={{ fontSize: "10px" }}>
        <input
          className="form-control"
          placeholder="Mobile"
          style={{ fontSize: "14px", boxShadow: "none" }}
        />
        <span className="material-symbols-outlined position-absolute top-50 end-0 translate-middle-y me-3 text-muted fs-6">
          edit
        </span>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Email"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />

      <input
        className="form-control mb-3"
        placeholder="Name"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />

      <input
        className="form-control mb-3"
        placeholder="DOB  DD/MM/YYYY"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />

      <div className="position-relative mb-2">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          style={{ fontSize: "14px", boxShadow: "none" }}
        />
        <span className="material-symbols-outlined position-absolute top-50 end-0 translate-middle-y me-3 text-muted fs-6">
          visibility_off
        </span>
      </div>

      <p className="small text-muted mb-3" style={{ fontSize: "10px" }}>
        Password should have a minimum of 6 characters, at least 1 numeric and 1
        alphabet
      </p>

      <div className="form-check mb-3 d-flex align-items-center">
        <input
          className="form-check-input"
          type="checkbox"
          id="keepLoggedIn"
          style={{ fontSize: "14px", boxShadow: "none" }}
        />
        <label
          className="form-check-label small ms-3"
          htmlFor="keepLoggedIn"
          style={{ fontSize: "12px" }}
        >
          Keep me logged in
        </label>
      </div>

      <LoginButton className="w-100 mb-3">CONTINUE</LoginButton>

      <p
        className="text-center small text-muted mb-4"
        style={{ fontSize: "12px" }}
      >
        By registering, I agree to{" "}
        <span className="text-primary">Terms & Conditions</span>
      </p>

      <div
        className="text-center small text-muted mb-3"
        style={{ fontSize: "14px", boxShadow: "none" }}
      >
        or Login Using
      </div>

      <button className="btn w-100 border d-flex align-items-center justify-content-center gap-2">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          width="18"
          alt="Google"
        />
        Google
      </button>
    </div>
  );
};
