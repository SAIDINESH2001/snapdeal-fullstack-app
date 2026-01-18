import { useState, useEffect, useCallback } from "react";
import api from "../services/axios";
import { useCartContext } from "../contexts/cartContext";

export const useCart = (show) => {
  const { fetchCartCount } = useCartContext();
  const [cartProducts, setCartProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCartProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/getCart");
      if (res.data?.success) {
        const products = res.data.products || [];
        setCartProducts(products);
        
        const initialQuantities = {};
        products.forEach(item => {
          initialQuantities[item._id] = 1; 
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (show) fetchCartProducts();
  }, [show, fetchCartProducts]);

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

  return { cartProducts, quantities, loading, subTotal, handleQuantityChange, handleRemove };
};