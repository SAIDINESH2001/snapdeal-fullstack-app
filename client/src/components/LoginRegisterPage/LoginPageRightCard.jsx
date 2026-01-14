import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

export const LoginPageRightCard = () => {
  const navigate = useNavigate();

  // ✅ DEFINE CALLBACK
  const onExistingUser = (phone) => {
    navigate("/otp", { state: phone });
  };

  const { mobile, setMobile, handleContinue, error } = useLogin({
    onExistingUser,
  });

  const onContinue = async () => {
    await handleContinue();
    // ❌ no return handling here
  };

  return (
    <div
      className="bg-white shadow rounded-3 p-4 position-absolute top-50 translate-middle-y"
      style={{
        width: "320px",
        right: "140px",
        height: "400px",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="fw-medium mb-0" style={{ fontSize: "14px" }}>
          Login/Sign Up On Snapdeal
        </h5>
        <button className="btn-close" />
      </div>

      <p className="small text-muted mb-3" style={{ fontSize: "11px" }}>
        Please provide your Mobile Number or Email to Login /
        <br />
        Sign Up on Snapdeal
      </p>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Mobile Number / Email"
        style={{ height: "44px", fontSize: "12px", boxShadow: "none" }}
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      {error && <div className="text-danger small mb-2">{error}</div>}

      <LoginButton className="w-100 mb-4" onClick={onContinue}>
        CONTINUE
      </LoginButton>

      <div className="text-center small text-muted mb-3 mt-4">
        or Login Using
      </div>

      <Link to="https://accounts.google.com" style={{ textDecoration: "none" }}>
        <button className="btn w-100 border d-flex align-items-center justify-content-center gap-2">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width="18"
          />
          Google
        </button>
      </Link>
    </div>
  );
};
