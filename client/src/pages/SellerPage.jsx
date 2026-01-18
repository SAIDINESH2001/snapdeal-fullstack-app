import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { useAuth } from "../hooks/useAuth";
import { SellerDashboard } from "../components/SellerPage/SellerDashBoard";
import { useState, useEffect, useCallback } from "react";
import api from "../services/axios";


export const SellerPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sellerProducts, setSellerProducts] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get(`/seller/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSellerProducts(res.data.products || res.data.data || []);
    } catch (err) {
      console.error("Error Fetching Product:", err);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return null; 
  if (!user) return null; 

  return (
    <>
      {user?.role === 'seller' && (
        <> 
          <AppNav user={user} />
          <SellerDashboard sellerProducts={sellerProducts}/>
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