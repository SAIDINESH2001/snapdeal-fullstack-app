import TopInfoBar from "../components/HomePage/TopInfoBar/TopInfoBar";
import HomePageNavBar from "../components/HomePage/HomePageNavBar/HomePageNavBar";
import LoginModal from "../models/LoginModal";
import SignUpModal from "../models/SignupModal";


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