import { AdminDashboard } from "../components/AdminPage/AdminPageDashBoard";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { useAuth } from "../hooks/useAuth";


export const AdminPage = () => {
    const {user} = useAuth();

    return (
        <>
        {user?.role !== 'admin' && (
        <div className="p-5 text-center">
        <h3>Access Denied. Only admins can view this page.</h3>
        </div>
      )}
      {user?.role === 'admin' && (
        <>
        <AppNav />
        <AdminDashboard user={user}/>      
        </>

      )}
        </>
    )
}