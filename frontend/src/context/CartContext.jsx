import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart logic
  const addToCart = (product, quantity, finish) => {
    setCartItems((prevItems) => {
      // Check if the exact product AND finish is already in the cart
      const existingItem = prevItems.find(
        (item) => item.name === product.name && item.finish === finish
      );

      if (existingItem) {
        // If it exists, just update the quantity
        return prevItems.map((item) =>
          item.name === product.name && item.finish === finish
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If it's new, add it to the array
        return [...prevItems, { ...product, quantity, finish }];
      }
    });
  };

  // Update quantity in the cart page
  const updateQuantity = (productName, finish, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.name === productName && item.finish === finish) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  // Remove from cart
  const removeFromCart = (productName, finish) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.name === productName && item.finish === finish)
      )
    );
  };

  // Calculate totals
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};