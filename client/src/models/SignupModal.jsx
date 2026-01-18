import { forwardRef } from "react";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import useSignup from "../hooks/useSignUp";

const SignUpModal = forwardRef((_, ref) => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useSignup();

  const onContinue = async () => {
    const res = await handleSubmit();

    if (res?.success) {
      const modal = bootstrap.Modal.getOrCreateInstance(ref.current);
      document.activeElement?.blur();
      modal.hide();

      ref.current.addEventListener(
        "hidden.bs.modal",
        () => navigate("/login"),
        { once: true }
      );
    }
  };

  return (
    <div
      ref={ref}
      className="modal fade"
      id="signUpModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-sm"
        style={{ maxWidth: "420px" }}
      >
        <div className="modal-content border-0 rounded-3 p-4">

          {/* HEADER */}
          <div className="modal-header border-0 px-0">
            <div>
              <h5 className="modal-title fw-semibold mb-1">Sign Up</h5>
              <p className="small text-muted mb-0">
                Create an account on Snapdeal
              </p>
            </div>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>

          {/* BODY */}
          <div className="modal-body px-0 pb-0">

            {/* MOBILE */}
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Mobile"
              style={{ boxShadow: "none" }}
            />
            {errors.phone && (
              <div className="text-danger small mb-2">{errors.phone}</div>
            )}

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Email"
              style={{ boxShadow: "none" }}
            />
            {errors.email && (
              <div className="text-danger small mb-2">{errors.email}</div>
            )}

            {/* NAME */}
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Name"
              style={{ boxShadow: "none" }}
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
              style={{ boxShadow: "none" }}
            />
            {errors.dob && (
              <div className="text-danger small mb-2">{errors.dob}</div>
            )}

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Password"
              style={{ boxShadow: "none" }}
            />
            {errors.password && (
              <div className="text-danger small mb-2">
                {errors.password}
              </div>
            )}

            {/* KEEP LOGGED IN */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="keepLoggedIn"
                checked={values.keepLoggedIn}
                onChange={handleChange}
                id="keepLoggedIn"
              />
              <label
                className="form-check-label small"
                htmlFor="keepLoggedIn"
              >
                Keep me logged in
              </label>
            </div>

            {errors.server && (
              <div className="text-danger small mb-2 text-center">
                {errors.server}
              </div>
            )}

            <LoginButton
              className="w-100 mb-3"
              disabled={loading}
              onClick={onContinue}
            >
              {loading ? "PLEASE WAIT…" : "CONTINUE"}
            </LoginButton>

            <p className="text-center small text-muted mb-0">
              By registering, I agree to{" "}
              <span className="text-primary">Terms & Conditions</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
});

export default SignUpModal;
