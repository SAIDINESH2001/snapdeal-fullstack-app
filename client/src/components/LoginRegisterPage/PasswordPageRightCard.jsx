import { useState } from "react";
import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userNavigation } from "../../utils/navigations/loginNavigation";

export const PasswordPageRightCard = ({ type, value, onForgotPassword }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (!type || !value) {
      setError("Session expired.");
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

  return (
    <div
      className="bg-white shadow rounded-3 p-4 position-absolute top-50 translate-middle-y"
      style={{ width: "340px", right: "140px", minHeight: "400px" }}
    >
      <h5 className="fw-medium mb-3">Login On Snapdeal</h5>

      <p className="text-center text-muted mb-3" style={{ fontSize: "13px" }}>
        Welcome back! Please enter your password for <br />
        <strong>{value}</strong>
      </p>

      <input
        type="password"
        className="form-control mb-3"
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
          onClick={onForgotPassword}
        >
          Forgot Password?
        </span>
      </div>

      {error && (
        <div className="text-danger small text-center mb-2">
          {error}
        </div>
      )}

      <LoginButton
        className="w-100"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "LOGGING IN..." : "LOGIN"}
      </LoginButton>
    </div>
  );
};