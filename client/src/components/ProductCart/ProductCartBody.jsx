import { useState } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { CartModal } from "../../models/CartModel/CartModal";
import { PaymentModal } from "../../models/PaymentModal/PaymentModal";
import { useCartContext } from "../../contexts/cartContext";
import { useCart } from "../../hooks/useCart";

export const ProductCartBody = ({ cartProduct }) => {
  const [active, setActive] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleOpenCart = () => setShowCartModal(true);
  const handleCloseCart = () => setShowCartModal(false);

  const handleOpenPayment = () => setShowPaymentModal(true);
  const handleClosePayment = () => setShowPaymentModal(false);

  const { cartCount } = useCartContext();
  const { subTotal, loading } = useCart(true);

  if (loading) return null;

  const isCartEmpty = Number(cartCount) === 0 || subTotal === 0;

  return (
    <>
      <Container
        className="mt-3 mt-md-4 px-2 px-md-3"
        style={{ maxWidth: "1200px" }}
      >
        <div className="rounded-3 shadow bg-white overflow-hidden">
          {active && (
            <Alert
              className="text-white d-flex align-items-center p-3 m-0 border-0 rounded-0"
              style={{
                background: "linear-gradient(135deg, #19bc9c 0%, #15a589 100%)",
              }}
            >
              <span className="material-symbols-outlined me-3 fs-5">
                check_circle
              </span>
              <p className="m-0 flex-grow-1 fw-medium" style={{ fontSize: "14px" }}>
                {cartProduct?.name} is added to the cart.
              </p>
              <span
                className="material-symbols-outlined ms-auto"
                style={{ cursor: "pointer", opacity: 0.9 }}
                onClick={() => setActive(false)}
              >
                close
              </span>
            </Alert>
          )}

          <div className="p-3 p-md-4">
            {/* Product Info Section */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div
                className="bg-light rounded p-2 d-flex align-items-center justify-content-center"
                style={{ width: "80px", height: "80px", flexShrink: 0 }}
              >
                <img
                  src={cartProduct?.image?.[0]}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="flex-grow-1">
                <p
                  className="m-0 text-muted mb-1"
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Product
                </p>
                <p
                  className="m-0 text-dark fw-semibold mb-2"
                  style={{ fontSize: "15px" }}
                >
                  {cartProduct?.name}
                </p>
                <p
                  className="m-0 fw-bold text-danger"
                  style={{ fontSize: "20px" }}
                >
                  ₹{cartProduct?.sellingPrice?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: "20px" }}
                  >
                    shopping_bag
                  </span>
                  <span className="text-dark fw-semibold">Your Order</span>
                </div>
                <span>
                  <span className={`badge ${isCartEmpty ? "bg-secondary" : "bg-success"} rounded-pill px-3 py-2`}>
                    {cartCount} {Number(cartCount) === 1 ? "Item" : "Items"}
                  </span>
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  Total Amount:
                </span>
                <h4
                  className="m-0 fw-bold text-danger"
                  style={{ fontSize: "24px" }}
                >
                  ₹{subTotal.toLocaleString()}
                </h4>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Button
                className="flex-grow-1 py-3 border-0 fw-bold text-uppercase shadow-sm"
                style={{
                  backgroundColor: isCartEmpty ? "#ccc" : "#e40046",
                  fontSize: "14px",
                  borderRadius: "8px",
                  cursor: isCartEmpty ? "not-allowed" : "pointer",
                  letterSpacing: "0.5px",
                }}
                onClick={handleOpenPayment}
                disabled={isCartEmpty}
              >
                <span className="material-symbols-outlined me-2 align-middle" style={{ fontSize: "18px" }}>
                  shopping_cart_checkout
                </span>
                PROCEED TO CHECKOUT
              </Button>

              <Button
                variant="outline-dark"
                className="flex-grow-1 py-3 fw-bold text-uppercase shadow-sm"
                style={{
                  fontSize: "14px",
                  borderRadius: "8px",
                  borderWidth: "2px",
                  letterSpacing: "0.5px",
                }}
                onClick={handleOpenCart}
              >
                <span className="material-symbols-outlined me-2 align-middle" style={{ fontSize: "18px" }}>
                  shopping_cart
                </span>
                VIEW CART
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <CartModal show={showCartModal} handleClose={handleCloseCart} />
      <PaymentModal show={showPaymentModal} handleClose={handleClosePayment} />
    </>
  );
};