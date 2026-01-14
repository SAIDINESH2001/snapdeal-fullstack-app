import { useState } from "react";
import * as bootstrap from "bootstrap";
import api from "../services/axios";
import { checkUserLogin } from "../utils/validations/userInputValidations";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../services/firebase";

let confirmationResult; // module-scoped, intentionally shared

const useLogin = (config = {}) => {
  const {
    loginRef = null,
    signupRef = null,
    otpRef = null,
    setLoginPhone = null,
    onExistingUser = null,
  } = config;

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  const sendFirebaseOtp = async (phone) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      window.recaptchaVerifier
    );
  };

  const handleContinue = async () => {
    try {
      setError(null);

      const result = checkUserLogin(mobile);
      if (typeof result === "string") {
        setError(result);
        return;
      }

      const { type, value } = result;
      const res = await api.post("/users/check", { type, value });

      if (res.data.exists) {
        setLoginPhone?.(value);

        await sendFirebaseOtp(value);

        // PAGE MODE
        if (!loginRef) {
          onExistingUser?.(value);
          return;
        }

        // MODAL MODE
        const loginModal = bootstrap.Modal.getOrCreateInstance(
          loginRef.current
        );

        document.activeElement?.blur();

        const onHidden = () => {
          bootstrap.Modal.getOrCreateInstance(otpRef.current).show();
        };

        loginRef.current.addEventListener(
          "hidden.bs.modal",
          onHidden,
          { once: true }
        );

        loginModal.hide();
        return;
      }

      // New user → signup modal
      if (!res.data.exists && signupRef?.current) {
        loginRef.current.addEventListener(
          "hidden.bs.modal",
          () => {
            bootstrap.Modal.getOrCreateInstance(signupRef.current).show();
          },
          { once: true }
        );
      }
    } catch (err) {
      console.error("useLogin ERROR >>>", err);
      setError("Something went wrong");
    }
  };

  return {
    mobile,
    setMobile,
    handleContinue,
    error,
    confirmationResult,
  };
};

// === Important: export the module-scoped confirmationResult so other modules can import it ===
export { confirmationResult };

export default useLogin;
