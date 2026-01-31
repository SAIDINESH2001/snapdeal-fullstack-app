import { useState } from "react";
import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { LoginPageRightCard } from "../components/LoginRegisterPage/LoginPageRightCard";
import { PasswordPageRightCard } from "../components/LoginRegisterPage/PasswordPageRightCard";
import { ForgotPasswordPageRightCard } from "../components/LoginRegisterPage/ForgotPasswordPageRightCard";
import { OtpPageRightCard } from "../components/LoginRegisterPage/OtpPageRightCard";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [step, setStep] = useState("LOGIN"); 
  const [loginData, setLoginData] = useState({ type: "", value: "" });
  const navigate = useNavigate();

  const handleExistingUser = (value, type) => {
    setLoginData({ value, type });
    setStep("PASSWORD");
  };

  const handleNewUser = (value, type) => {
    navigate("/register", { state: { value, type } });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="position-relative" style={{ width: "820px" }}>
        <LoginPageLeftCard />

        {step === "LOGIN" && (
          <LoginPageRightCard
            onExistingUser={handleExistingUser}
            onNewUser={handleNewUser}
          />
        )}

        {step === "PASSWORD" && (
          <PasswordPageRightCard
            type={loginData.type}
            value={loginData.value}
            onForgotPassword={() => setStep("FORGOT_PASSWORD")}
          />
        )}

        {step === "FORGOT_PASSWORD" && (
          <ForgotPasswordPageRightCard
            type={loginData.type}
            value={loginData.value}
            onSuccess={() => setStep("PASSWORD")}
            onCancel={() => setStep("PASSWORD")}
          />
        )}

        {step === "OTP" && (
            <OtpPageRightCard
                type={loginData.type}
                value={loginData.value}
            />
        )}
      </div>
    </div>
  );
}