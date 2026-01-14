import { useLocation } from "react-router-dom";
import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { OtpPageRightCard } from "../components/LoginRegisterPage/OtpPageRightCard";

export const OtpPage = () => {
  const location = useLocation();
  const phone = location?.state;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="position-relative" style={{ width: "820px" }}>
        <LoginPageLeftCard />
        <OtpPageRightCard phone={phone} />
      </div>
    </div>
  );
};
