import React, { useState, useCallback } from "react";
import api from "../services/axios";
import { CartContext } from "./cartContext";

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0); 

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem("token"); 
    if (!token) return;
    try {
      const res = await api.get("/users/getCart"); 
      if (res.data?.success) {
        setCartCount(res.data.products?.length || 0); 
      }
    } catch (err) { console.error(err); }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};