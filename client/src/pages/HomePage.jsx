import { useRef, useState } from "react";
import TopInfoBar from "../components/HomePage/TopInfoBar/TopInfoBar";
import HomePageNavBar from "../components/HomePage/HomePageNavBar/HomePageNavBar";
import LoginModal from "../models/LoginModal";
import SignUpModal from "../models/SignupModal";
import { PasswordModal } from "../models/PasswordModal";
import { ForgotPasswordModal } from "../models/PasswordForgetModal";
import { OtpModal } from "../models/OtpModal";
import { CategoryBar } from "../components/HomePage/CategoryBar/CategoryBar";
import HomeCarousel from "../components/HomePage/HomeCarousal/HomeCarousal";
import { HomeDeal } from "../components/HomePage/HomeDeals/homeDeals";
import { ProductCartFooter } from "../components/ProductCart/ProductCartFooter";

export const HomePage = () => {
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const passwordRef = useRef(null);
  const forgotPasswordRef = useRef(null);
  const otpRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ value: "", type: "" });

  return (
    <div className="w-100">
      <LoginModal
        loginRef={loginRef}
        signupRef={signupRef}
        passwordRef={passwordRef}
        setLoginPhone={(data) => setLoginData(data)}
      />

      <SignUpModal ref={signupRef} />

      <PasswordModal 
        ref={passwordRef}
        forgotPasswordRef={forgotPasswordRef}
        type={loginData.type}
        value={loginData.value}
      />

      <ForgotPasswordModal 
        ref={forgotPasswordRef}
        type={loginData.type}
        value={loginData.value}
      />
      
      <OtpModal 
        ref={otpRef} 
        type={loginData.type} 
        value={loginData.value} 
        onLoginSuccess={(userData) => setUser(userData)}
      />

      <TopInfoBar />
      <HomePageNavBar user={user} />
      <CategoryBar />
      <HomeCarousel />
      <HomeDeal />
      <ProductCartFooter />
    </div>
  );
};