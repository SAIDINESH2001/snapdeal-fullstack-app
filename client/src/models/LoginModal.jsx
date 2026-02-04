import { LoginButton } from "../styles/HomePage/homePageNavBar.style";
import useLogin from "../hooks/useLogin";

export default function LoginModal({
  loginRef,
  signupRef,
  otpRef,
  setLoginPhone,
}) {
  const { mobile, setMobile, handleContinue, error } = useLogin({
    mode: "modal",
    loginRef,
    signupRef,
    otpRef,
    setLoginPhone,
  });

  return (
    <div
      ref={loginRef}
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "400px", margin: "1.75rem auto" }}
      >
        <div
          className="modal-content border-0 rounded-3 p-2 p-md-3 mx-3 mx-md-0"
        >
          <div className="modal-header border-0 mt-2 px-3 px-md-4">
            <h5
              className="modal-title fw-semibold"
              style={{ fontSize: "15px" }}
            >
              Login/Sign Up On Snapdeal
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-3 px-md-4 pb-4">
            <p
              className="text-center small text-muted mb-3"
              style={{ fontSize: "12px" }}
            >
              Please provide your Mobile Number or Email to
              <br className="d-none d-sm-block"/>
              Login / Sign Up on Snapdeal
            </p>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Mobile Number / Email"
              style={{
                height: "44px",
                fontSize: "13px",
                boxShadow: "none",
              }}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            {error && (
              <div className="text-danger small mb-2 text-center">{error}</div>
            )}

            <LoginButton className="w-100 mt-3" onClick={handleContinue}>
              CONTINUE
            </LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
}
