import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Changé de ../pages/Navb à ../components/Navbar
import logoPW from '../assets/img/logo/logoPW.png';
import heroImg from '../assets/img/hero/hero-5/hero-img.svg';
import aboutImg from '../assets/img/about/about-4/about-img.svg';
import '../styles.css'; // Changé de home.css à styles.css

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/offers');
        if (Array.isArray(response.data)) {
          setOffers(response.data);
          setError(null);
        } else {
          throw new Error('Les données des offres ne sont pas un tableau.');
        }
      } catch (err) {
        setError('Impossible de charger les offres. Veuillez réessayer plus tard.');
        console.error('Erreur lors de la récupération des offres:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();

    const scrollTop = document.querySelector('.scroll-top');
    const handleScroll = () => {
      if (scrollTop) {
        scrollTop.classList.toggle('hidden', window.scrollY < 200);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStorageDisplay = (offer) => {
    if (offer.offer_type === 'domain') {
      return `Domaine: .${offer.domain_type || 'tous'}`;
    }
    return `${offer.storage_space || 'Illimité'} Go de stockage`;
  };

  return (
    <>
      {isLoading && (
        <div className="preloader">
          <div className="spinner"></div>
        </div>
      )}

      <section id="home" className="hero">
        <Navbar />
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="animate-fade-in-up">Gérez Votre Site Facilement</h1>
            <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Réservez un domaine, hébergez votre site et téléchargez vos fichiers en quelques clics. Construisez votre présence en ligne avec nos solutions DNS et d'hébergement.
            </p>
            <Link to="/clientreser" className="btn btn-primary animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Mes Réservations <i className="lni lni-chevron-right"></i>
            </Link>
          </div>
          <div className="hero-image animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <img src={heroImg} alt="Hero" onError={(e) => (e.target.src = 'https://via.placeholder.com/500')} />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-title animate-fade-in-up">
            <h2>Nos Spécialités</h2>
            <p>Nous offrons des services de premier ordre pour garantir que votre site soit rapide, sécurisé et fiable.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: 'lni-vector', title: 'Enregistrement de Domaine', desc: 'Sécurisez votre nom de domaine idéal avec notre processus simple.' },
              { icon: 'lni-cloud', title: 'Hébergement Web', desc: 'Hébergement fiable avec bande passante illimitée et support 24/7.' },
              { icon: 'lni-shield', title: 'Sécurité SSL', desc: 'Protégez votre site avec des certificats SSL gratuits.' },
            ].map((feature, index) => (
              <div key={index} className="feature-card glassmorphic animate-fade-in-up" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <div className="feature-icon">
                  <i className={`lni ${feature.icon}`}></i>
                  <svg className="icon-bg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.2)" />
                  </svg>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="offers">
        <div className="container">
          <div className="section-title animate-fade-in-up">
            <h2>Nos Offres</h2>
            <p>Choisissez le plan parfait pour vos besoins, de l'enregistrement de domaine à l'hébergement géré.</p>
          </div>
          {error && <div className="error-message animate-fade-in-up">{error}</div>}
          <div className="offers-grid">
            {offers.length > 0 ? (
              offers.map((offer, index) => (
                <div key={offer.id} className="offer-card glassmorphic tilt-card animate-fade-in-up" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                  <h3>{offer.name}</h3>
                  <p>{offer.description || 'Adapté à vos besoins.'}</p>
                  <div className="price">€{offer.price}</div>
                  <ul>
                    <li>
                      <i className="lni lni-checkmark-circle"></i>
                      {getStorageDisplay(offer)}
                    </li>
                    <li>
                      <i className="lni lni-checkmark-circle"></i>
                      {offer.bandwidth ? `${offer.bandwidth} Go de bande passante` : 'Bande passante illimitée'}
                    </li>
                    <li>
                      <i className="lni lni-checkmark-circle"></i>
                      {offer.features || 'SSL gratuit, Support 24/7'}
                    </li>
                  </ul>
                  <Link to="/clientreser" className="btn btn-secondary">Commencer</Link>
                </div>
              ))
            ) : (
              <p className="no-offers">Aucune offre disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text animate-fade-in-up">
              <h2>L'Avenir de la Gestion Web</h2>
              <p>Nous simplifions l'enregistrement de domaine, l'hébergement et la gestion de site web pour que vous puissiez vous concentrer sur le développement de votre entreprise.</p>
              <ul>
                <li><i className="lni lni-checkmark-circle"></i> Hébergement rapide et fiable avec 99,9 % de disponibilité.</li>
                <li><i className="lni lni-checkmark-circle"></i> Sécurisez votre domaine avec des certificats SSL gratuits.</li>
                <li><i className="lni lni-checkmark-circle"></i> Support expert 24/7 pour tous vos besoins.</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">En Savoir Plus</Link>
            </div>
            <div className="about-image animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <img src={aboutImg} alt="About" onError={(e) => (e.target.src = 'https://via.placeholder.com/500')} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="section-title animate-fade-in-up">
            <h2>Contactez-Nous</h2>
            <p>Des questions ? Nous sommes là pour vous aider. Contactez notre équipe d'assistance.</p>
          </div>
          <div className="contact-content">
            <form action="assets/php/contact.php" method="POST" className="contact-form glassmorphic animate-fade-in-up">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom</label>
                  <div className="input-wrapper">
                    <input type="text" name="name" placeholder="Votre Nom" required />
                    <i className="lni lni-user"></i>
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-wrapper">
                    <input type="email" name="email" placeholder="Votre Email" required />
                    <i className="lni lni-envelope"></i>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Votre Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                <i className="lni lni-telegram-original"></i> Envoyer
              </button>
            </form>
            <div className="contact-info animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="info-card glassmorphic">
                <i className="lni lni-phone"></i>
                <p> +216 22 355 779
              <br />+216 50 607 645</p>
              </div>
              <div className="info-card glassmorphic">
                <i className="lni lni-envelope"></i>
                <p>issrabenissia@gmail.com
                  <br />yassminebenslimene03@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section animate-fade-in-up">
              <div className="footer-logoPW">
                <img
                  src={logoPW}
                  alt="LogoPW"
                  className="logoPW"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                />
              </div>
              <p>Services DNS et d'hébergement fiables pour renforcer votre présence en ligne.</p>
            </div>
            <div className="footer-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3>Liens Rapides</h3>
              <ul>
                <li><Link to="/home">Accueil</Link></li>
                <li><Link to="/offers">Offres</Link></li>
                <li><Link to="/about">À Propos</Link></li>
                <li><Link to="/contact">Contactez-Nous</Link></li>
              </ul>
            </div>
            <div className="footer-section animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3>Coordonnées</h3>
              <p> Web Lane, Internet City<br />issrabenissia@gmail.com<br />+216 22 355 779
              <br />yassminebenslimene03@gmail.com<br />+216 50 607 645</p>
            </div>
          </div>
          <div className="footer-bottom animate-fade-in-up">
            <p>© 2025 Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <a href="#" className="scroll-top hidden">
        <i className="lni lni-chevron-up"></i>
      </a>
    </>
  );
};

export default Home;