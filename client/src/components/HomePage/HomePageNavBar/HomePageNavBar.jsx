import {
  HeaderBar,
  DownloadBtn,
} from "../../../styles/HomePage/homePageNavBar.style";
import { HomePageNavSearch } from "./HomePageNavSearch";
import HomePageNavBarProfile from "./HomePageNavBarProfile";
import { Link } from "react-router-dom";
import LoginModal from "../../../models/LoginModal";

export default function HomePageNavBar() {
  return (
    <HeaderBar>
      <div className="container-fluid h-100 px-4">
        <div className="d-flex align-items-center justify-content-between h-100 w-100">
          <img
            src="./snapdeal-logo.png"
            alt="Snap Deal Logo"
            width={210}
            style={{ marginRight: "200px" }}
          />

          <HomePageNavSearch />


          <div className="d-flex align-items-center">
            <HomePageNavBarProfile />
            <Link to='https://play.google.com/store/search?q=snapdeal&c=apps'>
              <DownloadBtn className="ms-2">↗ Download App</DownloadBtn>
            </Link>
            
          </div>
        </div>
      </div>
    </HeaderBar>
  );
}
