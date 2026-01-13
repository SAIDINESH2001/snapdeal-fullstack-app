import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../../hooks/useSignUp";

export const RegisterPageRightCard = () => {
  const navigate = useNavigate();

  // PAGE MODE → same hook as SignupModal
  const { values, errors, loading, handleChange, handleSubmit } = useSignup();

  const onContinue = async () => {
    const res = await handleSubmit();
    if (res?.success) {
      navigate("/login");
    }
  };

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

      {/* MOBILE */}
      <div className="position-relative mb-2">
        <input
          name="phone"
          value={values.phone}
          onChange={handleChange}
          className="form-control"
          placeholder="Mobile"
          style={{ fontSize: "14px", boxShadow: "none" }}
        />
        <span className="material-symbols-outlined position-absolute top-50 end-0 translate-middle-y me-3 text-muted fs-6">
          edit
        </span>
      </div>
      {errors.phone && (
        <div className="text-danger small mb-2">{errors.phone}</div>
      )}

      {/* EMAIL */}
      <input
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Email"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />
      {errors.email && (
        <div className="text-danger small mb-2">{errors.email}</div>
      )}

      {/* NAME */}
      <input
        name="name"
        value={values.name}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Name"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />
      {errors.name && (
        <div className="text-danger small mb-2">{errors.name}</div>
      )}

      {/* DOB */}
      <input
        type="date"
        name="dob"
        value={values.dob}
        onChange={handleChange}
        className="form-control mb-2"
        style={{ fontSize: "14px", boxShadow: "none" }}
      />
      {errors.dob && <div className="text-danger small mb-2">{errors.dob}</div>}

      {/* PASSWORD */}
      <div className="position-relative mb-1">
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="form-control"
          placeholder="Password"
          style={{ fontSize: "14px", boxShadow: "none" }}
        />
        <span className="material-symbols-outlined position-absolute top-50 end-0 translate-middle-y me-3 text-muted fs-6">
          visibility_off
        </span>
      </div>

      <p className="small text-muted mb-2" style={{ fontSize: "10px" }}>
        Password should have a minimum of 6 characters, at least 1 numeric and 1
        alphabet
      </p>

      {errors.password && (
        <div className="text-danger small mb-2">{errors.password}</div>
      )}

      {/* KEEP LOGGED IN */}
      <div className="form-check mb-3 d-flex align-items-center">
        <input
          className="form-check-input"
          type="checkbox"
          name="keepLoggedIn"
          checked={values.keepLoggedIn}
          onChange={handleChange}
          id="keepLoggedIn"
        />
        <label
          className="form-check-label small ms-3"
          htmlFor="keepLoggedIn"
          style={{ fontSize: "12px" }}
        >
          Keep me logged in
        </label>
      </div>

      {errors.server && (
        <div className="text-danger small mb-2 text-center">
          {errors.server}
        </div>
      )}

      {/* CONTINUE */}
      <LoginButton
        className="w-100 mb-3"
        disabled={loading}
        onClick={onContinue}
      >
        {loading ? "PLEASE WAIT…" : "CONTINUE"}
      </LoginButton>

      <p
        className="text-center small text-muted mb-3"
        style={{ fontSize: "12px" }}
      >
        By registering, I agree to{" "}
        <span className="text-primary">Terms & Conditions</span>
      </p>

      <div
        className="text-center small text-muted mb-3"
        style={{ fontSize: "14px" }}
      >
        or Login Using
      </div>

      {/* GOOGLE */}
      <Link to="https://accounts.google.com" style={{ textDecoration: "none" }}>
        <button className="btn w-100 border d-flex align-items-center justify-content-center gap-2">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width="18"
            alt="Google"
          />
          Google
        </button>
      </Link>
    </div>
  );
};
