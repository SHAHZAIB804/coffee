import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const normalizeCartItem = (item) => ({
  ...item,
  id: item.id,
  name: item.name ?? item.title ?? "Coffee Item",
  price: Number(item.price) || 0,
  image: item.image || item.img || "",
  quantity: Number(item.quantity) || 1,
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity = 1) => {
    const normalizedItem = normalizeCartItem(item);

    setCart((prev) => {
      const existing = prev.find((p) => p.id === normalizedItem.id);
      if (existing) {
        return prev.map((p) =>
          p.id === normalizedItem.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }

      return [...prev, { ...normalizedItem, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, nextQuantity) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        if (nextQuantity <= 0) return [];
        return [{ ...item, quantity: nextQuantity }];
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
