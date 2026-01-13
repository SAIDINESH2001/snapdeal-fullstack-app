import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { LoginPageRightCard } from "../components/LoginRegisterPage/LoginPageRightCard";
import { useRef, useState } from "react";
import LoginModal from "../models/LoginModal";
import SignUpModal from "../models/SignupModal";
import OtpModal from "../models/OtpModal";

export default function LoginPage() {
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const otpRef = useRef(null);

  const [loginPhone, setLoginPhone] = useState("");

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="position-relative" style={{ width: "820px" }}>

        {/* Modals (same ones used on HomePage) */}
        <LoginModal
          loginRef={loginRef}
          signupRef={signupRef}
          otpRef={otpRef}
          setLoginPhone={setLoginPhone}
        />
        <SignUpModal ref={signupRef} />
        <OtpModal ref={otpRef} phone={loginPhone} />

        {/* Page UI */}
        <LoginPageLeftCard />
        <LoginPageRightCard
          loginRef={loginRef}   // opens login modal
        />
      </div>
    </div>
  );
}
