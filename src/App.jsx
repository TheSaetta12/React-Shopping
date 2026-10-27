import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Provider per il contatore globale
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';

// Importazione di Bootstrap per lo stile UI
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    /* Il CartProvider avvolge tutta l'app per gestire il carrello ovunque */
    <CartProvider>
      <Router>
        {/* La Navbar rimane sempre visibile in alto */}
        <Navbar />
        
        {/* Contenitore principale per le varie pagine */}
        <main className="container mt-4">
          <Routes>
            {/* Pagina Home: mostra tutti i prodotti o i risultati della ricerca */}
            <Route path="/" element={<Home />} />
            
            {/* Pagina Prodotto: rotta dinamica per le categorie */}
            <Route path="/products/:category" element={ <ProductsPage /> } />
            
            {/* Pagina Carrello: per visualizzare, eliminare o modificare le quantità */}
            <Route path="/cart" element={<CartPage />} />
            
            {/* Pagina di errore per percorsi non validi */}
            <Route path="*" element={<div className="text-center mt-5"><h1>404 - Pagina non trovata</h1></div>} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;