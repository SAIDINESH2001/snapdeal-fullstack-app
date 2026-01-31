import { forwardRef, useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";

export const ForgotPasswordModal = forwardRef(({ type, value, onPasswordUpdated }, ref) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const modalEl = ref.current;
    if (!modalEl) return;

    const reset = () => {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccessMsg("");
      setLoading(false);
    };

    modalEl.addEventListener("shown.bs.modal", reset);
    return () => modalEl.removeEventListener("shown.bs.modal", reset);
  }, [ref]);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/users/reset-password", {
        type,
        value,
        newPassword,
      });

      setSuccessMsg("Password updated successfully!");
      
      setTimeout(() => {
        const modalInstance = bootstrap.Modal.getInstance(ref.current);
        if (modalInstance) modalInstance.hide();
        if (onPasswordUpdated) onPasswordUpdated(); 
      }, 1500);

    } catch (err) {
      setError(err?.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className="modal fade"
      id="forgotPasswordModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm" style={{ width: "350px" }}>
        <div className="modal-content border-0 rounded-3 p-4" style={{ width: "350px" }}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-semibold" style={{ fontSize: "16px" }}>
              Reset Password
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body px-4">
            <p className="text-muted mb-3 text-center" style={{ fontSize: "13px" }}>
              Set a new password for <br />
              <strong>{value}</strong>
            </p>

            <input
              type="password"
              className="form-control mb-2"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ height: "44px", fontSize: "14px", boxShadow: "none" }}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ height: "44px", fontSize: "14px", boxShadow: "none" }}
            />

            {error && <div className="text-danger small mb-2 text-center">{error}</div>}
            {successMsg && <div className="text-success small mb-2 text-center">{successMsg}</div>}

            <LoginButton className="w-100" onClick={handleSubmit} disabled={loading}>
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
});