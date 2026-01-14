import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const OtpPageRightCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const { type, value } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sendOtp = async () => {
      try {
        setError("");
        await api.post("/auth/send-otp", { type, value });
      } catch {
        setError("Failed to send OTP");
      }
    };

    if (type && value) {
      sendOtp();
    } else {
      setError("Invalid login identifier");
    }
  }, [type, value]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-otp", {
        type,
        value,
        otp,
      });

      localStorage.setItem("token", res.data.token);

      const me = await api.get("/auth/refresh");
      setUser(me.data.user);

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.error || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white shadow rounded-3 p-4 position-absolute top-50 translate-middle-y"
      style={{ width: "340px", right: "140px", minHeight: "420px" }}
    >
      <h5 className="fw-medium mb-3">Login On Snapdeal</h5>

      <p className="text-center text-muted mb-3" style={{ fontSize: "13px" }}>
        Enter OTP sent to
        <br />
        <strong>{value}</strong>
      </p>

      <input
        className="form-control text-center mb-2"
        placeholder="Code"
        maxLength={6}
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          setError("");
        }}
        style={{
          height: "44px",
          fontSize: "14px",
          letterSpacing: "6px",
          boxShadow: "none",
        }}
      />

      {error && (
        <div className="text-danger small text-center mb-2">
          {error}
        </div>
      )}

      <LoginButton
        className="w-100"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? "VERIFYING..." : "CONTINUE"}
      </LoginButton>
    </div>
  );
};
