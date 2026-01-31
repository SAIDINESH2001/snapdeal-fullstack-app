import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { PasswordPageRightCard } from "../components/LoginRegisterPage/PasswordPageRightCard";

export const PasswordPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="position-relative" style={{ width: "820px" }}>
        <LoginPageLeftCard />
        <PasswordPageRightCard />
      </div>
    </div>
  );
};