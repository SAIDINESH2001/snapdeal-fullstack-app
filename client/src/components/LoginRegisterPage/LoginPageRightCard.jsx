import { LoginButton } from "../../styles/HomePage/homePageNavBar.style";
import { Link } from "react-router-dom";

export const LoginPageRightCard = () => {
  return (
    <>
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
          className="form-control mb-3"
          placeholder="Mobile Number/ Email"
          style={{ height: "44px", fontSize: "12px", boxShadow: "none" }}
        />

        <LoginButton className="w-100 mb-4">CONTINUE</LoginButton>

        <div className="text-center small text-muted mb-3 mt-5">
          or Login Using
        </div>

        <Link to="https://accounts.google.com/v3/signin/accountchooser?client_id=36115742491-h38grsuuq7jilk484i69j84bmul8nst5.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.snapdeal.com%3A443%2Fj_spring_google_security_check%3Fsource%3Dgoogle&response_type=code&scope=email+profile&dsh=S1262159817%3A1768289184440365&o2v=1&service=lso&flowName=GeneralOAuthFlow&opparams=%253F&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAMfUdqck86Vx1agsyjWxxxg3weZL6v95sWaRKSg2P2uIeJjItm31U-4Tx2PM1AlOJBnhulwk6qLKAh3xLqffT9qw_YR4nO4vxW_QCw1k1a1zVSZUmckz0qTohVXxAi1oHlyU3oQKX2bI4v4H2fzeigl8xxYjbLoJrvh1dn3Eal3Ea41n1BqZsQBQLo1YBiFJPpNYzgGYrLRX264wOgs_BPgpwBXjB_WFklZrX-Emrki46Vq173hIPHk4B5biu8QHURHlEyTWOCkhVU-ltkm0rBcPpw7PxgE1d18A5Ja1To61ShgjTEy6MYIZCrqGQBg6kLFPGIqZIxPa-ZF49uTnP1Svis3NHWiOJZj2R7zuaM9C6gvyqKPcu0F8aYDRBtfI0oBPALs7_IZlmUrburTeHmrL_pCjpGCLfbEyu-cmyE5jjM0d09jxTGa7sqi7D11lLMGArzQsAOPQx63Cl__4kjhy7Z8Dw%26flowName%3DGeneralOAuthFlow%26as%3DS1262159817%253A1768289184440365%26client_id%3D36115742491-h38grsuuq7jilk484i69j84bmul8nst5.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fwww.snapdeal.com%3A443" style={{textDecoration: 'none'}}>
          <button className="btn w-100 border d-flex align-items-center justify-content-center gap-2" >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="18"
            />
            Google
          </button>
        </Link>
      </div>
    </>
  );
};
