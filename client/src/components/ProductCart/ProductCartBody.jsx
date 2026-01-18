import { useState } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { CartModal } from "../../models/CartModel/CartModal"; 
import { useCartContext } from "../../contexts/cartContext";
import { useCart } from "../../hooks/useCart"; 

export const ProductCartBody = ({ cartProduct }) => {
  const [active, setActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const { cartCount } = useCartContext();
  const { subTotal, loading } = useCart(true);

  if (loading) return null;

  return (
    <>
      <Container className="mt-4">
        <div className="border rounded shadow-sm bg-white overflow-hidden">
          {active && (
            <Alert
              className="text-light d-flex align-items-center p-3 m-0 border-0 rounded-0"
              style={{ background: "#19bc9c" }}
            >
              <span className="material-symbols-outlined me-3">check_circle</span>
              <p className="m-0 flex-grow-1" style={{ fontSize: "14px" }}>
                {cartProduct?.name} is added to the cart.
              </p>
              <span 
                className="material-symbols-outlined ms-auto" 
                style={{ cursor: 'pointer' }}
                onClick={() => setActive(false)}
              >
                close
              </span>
            </Alert>
          )}

          <div className="d-flex align-items-center justify-content-between p-5 bg-white">
            <div className="d-flex align-items-center gap-3 flex-grow-1 border-end pe-4" style={{ flexBasis: '0' }}>
              <img
                src={cartProduct?.image?.[0]} 
                alt="Product"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
              <div>
                <p className="m-0 text-muted small mb-1">{cartProduct?.name}</p>
                <p className="m-0 fw-bold fs-6">Rs. {cartProduct?.sellingPrice}</p>
              </div>
            </div>

            <div className="px-5 flex-grow-1 border-end" style={{ flexBasis: '0' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-muted small">Your Order</span>
                <span className="badge rounded-pill border border-success text-success fw-normal px-2" style={{ fontSize: "11px" }}>
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <h4 className="m-0 fw-normal" style={{fontSize: '18px'}}>
                You Pay: <span className="fw-semibold">Rs. {subTotal.toLocaleString()}</span>
              </h4>
            </div>

            <div className="d-flex gap-3 ps-4 align-items-center">
              <Button
                className="px-4 py-2 border-0 fw-bold"
                style={{ backgroundColor: "#E40046", fontSize: "13px", borderRadius: '2px' }}
              >
                PROCEED TO CHECKOUT
              </Button>
              
              <Button
                variant="dark"
                className="px-4 py-2 fw-bold"
                style={{ backgroundColor: "#333", fontSize: "13px", borderRadius: '2px' }}
                onClick={handleOpenModal}
              >
                VIEW CART
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <CartModal show={showModal} handleClose={handleCloseModal} />
    </>
  );
};