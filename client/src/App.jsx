import { HomePage } from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/HomePage/dropDown.style";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OtpPage } from "./pages/OtpPage";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <div id="recaptcha-container"></div>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>;
          <Route path="/login" element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />}/>;
          <Route path='/otp' element={<OtpPage />}/>
        </Routes>
    </>
  );
}
