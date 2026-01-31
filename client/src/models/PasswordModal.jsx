import { forwardRef, useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import { useNavigate } from "react-router-dom";
import { userNavigation } from "../utils/navigations/loginNavigation";
import { useAuth } from "../hooks/useAuth";

export const PasswordModal = forwardRef(({ type, value, forgotPasswordRef }, ref) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const modalEl = ref.current;
    if (!modalEl) return;

    const reset = () => {
      setPassword("");
      setError("");
      setLoading(false);
    };

    modalEl.addEventListener("shown.bs.modal", reset);
    return () => modalEl.removeEventListener("shown.bs.modal", reset);
  }, [ref]);

  const handleLogin = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (!type || !value) {
      setError("Login session expired. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/users/password-validate", {
        type,
        value,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      const modalInstance = bootstrap.Modal.getInstance(ref.current);
      if (modalInstance) modalInstance.hide();

      userNavigation(navigate, res.data.role);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const currentModal = bootstrap.Modal.getInstance(ref.current);
    if (currentModal) currentModal.hide();

    if (forgotPasswordRef?.current) {
        const forgotModal = new bootstrap.Modal(forgotPasswordRef.current);
        forgotModal.show();
    }
  };

  return (
    <div
      ref={ref}
      id="passwordModal"
      className="modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-sm"
        style={{ width: "350px" }}
      >
        <div
          className="modal-content border-0 rounded-3 p-4"
          style={{ width: "350px" }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title fw-semibold"
              style={{ fontSize: "16px" }}
            >
              Enter Password
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body px-4">
            <p className="text-muted mb-3 text-center" style={{ fontSize: "13px" }}>
              Welcome back! Please enter your password for <br />
              <strong>{value}</strong>
            </p>

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              style={{
                height: "44px",
                fontSize: "14px",
                boxShadow: "none",
              }}
            />

            <div className="d-flex justify-content-end mb-3">
                <span 
                    className="text-primary small" 
                    style={{ cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
                    onClick={handleForgotPassword}
                >
                    Forgot Password?
                </span>
            </div>

            {error && (
              <div className="text-danger small mb-2 text-center">{error}</div>
            )}

            <LoginButton
              className="w-100"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
});