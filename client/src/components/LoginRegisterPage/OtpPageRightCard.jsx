import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

export const OtpPageRightCard = ({ phone }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
        return;
      }

      setError("Invalid or expired OTP");
    } catch {
      setError("Verification failed. Try again.");
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
        <strong>{phone}</strong>
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
          letterSpacing: "6px",
          boxShadow: "none",
        }}
      />

      {error && (
        <div className="text-danger small text-center mb-2">
          {error}
        </div>
      )}

      <div
        className="text-center text-primary small mb-4"
        style={{ cursor: "pointer" }}
        onClick={() =>
          api.post("/auth/send-otp", { phone })
        }
      >
        Resend OTP
      </div>

      <LoginButton className="w-100" onClick={handleVerify}>
        CONTINUE
      </LoginButton>
    </div>
  );
};
