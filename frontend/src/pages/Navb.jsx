// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoPW from '../assets/img/logo/logoPW.png';
import { FaLock, FaSignOutAlt, FaEdit, FaBars } from 'react-icons/fa';
import '../home.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.id || 'ID non disponible';
  const userName = user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.email || 'Utilisateur';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleForgotPassword = () => {
    navigate(`/forgot-password?userId=${userId}`);
  };

  const handleUpdatePassword = () => {
    navigate(`/update-password?userId=${userId}`);
  };

  const handleOffersClick = () => {
    navigate('/home');
    setTimeout(() => {
      const offersSection = document.getElementById('offers');
      if (offersSection) {
        offersSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure page renders
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="container">
          <div className="nav-logo">
            <Link to="/home">
              <img
                src={logoPW}
                alt="LogoPW"
                className="logoPW"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
              />
            </Link>
            
          </div>
          <button className="navbar-toggler" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/home">Accueil</Link>
            <button className="nav-button" onClick={handleOffersClick}>
              Offres
            </button>
            {user.role === 'client' && <Link to="/clientreser">Mes Réservations</Link>}
            {user.role === 'admin' && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/domain-reservations">Gestion des Réservations</Link>
              </>
            )}
            <Link to="/about">À Propos</Link>
            <Link to="/contact">Contact</Link>
            {!user.email && <Link to="/login">Connexion</Link>}
          </div>
          {user.email && (
            <div className="navbar-profile">
              <div className="user-profile">
                <span className="user-name">{userName}</span>
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleForgotPassword}>
                    <FaLock /> Mot de passe oublié
                  </button>
                  <button className="dropdown-item" onClick={handleUpdatePassword}>
                    <FaEdit /> Modifier le mot de passe
                  </button>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;