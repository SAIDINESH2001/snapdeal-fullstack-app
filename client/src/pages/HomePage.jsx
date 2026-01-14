import { useRef, useState } from "react";
import TopInfoBar from "../components/HomePage/TopInfoBar/TopInfoBar";
import HomePageNavBar from "../components/HomePage/HomePageNavBar/HomePageNavBar";
import LoginModal from "../models/LoginModal";
import SignUpModal from "../models/SignupModal";
import OtpModal from "../models/OtpModal";
import { CategoryBar } from "../components/HomePage/CategoryBar/CategoryBar";
import HomeCarousel from "../components/HomePage/HomeCarousal/HomeCarousal";

export const HomePage = () => {
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const otpRef = useRef(null);

  const [loginPhone, setLoginPhone] = useState("");

  return (
    <div className="w-100">
      <LoginModal
        loginRef={loginRef}
        signupRef={signupRef}
        otpRef={otpRef}
        setLoginPhone={setLoginPhone}
      />

      <SignUpModal ref={signupRef} />
      <OtpModal ref={otpRef} type="phone" value={loginPhone} />

      <TopInfoBar />
      <HomePageNavBar />
      <CategoryBar />
      <HomeCarousel />
    </div>
  );
};
