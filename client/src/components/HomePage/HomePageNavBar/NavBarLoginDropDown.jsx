import { LoginButton } from "../../../styles/HomePage/homePageNavBar.style";
import {useNavigate} from 'react-router-dom';

export default function NavBarLoginDropDown() {
  const navigate = useNavigate();
  const handleAccount = () => {
    navigate('/login');
  }
  return (
    <div className="dropdown-menu p-0 border-0 ms-3" style={{ width: "260px" }}>
      <div className="bg-dark text-white rounded-3 overflow-hidden">
        <div className="px-3 py-2 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined">person</span>
          <span className="fw-medium" style={{cursor: 'pointer'}} onClick={handleAccount}>Your Account</span>
        </div>

        <div className="px-3 py-2 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined">box</span>
          <span className="fw-medium">Your Orders</span>
        </div>

        <hr className="m-0 border-secondary" />

        <div className="text-center text-secondary small mt-2">
          If you are a new user
        </div>

        <div
          className="btn w-100 text-center fw-medium text-white mb-2"
          data-bs-toggle="modal"
          data-bs-target="#signUpModal"
        >
          Register
        </div>

        <div className="px-3 pb-3">
          <LoginButton
            className="w-100"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            LOGIN
          </LoginButton>
        </div>
      </div>
    </div>
  );
}
