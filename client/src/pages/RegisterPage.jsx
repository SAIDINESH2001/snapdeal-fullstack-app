import { LoginPageLeftCard } from "../components/common/LoginPageLeftCard";
import { RegisterPageRightCard } from "../components/LoginRegisterPage/RegisterPageRightCard";

export const RegisterPage = () => {
    return (
       <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
             <div className="position-relative" style={{ width: "820px" }}>
                   <LoginPageLeftCard />
                   <RegisterPageRightCard />
             </div>
           </div>
    )
}