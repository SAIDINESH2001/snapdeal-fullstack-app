import { LoginPageLeftCard } from "../components/LoginPage/LoginPageLeftCard";
import { LoginPageRightCard } from "../components/LoginPage/LoginPageRightCard";

export default function LoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="position-relative" style={{ width: "820px" }}>
            <LoginPageLeftCard />
            <LoginPageRightCard />
      </div>
    </div>
  );
}