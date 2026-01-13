import { useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { checkUserLogin } from "../utils/validations/userInputValidations";

const useLogin = (config = {}) => {
  const {
    loginRef = null,
    signupRef = null,
    otpRef = null,
    setLoginPhone = null,
  } = config;

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  const handleContinue = async () => {
    try {
      const result = checkUserLogin(mobile);
      if (typeof result === "string") {
        setError(result);
        return;
      }

      const { type, value } = result;
      const res = await api.post("/users/check", { type, value });

      // ---------------- PAGE MODE ----------------
      // No refs → just return result to caller
      if (!loginRef) {
        return res.data;
      }

      // ---------------- MODAL MODE ----------------
      const loginModal =
        bootstrap.Modal.getOrCreateInstance(loginRef.current);

      document.activeElement?.blur();
      loginModal.hide();

      // NEW USER → SIGNUP
      if (!res.data.exists && signupRef?.current) {
        loginRef.current.addEventListener(
          "hidden.bs.modal",
          () => {
            bootstrap.Modal.getOrCreateInstance(
              signupRef.current
            ).show();
          },
          { once: true }
        );
      }

      // EXISTING USER → OTP
      if (res.data.exists && otpRef?.current) {
        setLoginPhone?.(value);

        await api.post("/auth/send-otp", { phone: value });

        loginRef.current.addEventListener(
          "hidden.bs.modal",
          () => {
            bootstrap.Modal.getOrCreateInstance(
              otpRef.current
            ).show();
          },
          { once: true }
        );
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
};

export default useLogin;
