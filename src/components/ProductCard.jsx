import axios from 'axios';
import { useCart } from '../context/CartContext'; // Import dello stato globale

const ProductCard = ({ product }) => {
  // Estraiamo la funzione per aggiornare il totale economico nella Navbar
  const { updateCartTotal } = useCart();

  const url = import.meta.env.VITE_APP_BASEURL + '/cart'

  /**
   * Logica per aggiungere un prodotto al carrello.
   * Verifica se l'articolo è già presente per decidere se fare una POST o una PATCH.
   */
  const addToCart = async () => {
    try {
      // 1. Recupera lo stato attuale del carrello dal backend json-server
      const res = await axios.get(url);
      const cartItems = res.data;

      // 2. Controlla se il prodotto (product.id) è già presente nel carrello (product_id)
      const existingItem = cartItems.find(item => item.product_id === product.id);

      if (existingItem) {
        // Se esiste, incrementa la quantità. 
        // Usiamo Number() perché nel db.json alcuni valori qty sono stringhe "13"
        const newQty = Number(existingItem.qty) + 1;
        
        await axios.patch(`${url}/${existingItem.id}`, {
          qty: newQty
        });
      } else {
        // Se non esiste, crea una nuova voce con i campi definiti nel db.json
        const newItem = {
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1
        };
        
        await axios.post(url, newItem);
      }

      // 3. Sincronizza il prezzo totale nella Navbar chiamando la funzione del Context
      updateCartTotal();
      alert(`${product.title} aggiunto al carrello!`);
      
    } catch (err) {
      console.error("Errore durante l'aggiunta al carrello:", err);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        {/* Immagine del prodotto recuperata dall'URL del database */}
        <div className="p-3 text-center" style={{ backgroundColor: '#f8f9fa' }}>
          <img 
            src={product.image} 
            className="card-img-top" 
            alt={product.title} 
            style={{ height: '180px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} 
          />
        </div>
        
        <div className="card-body d-flex flex-column">
          {/* Titolo del prodotto */}
          <h5 className="card-title h6 fw-bold text-truncate" title={product.title}>
            {product.title}
          </h5>
          
          {/* Descrizione fornita nel db.json */}
          <p className="card-text text-muted small flex-grow-1">
            {product.description.length > 90 
              ? product.description.substring(0, 85) + "..." 
              : product.description}
          </p>
          
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h5 mb-0 text-primary fw-bold">€ {product.price}</span>
              <span className="badge bg-light text-dark border">ID: {product.id}</span>
            </div>
            
            {/* Pulsante per attivare l'aggiunta al carrello */}
            <button 
              className="btn btn-primary w-100 fw-bold" 
              onClick={addToCart}
            >
              <i className="bi bi-plus-lg me-2"></i>Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;