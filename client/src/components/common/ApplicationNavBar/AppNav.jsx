import { useState } from "react";
import { AppNavInfoTopBar } from "./AppNavInfoTopBar";
import { MainNavbar } from "./AppNavBar";
import { CartModal } from "../../../models/CartModel/CartModal";

export const AppNav = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    console.log("SUCCESS: handleOpenModal triggered in Parent");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <AppNavInfoTopBar />
      
      <MainNavbar 
        user={user} 
        onCartClick={handleOpenModal} 
      />

      <CartModal
        show={showModal}
        handleClose={handleCloseModal}
      />
    </>
  );
};