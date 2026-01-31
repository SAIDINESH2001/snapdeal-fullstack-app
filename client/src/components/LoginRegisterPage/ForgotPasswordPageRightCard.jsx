import { useState } from "react";
import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import api from "../../services/axios";

export const ForgotPasswordPageRightCard = ({ type, value, onSuccess, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      setError(err?.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white shadow rounded-3 p-4 position-absolute top-50 translate-middle-y"
      style={{ width: "340px", right: "140px", minHeight: "400px" }}
    >
      <h5 className="fw-medium mb-3">Reset Password</h5>

      <p className="text-center text-muted mb-3" style={{ fontSize: "13px" }}>
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

      <LoginButton className="w-100 mb-3" onClick={handleSubmit} disabled={loading}>
        {loading ? "UPDATING..." : "UPDATE PASSWORD"}
      </LoginButton>

      <div className="text-center">
        <span 
          className="text-primary small" 
          style={{ cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
          onClick={onCancel}
        >
          Back to Login
        </span>
      </div>
    </div>
  );
};