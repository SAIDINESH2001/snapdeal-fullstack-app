import { forwardRef, useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import { useNavigate } from "react-router-dom";
import { userNavigation } from "../utils/navigations/loginNavigation";
import { useAuth } from "../hooks/useAuth";

export const OtpModal = forwardRef(({ type, value }, ref) => {
  const {setUser} = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  useEffect(() => {
    const modalEl = ref.current;
    if (!modalEl) return;

    const reset = () => {
      setOtp("");
      setError("");
      setLoading(false);
      setResendStatus("");
    };

    modalEl.addEventListener("shown.bs.modal", reset);
    return () => modalEl.removeEventListener("shown.bs.modal", reset);
  }, [ref]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    if (!type || !value) {
      setError("Login session expired. Please try again.");
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
      setUser(res.data.user);

      const modalInstance = bootstrap.Modal.getInstance(ref.current);
      if (modalInstance) modalInstance.hide();

      userNavigation(navigate, res.data.role);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setError("");
      setResendStatus("");
      if (!type || !value) return;

      await api.post("/auth/send-otp", { type, value });
      setResendStatus("OTP sent successfully!");
      setTimeout(() => setResendStatus(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div ref={ref} id="otpModal" className="modal fade" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-sm" style={{width: '350px'}}>
        <div className="modal-content border-0 rounded-3 p-4" style={{width: '350px'}}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-semibold" style={{ fontSize: "16px" }}>
              Verify OTP
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body text-center px-4">
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              Enter OTP sent to <br />
              <strong>{value || "your device"}</strong>
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

            {error && <div className="text-danger small mb-2">{error}</div>}
            {resendStatus && <div className="text-success small mb-2">{resendStatus}</div>}

            <div
              className="text-primary small mb-4"
              style={{ cursor: "pointer", fontWeight: "500" }}
              onClick={resendOtp}
            >
              Resend OTP
            </div>

            <LoginButton className="w-100" onClick={handleVerify} disabled={loading}>
              {loading ? "VERIFYING..." : "CONTINUE"}
            </LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
});
