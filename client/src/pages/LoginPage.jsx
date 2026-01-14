import { useState } from "react";
import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { LoginPageRightCard } from "../components/LoginRegisterPage/LoginPageRightCard";
import { OtpPage } from "./OtpPage";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("LOGIN"); 

  return (
    <>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="position-relative" style={{ width: "820px" }}>
          <LoginPageLeftCard />
          {step === "LOGIN" && (
            <LoginPageRightCard
              onExistingUser={(value) => {
                setPhone(value);
                setStep("OTP");
              }}
            />
          )}

          {step === "OTP" && <OtpPage phone={phone} />}
        </div>
      </div>
    </>
  );
}
