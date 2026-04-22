import React, { createContext, useState, useContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      } else {
        newItems = [...prevItems, item];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    saveCart(newItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
