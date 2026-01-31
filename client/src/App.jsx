import { HomePage } from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/HomePage/dropDown.style";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OtpPage } from "./pages/OtpPage";
import { ProductPage } from "./pages/ProductPage";
import { SellerPage } from "./pages/SellerPage";
import { SellerAddProduct } from "./components/SellerPage/SellerAddPage";
import { ProductSummaryPage } from "./pages/ProductSummaryPage";
import { AdminPage } from "./pages/AdminPage";
import { ProductCartPage } from "./pages/ProductCartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderSummaryPage } from "./pages/OrderSummaryPage";
import { SellerLogin } from "./components/SellerLoginPage/SellerLogin";
import { PasswordPageRightCard } from "./components/LoginRegisterPage/PasswordPageRightCard";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/product/:productId" element={<ProductSummaryPage />} />
        <Route path="/products/search" element={<ProductPage />} />
        <Route path="/products/trending/:keyword" element={<ProductPage />} />
        <Route path="/products/:mainCategory/:subCategory/:category" element={<ProductPage />} />
        <Route path="/products/:mainCategory/:subCategory" element={<ProductPage />} />
        <Route path="/products/:mainCategory" element={<ProductPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/add-product" element={<SellerAddProduct />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cart/addToCart/:productId" element={<ProductCartPage />} />
        <Route path="/myOrders" element={<OrdersPage />} />
        <Route path="/order-details/:orderId" element={<OrderSummaryPage />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/password" element={<PasswordPageRightCard />}/>
      </Routes>
    </>
  );
}