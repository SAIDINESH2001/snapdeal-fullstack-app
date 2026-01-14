import { useState } from "react";
import api from "../services/axios";
import * as bootstrap from "bootstrap";

export default function useLogin({
  mode, // "modal" | "page"

  // modal-only
  loginRef,
  otpRef,
  signupRef,
  setLoginPhone,

  // page-only
  onExistingUser,
  onNewUser,
}) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const detectType = (value) =>
    /^\d+$/.test(value) ? "phone" : "email";

  const handleContinue = async () => {
    if (!mobile) {
      setError("Required");
      return;
    }

    const type = detectType(mobile);

    try {
      const checkRes = await api.post("/users/check", {
        type,
        value: mobile,
      });

      if (checkRes.data.exists) {
        await api.post("/auth/send-otp", {
          type,
          value: mobile,
        });

        // ---------- MODAL FLOW ----------
        if (mode === "modal") {
          setLoginPhone(mobile);

          document.activeElement?.blur();

          bootstrap.Modal.getInstance(
            loginRef.current
          )?.hide();

          new bootstrap.Modal(
            otpRef.current
          ).show();
        }

        // ---------- PAGE FLOW ----------
        if (mode === "page") {
          onExistingUser(mobile, type);
        }
      } else {
        if (mode === "modal") {
          bootstrap.Modal.getInstance(
            loginRef.current
          )?.hide();

          new bootstrap.Modal(
            signupRef.current
          ).show();
        }

        if (mode === "page") {
          onNewUser(mobile, type);
        }
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return {
    mobile,
    setMobile,
    handleContinue,
    error,
  };
}
