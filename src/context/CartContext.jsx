import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cambiamo lo stato da cartCount a cartTotal
  const [cartTotal, setCartTotal] = useState(0);

  const url = import.meta.env.VITE_APP_BASEURL + '/cart'

  const updateCartTotal = () => {
    axios.get(url)
      .then(res => {
        // Calcoliamo il prezzo totale parziale (prezzo * quantità)
        // Usiamo Number(item.qty) perché nel db.json a volte è una string
        const total = res.data.reduce((acc, item) => {
          return acc + (item.price * Number(item.qty));
        }, 0);
        setCartTotal(total.toFixed(2)); // Arrotondiamo a due decimali
      })
      .catch(err => console.error("Errore calcolo totale carrello:", err));
  };

  useEffect(() => {
    updateCartTotal();
  }, []);

  return (
    <CartContext.Provider value={{ cartTotal, updateCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);