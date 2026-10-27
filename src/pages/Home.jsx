import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook per gestire la ricerca basata sulla parola chiave del titolo
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || "";

  const url = import.meta.env.VITE_APP_BASEURL + '/products'

  useEffect(() => {
    // Recupero della lista completa dei prodotti dal backend
    axios.get(url)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore nel caricamento prodotti:", err);
        setLoading(false);
      });
  }, []);

  // Logica di filtraggio per la barra di ricerca
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="container my-5">
      {/* Intestazione con info sulle categorie e sulla spedizione */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Il Nostro Catalogo</h1>
        <p className="lead text-muted mb-2">
          Esplora i prodotti delle categorie Uomo, Donna e Bambino.
        </p>
        
        {/* Specifica sulla spedizione richiesta */}
        <div className="d-flex justify-content-center">
          <div className="alert alert-warning d-inline-block py-2 px-4 shadow-sm border-0 rounded-pill">
            <i className="bi bi-truck me-2"></i>
            La <strong>spedizione è gratuita sopra gli 80 euro</strong>, altrimenti si applica il costo della spedizione.
          </div>
        </div>
      </div>

      {/* Visualizzazione dei risultati della ricerca */}
      {searchQuery && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
          <span>Stai cercando: <strong>"{searchQuery}"</strong></span>
          <button 
            className="btn btn-sm btn-outline-info" 
            onClick={() => window.location.href = '/'}
          >
            Cancella ricerca
          </button>
        </div>
      )}

      {/* Griglia dei prodotti */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">Nessun prodotto corrisponde ai criteri di ricerca.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;