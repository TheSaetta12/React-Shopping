import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { cartTotal } = useCart(); // Recuperiamo il totale parziale invece del numero
  const navigate = useNavigate();

  const url = import.meta.env.VITE_APP_BASEURL + '/categories'

  useEffect(() => {
    axios.get(url)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Errore categorie:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`); // Ricerca per parola chiave nel titolo
      setSearchTerm("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">React-Shopping</NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Menu categorie a sinistra */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            {categories.map(cat => (
              <li className="nav-item" key={cat.id}>
                <NavLink className="nav-link text-capitalize" to={`/products/${cat.name.toLowerCase()}`}>
                  {cat.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Sezione destra: Carrello + Ricerca */}
          <div className="d-flex align-items-center">
            {/* Link Carrello con testo a sinistra e importo a destra */}
            <NavLink
              className="btn btn-outline-info d-flex justify-content-between align-items-center me-3"
              to="/cart"
              style={{ minWidth: '160px' }}
            >
              <span>Carrello</span>
              <span className="fw-bold">€ {cartTotal}</span>
            </NavLink>

            {/* Form di ricerca per parola chiave nel titolo [1] */}
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Cerca</button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;