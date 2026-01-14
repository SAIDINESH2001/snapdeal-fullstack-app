import { forwardRef, useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import { useNavigate } from "react-router-dom";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { confirmationResult as sharedConfirmation } from "../hooks/useLogin";

const OtpModal = forwardRef(({ phone }, ref) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState(sharedConfirmation);

  // Reset state every time modal opens
  useEffect(() => {
    const modalEl = ref.current;
    if (!modalEl) return;

    const reset = () => {
      setOtp("");
      setError("");
      setLoading(false);
    };

    modalEl.addEventListener("shown.bs.modal", reset);
    return () =>
      modalEl.removeEventListener("shown.bs.modal", reset);
  }, [ref]);

  const handleVerify = async () => {
    if (!confirmationResult) {
      setError("OTP session expired. Please resend OTP.");
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

      const res = await api.post("/auth/firebase-login", {
        token: idToken,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      bootstrap.Modal.getOrCreateInstance(ref.current).hide();
      navigate("/");
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setError("");

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div
      ref={ref}
      id="otpModal"
      className="modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 rounded-3 p-4">
          <div className="modal-header border-0">
            <h5
              className="modal-title fw-semibold"
              style={{ fontSize: "16px" }}
            >
              Sign Up On Snapdeal
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body text-center px-4">
            {/* LOCK IMAGE — PRESERVED */}
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "90px",
                height: "90px",
                background: "#f5f5f5",
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9OV-s9rorFm-Hb8ZCLZv0y-ijtKyAwJ2Dkg&s"
                width="48"
                alt="lock"
              />
            </div>

            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              Please enter verification code (OTP) sent to:
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
                border: "2px solid #000",
                boxShadow: "none",
              }}
            />

            {error && (
              <div className="text-danger small mb-2">
                {error}
              </div>
            )}

            <div
              className="text-primary small mb-4"
              style={{ cursor: "pointer" }}
              onClick={resendOtp}
            >
              Resend OTP
            </div>

            <LoginButton
              className="w-100"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "VERIFYING..." : "CONTINUE"}
            </LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OtpModal;
