import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = import.meta.env.VITE_APP_BASEURL + '/products'
  
  // params conterrà il valore scritto nella barra degli indirizzi (es. "uomo")
  const params = useParams();
  const categoryName = params.category;

  useEffect(() => {
    setLoading(true);
    axios.get(url)
      .then(res => {
        /* 
           Mappatura tra nome categoria (URL) e ID nel db.json:
           Uomo -> 1, Donna -> 2, Bambino -> 3
        */
        const categoryMap = {
          'uomo': 1,
          'donna': 2,
          'bambino': 3
        };

        const targetId = categoryMap[categoryName.toLowerCase()];
        const filtered = res.data.filter(p => p.category_id === targetId);
        
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore:", err);
        setLoading(false);
      });
  }, [categoryName]); // Si riattiva ogni volta che cambia la categoria nell'URL

  return (
    <div className="container my-5">
      <h1 className="text-capitalize mb-4">Collezione {categoryName}</h1>
      
      {loading ? (
        <div className="text-center"><div className="spinner-border"></div></div>
      ) : (
        <div className="row">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;