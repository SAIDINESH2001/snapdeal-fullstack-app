import { useRef, useState } from "react";
import TopInfoBar from "../components/HomePage/TopInfoBar/TopInfoBar";
import HomePageNavBar from "../components/HomePage/HomePageNavBar/HomePageNavBar";
import LoginModal from "../models/LoginModal";
import SignUpModal from "../models/SignupModal";
import {OtpModal} from "../models/OtpModal";
import { CategoryBar } from "../components/HomePage/CategoryBar/CategoryBar";
import HomeCarousel from "../components/HomePage/HomeCarousal/HomeCarousal";

export const HomePage = () => {
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const otpRef = useRef(null);

  const [loginData, setLoginData] = useState({ value: "", type: "" });

  return (
    <div className="w-100">
      <LoginModal
        loginRef={loginRef}
        signupRef={signupRef}
        otpRef={otpRef}
        setLoginPhone={(data) => setLoginData(data)} 
      />

      <SignUpModal ref={signupRef} />
      
      <OtpModal 
        ref={otpRef} 
        type={loginData.type} 
        value={loginData.value} 
      />

      <TopInfoBar />
      <HomePageNavBar />
      <CategoryBar />
      <HomeCarousel />
    </div>
  );
};
