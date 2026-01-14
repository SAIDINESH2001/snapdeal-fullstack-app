import { HomePage } from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/HomePage/dropDown.style";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OtpPage } from "./pages/OtpPage";
import { ProductPage } from "./pages/ProductPage";
import { SellerPage } from "./pages/SellerPage";
import { SellerAddProduct } from "./components/SellerPage/SellerAddPage";

export default function App() {
  return (
    <>
      <GlobalStyles />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>;
          <Route path="/login" element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />}/>;
          <Route path='/otp' element={<OtpPage />}/>
          <Route path="/products/:mainCategory/:subCategory/:category" element={<ProductPage />}/>
          <Route path='/seller' element={<SellerPage />} />
          <Route path='/seller/add-product' element={<SellerAddProduct />} />
        </Routes>
    </>
  );
}
