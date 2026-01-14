import { forwardRef, useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import { useNavigate } from "react-router-dom";

const OtpModal = forwardRef(({ type, value }, ref) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      bootstrap.Modal.getInstance(ref.current).hide();
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.error || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setError("");
      await api.post("/auth/send-otp", { type, value });
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
            <h5 className="modal-title fw-semibold" style={{ fontSize: "16px" }}>
              Verify OTP
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body text-center px-4">
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
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
