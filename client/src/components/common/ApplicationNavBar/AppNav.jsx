import { AppNavInfoTopBar } from "./AppNavInfoTopBar";
import { MainNavbar } from "./AppNavBar";

export const AppNav = ({user}) => {
    return (
        <>
            <AppNavInfoTopBar />
            <MainNavbar user={user}/>
        </>
    )
}