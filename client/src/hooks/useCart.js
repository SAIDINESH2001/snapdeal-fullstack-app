import { useState, useEffect, useCallback } from "react";
import api from "../services/axios";
import { useCartContext } from "../contexts/cartContext";

export const useCart = (show) => {
  const { fetchCartCount, setCartCount } = useCartContext(); 
  const [cartProducts, setCartProducts] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]); 
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCheckoutData = useCallback(async () => {
    if (!show) return; 

    try {
      setLoading(true);
      
      const [cartRes, profileRes] = await Promise.allSettled([
        api.get("/users/getCart"),
        api.get("/users/profile") 
      ]);

      if (cartRes.status === "fulfilled" && cartRes.value.data?.success) {
        const products = cartRes.value.data.products || [];
        setCartProducts(products);
        setCartCount(products.length); 
        
        const initialQuantities = {};
        products.forEach(item => {
          initialQuantities[item._id] = 1; 
        });
        setQuantities(initialQuantities);
      }

      if (profileRes.status === "fulfilled" && profileRes.value.data?.success) {
        setSavedAddresses(profileRes.value.data.user.address || []); 
      }

    } catch (error) {
      console.error("Checkout fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [show, setCartCount]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const handleRemove = async (productId) => {
    try {
      const res = await api.delete(`/users/removeFromCart/${productId}`);
      if (res.data.success) {
        setCartProducts(prev => prev.filter(p => p._id !== productId));
        fetchCartCount(); 
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({ ...prev, [productId]: parseInt(newQuantity, 10) }));
  };

  const subTotal = cartProducts.reduce((acc, item) => {
    const qty = quantities[item._id] || 1;
    return acc + (item.sellingPrice * qty);
  }, 0);

  return { 
    cartProducts, 
    savedAddresses, 
    quantities, 
    loading, 
    subTotal, 
    handleQuantityChange, 
    handleRemove 
  };
};