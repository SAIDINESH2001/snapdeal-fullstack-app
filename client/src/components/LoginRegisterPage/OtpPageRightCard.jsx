import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../../services/firebase";

export const OtpPageRightCard = ({ phone }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // 🔐 Send OTP when page loads
  useEffect(() => {
    const sendOtp = async () => {
      try {
        setError("");

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            { size: "invisible" }
          );
        }

        const result = await signInWithPhoneNumber(
          auth,
          `+91${phone}`,
          window.recaptchaVerifier
        );

        setConfirmationResult(result);
      } catch (err) {
        console.error("FIREBASE SEND OTP ERROR >>>", err);
        setError("Failed to send OTP. Please retry login.");
      }
    };

    if (phone) {
      sendOtp();
    } else {
      setError("Invalid phone number");
    }
  }, [phone]);

  // 🔑 Verify OTP
  const handleVerify = async () => {
    if (!confirmationResult) {
      setError("OTP session expired. Please retry login.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const firebaseUser =
        await confirmationResult.confirm(otp);

      const idToken =
        await firebaseUser.user.getIdToken();
      console.log(idToken);

      const res = await api.post("/auth/firebase-login", {
        token: idToken,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
        return;
      }

      setError("Invalid or expired OTP");
    } catch (err) {
      console.error("OTP VERIFY ERROR >>>", err);
      setError("OTP verification failed");
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
