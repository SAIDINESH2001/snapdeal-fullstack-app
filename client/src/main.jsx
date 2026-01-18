import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { CartProvider } from "./contexts/CartProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
);
