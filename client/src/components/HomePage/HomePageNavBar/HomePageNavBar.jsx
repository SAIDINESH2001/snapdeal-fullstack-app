import { useState } from "react";
import { HeaderBar, DownloadBtn } from "../../../styles/HomePage/homePageNavBar.style";
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
        <div className="container-fluid h-100 px-4">
          <div className="d-flex align-items-center justify-content-between h-100 w-100">
            <Link to='/'>
              <img
                src="./snapdeal-logo.png"
                alt="Snap Deal Logo"
                width={210}
                style={{ marginRight: "200px" }}
              />
            </Link>
            <HomePageNavSearch />

            <div className="d-flex align-items-center">
              <HomePageNavBarProfile user={user} onCartClick={handleOpenCart} />
              
              <Link to='https://play.google.com/store/search?q=snapdeal&c=apps'>
                <DownloadBtn className="ms-2">↗ Download App</DownloadBtn>
              </Link>
            </div>
          </div>
        </div>
      </HeaderBar>
      <CartModal 
        show={showModal} 
        handleClose={handleCloseCart} 
      />
    </>
  );
}