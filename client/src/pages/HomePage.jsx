import TopInfoBar from "../components/HomePage/TopInfoBar/TopInfoBar";
import HomePageNavBar from "../components/HomePage/HomePageNavBar/HomePageNavBar";
import LoginModal from "../models/LoginModel";
import SignUpModal from "../models/SignupModel";


export const HomePage = () => {
    return (
        <div className="w-full">
            <LoginModal />
            <SignUpModal />
            <TopInfoBar />
            <HomePageNavBar />
        </div>
    )
}