import { LoginButton } from "../styles/HomePage/homePageNavBar.style"

export default function SignUpModal() {
  return (
    <div
      className="modal fade"
      id="signUpModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-sm"
        style={{ maxWidth: "420px" }}
      >
        <div className="modal-content border-0 rounded-3 p-4">

          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title fw-semibold mb-1">Sign Up</h5>
              <p className="small text-muted mb-0">
                Create an account on Snapdeal
              </p>
            </div>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 pb-4">

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Mobile"
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Name"
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="DOB  DD/MM/YYYY"
            />

            <div className="position-relative mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
              />
              <span
                className="material-symbols-outlined position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                style={{ cursor: "pointer" }}
              >
                visibility_off
              </span>
            </div>

            <p className="small text-muted mb-3">
              Password should have a minimum of 6 characters, at least
              1 numeric and 1 alphabet
            </p>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="keepLoggedIn"
              />
              <label
                className="form-check-label small"
                htmlFor="keepLoggedIn"
              >
                Keep me logged in
              </label>
            </div>

            <LoginButton className="w-100 mb-3">
              CONTINUE
            </LoginButton>

            <p className="text-center small text-muted mb-0">
              By registering, I agree to{" "}
              <span className="text-primary">Terms & Conditions</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
