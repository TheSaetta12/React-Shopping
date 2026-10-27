import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Import per aggiornare il totale nella Navbar

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartTotal } = useCart();
  const url = import.meta.env.VITE_APP_BASEURL + '/cart'

  // 1. Recupero degli elementi dal carrello tramite l'API specifica
  const fetchCart = () => {
    axios.get(url)
      .then(res => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore recupero carrello:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Modifica della quantità tramite API PATCH
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    axios.patch(`${url}/${id}`, { qty: newQty })
      .then(() => {
        fetchCart();
        updateCartTotal(); // Aggiorna il prezzo nella Navbar
      })
      .catch(err => console.error(err));
  };

  // 3. Eliminazione di un prodotto tramite API DELETE
  const removeItem = (id) => {
    if (window.confirm("Rimuovere l'articolo?")) {
      axios.delete(`${url}/${id}`)
        .then(() => {
          fetchCart();
          updateCartTotal(); // Aggiorna il prezzo nella Navbar
        })
        .catch(err => console.error(err));
    }
  };

  // --- LOGICA DI CALCOLO ---
  
  // Calcolo della quantità totale di articoli
  const totalQuantity = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  // Calcolo del subtotale prodotti
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * Number(item.qty)), 0);

  // Spedizione: Gratis sopra gli 80€, altrimenti 9.90€
  const shippingCost = subtotal > 80 || subtotal === 0 ? 0 : 9.90;

  // Totale Finale
  const grandTotal = (subtotal + shippingCost).toFixed(2);

  if (loading) return <div className="text-center my-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Il tuo Carrello</h2>
      
      {cartItems.length === 0 ? (
        <div className="alert alert-info">Il carrello è vuoto.</div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="table-responsive shadow-sm">
              <table className="table align-middle bg-white">
                <thead className="table-light">
                  <tr>
                    <th>Prodotto</th>
                    <th>Prezzo</th>
                    <th>Quantità</th>
                    <th>Subtotale</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="me-3" />
                          <span className="small fw-bold text-truncate" style={{ maxWidth: '180px' }}>{item.title}</span>
                        </div>
                      </td>
                      <td>€ {item.price}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                          <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, Number(item.qty) - 1)}>-</button>
                          <input type="text" className="form-control text-center bg-white" value={item.qty} readOnly />
                          <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, Number(item.qty) + 1)}>+</button>
                        </div>
                      </td>
                      <td className="fw-bold">€ {(item.price * Number(item.qty)).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>Elimina</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* RIEPILOGO ORDINE CON LOGICA SPEDIZIONE */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold">Riepilogo Ordine</h5>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Quantità:</span>
                  <span className="fw-bold">{totalQuantity} articoli</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Subtotale:</span>
                  <span className="fw-bold">€ {subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Spedizione:</span>
                  <span className={shippingCost === 0 ? "text-success fw-bold" : "fw-bold"}>
                    {shippingCost === 0 ? "Gratis" : `€ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {/* Feedback per la spedizione gratuita */}
                {subtotal <= 80 && subtotal > 0 && (
                  <div className="alert alert-warning py-2 small">
                    Aggiungi ancora <strong>€ {(80 - subtotal).toFixed(2)}</strong> per la spedizione <strong>GRATIS</strong>!
                  </div>
                )}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="h4 mb-0">TOTALE:</span>
                  <span className="h4 mb-0 fw-bold text-primary">€ {grandTotal}</span>
                </div>
                
                <button className="btn btn-primary w-100 py-3 fw-bold">Procedi al Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;