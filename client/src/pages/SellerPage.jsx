import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { useAuth } from "../hooks/useAuth";
import { SellerDashboard } from "../components/SellerPage/SellerDashBoard";

export const SellerPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null; 
  if (!user) return null; 

  return (
    <>
      {user?.role === 'seller' && (
        <> 
          <AppNav user={user} />
          <SellerDashboard />
        </>
      )}
      
      {user?.role !== 'seller' && (
        <div className="p-5 text-center">
           <h3>Access Denied. Only sellers can view this page.</h3>
        </div>
      )}
    </>
  );
};