import { useState } from "react";
import {
  HeaderBar,
  DownloadBtn,
} from "../../../styles/HomePage/homePageNavBar.style";
import { HomePageNavSearch } from "./HomePageNavSearch";
import HomePageNavBarProfile from "./HomePageNavBarProfile";
import { CartModal } from "../../../models/CartModel/CartModal";
import { Link } from "react-router-dom";

export default function HomePageNavBar({ user }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenCart = () => setShowModal(true);
  const handleCloseCart = () => setShowModal(false);

  return (
    <>
      <HeaderBar>
        <div className="w-100 h-100 px-2 px-md-3 px-lg-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between h-100 w-100 gap-2">
            <Link to="/" className="d-flex align-items-center flex-shrink-0">
              <img
                src="./snapdeal-logo.png"
                alt="Snap Deal Logo"
                style={{ height: "35px", width: "auto" }}
                className="d-md-none"
              />
              <img
                src="./snapdeal-logo.png"
                alt="Snap Deal Logo"
                style={{ height: "45px", width: "auto" }}
                className="d-none d-md-block d-lg-none"
              />
              <img
                src="./snapdeal-logo.png"
                alt="Snap Deal Logo"
                style={{ height: "55px", width: "auto" }}
                className="d-none d-lg-block d-xl-none"
              />
              <img
                src="./snapdeal-logo.png"
                alt="Snap Deal Logo"
                style={{ height: "65px", width: "auto" }}
                className="d-none d-xl-block"
              />
            </Link>
            <div
              className="flex-grow-1 mx-1 mx-md-2"
              style={{ maxWidth: "600px", minWidth: "200px" }}
            >
              <HomePageNavSearch />
            </div>

            <div className="d-flex align-items-center gap-2">
              <HomePageNavBarProfile user={user} onCartClick={handleOpenCart} />

              <Link
                to="https://play.google.com/store/search?q=snapdeal&c=apps"
                className="d-none d-md-block"
              >
                <DownloadBtn className="ms-2">↗ Download App</DownloadBtn>
              </Link>
            </div>
          </div>
        </div>
      </HeaderBar>
      <CartModal show={showModal} handleClose={handleCloseCart} />
    </>
  );
}
