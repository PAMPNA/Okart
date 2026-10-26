
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add a new item or increase the quantity of an existing item.
  const addToCart = (item: CartItem) => {
    if (
      !item.id ||
      !item.name ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0
    ) {
      console.error("Invalid cart item:", item);
      return;
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [...previousCart, { ...item }];
    });
  };

  // Increase an item's quantity by one.
  const increaseQuantity = (id: string) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease an item's quantity and remove it when it reaches zero.
  const decreaseQuantity = (id: string) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove an item completely.
  const removeFromCart = (id: string) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  // Empty the cart after a successful order, if needed.
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
