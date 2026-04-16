import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'client2_cart';

const readCart = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: Math.min(item.qty + quantity, stock)
              }
            : item
        );
      }

      return [
        ...current,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock,
          qty: Math.max(1, Math.min(quantity, stock))
        }
      ];
    });
  };

  const updateQty = (productId, quantity) => {
    setCart((current) =>
      current.map((item) =>
        item._id === productId
          ? {
              ...item,
              qty: Math.max(
                1,
                Math.min(quantity, Number(item.stock || 0) > 0 ? item.stock : item.qty)
              )
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
