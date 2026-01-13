import { LoginButton } from "../styles/HomePage/homePageNavBar.style";

export default function LoginModal() {
  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 rounded-3">

          <div className="modal-header border-0">
            <h5 className="modal-title fw-semibold" style={{fontSize: "16px"}}>
              Login/Sign Up On Snapdeal
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 pb-4">
            <p className="text-center small text-muted mb-3" style={{fontSize: "12px"}}>
              Please provide your Mobile Number or Email to
              <br />
              Login / Sign Up on Snapdeal
            </p>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Mobile Number/ Email"
              style={{ height: "44px", fontSize:"12px", boxShadow: "none" }}
            />

            <LoginButton className="w-100">
              CONTINUE
            </LoginButton>
          </div>

        </div>
      </div>
    </div>
  );
}
