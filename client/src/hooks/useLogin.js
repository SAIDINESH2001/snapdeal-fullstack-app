import { useState } from "react";
import api from "../services/axios";
import * as bootstrap from "bootstrap";
import { checkUserLogin } from "../utils/validations/userInputValidations";

export default function useLogin({
  mode,
  loginRef,
  otpRef,
  signupRef,
  setLoginPhone,
  onExistingUser,
  onNewUser,
}) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setError("");

    const validation = checkUserLogin(mobile);
    if (typeof validation === "string") {
      setError(validation);
      return;
    }

    const { type, value } = validation;

    try {
      const checkRes = await api.post("/users/check", { type, value });

      if (checkRes.data.exists) {
        await api.post("/auth/send-otp", { type, value });

        if (mode === "modal") {
          setLoginPhone({ type, value });

          document.activeElement?.blur();
          const modalInst = bootstrap.Modal.getInstance(loginRef.current);
          modalInst?.hide();

          const otpModal = new bootstrap.Modal(otpRef.current);
          otpModal.show();
        }

        if (mode === "page") {
          onExistingUser(value, type);
        }
      } else {
        if (mode === "modal") {
          setLoginPhone({ type, value });
          bootstrap.Modal.getInstance(loginRef.current)?.hide();
          new bootstrap.Modal(signupRef.current).show();
        }

        if (mode === "page") {
          onNewUser(value, type);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return { mobile, setMobile, handleContinue, error };
}