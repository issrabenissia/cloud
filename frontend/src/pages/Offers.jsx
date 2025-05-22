// client/src/pages/Offers.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer toutes les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/offers');
        setOffers(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error.response ? error.response.data : error.message);
        setError('Erreur lors du chargement des offres.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Ajouter une offre
  const handleAddOffer = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      duration_months: parseInt(e.target.duration_months.value),
      price: parseFloat(e.target.price.value),
      description: e.target.description.value,
      features: e.target.features.value,
      domain_type: e.target.domain_type.value || null,
      offer_type: e.target.offer_type.value,
      storage_space: e.target.storage_space.value ? parseInt(e.target.storage_space.value) : null,
      bandwidth: e.target.bandwidth.value ? parseInt(e.target.bandwidth.value) : null,
    };

    // Validation côté client
    if (formData.price <= 0 || formData.duration_months <= 0) {
      setError('Le prix et la durée doivent être supérieurs à 0.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/offers', formData);
      setOffers([...offers, response.data]);
      setShowAddForm(false);
      setSuccess('Offre ajoutée avec succès !');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'offre:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'offre.');
    }
  };

  // Modifier une offre
  const handleEditOffer = async (e) => {
    e.preventDefault();
    if (!selectedOffer || !selectedOffer.id) {
      setError('Aucune offre sélectionnée pour la modification.');
      return;
    }
    const formData = {
      name: e.target.name.value,
      duration_months: parseInt(e.target.duration_months.value),
      price: parseFloat(e.target.price.value),
      description: e.target.description.value,
      features: e.target.features.value,
      domain_type: e.target.domain_type.value || null,
      offer_type: e.target.offer_type.value,
      storage_space: e.target.storage_space.value ? parseInt(e.target.storage_space.value) : null,
      bandwidth: e.target.bandwidth.value ? parseInt(e.target.bandwidth.value) : null,
    };

    // Validation côté client
    if (formData.price <= 0 || formData.duration_months <= 0) {
      setError('Le prix et la durée doivent être supérieurs à 0.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/offers/${selectedOffer.id}`, formData);
      setOffers(offers.map((offer) => (offer.id === selectedOffer.id ? { ...offer, ...formData } : offer)));
      setShowEditForm(false);
      setSelectedOffer(null);
      setSuccess('Offre modifiée avec succès !');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'offre:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Erreur lors de la modification de l\'offre.');
    }
  };

  // Supprimer une offre
  const handleDeleteOffer = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/offers/${id}`);
        setOffers(offers.filter((offer) => offer.id !== id));
        setSuccess('Offre supprimée avec succès !');
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la suppression de l\'offre.');
      }
    }
  };

  return (
    <div className="offers-page">
      <header className="page-header">
        <h1>Gestion des Offres</h1>
        <Link to="/dashboard" className="back-to-dashboard">
          Retour au Dashboard
        </Link>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="offers-section">
        <div className="section-header">
          <h2>Liste des Offres</h2>
          <button className="add-offer-btn" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Ajouter une offre
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" /> Chargement...
          </div>
        ) : offers.length > 0 ? (
          <div className="offer-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-header">
                  <h3>{offer.name}</h3>
                  <span className={`offer-type ${offer.offer_type}`}>
                    {offer.offer_type === 'domain' ? 'Domaine' : 'Hébergement'}
                  </span>
                </div>
                <div className="offer-details">
                  <p><strong>Durée :</strong> {offer.duration_months} mois</p>
                  <p><strong>Prix :</strong> {offer.price}€</p>
                  <p><strong>Description :</strong> {offer.description || 'N/A'}</p>
                  <p><strong>Fonctionnalités :</strong> {offer.features || 'N/A'}</p>
                  {offer.offer_type === 'domain' && (
                    <p><strong>Type de Domaine :</strong> {offer.domain_type || 'N/A'}</p>
                  )}
                  {offer.offer_type === 'hosting' && (
                    <>
                      <p><strong>Espace de Stockage :</strong> {offer.storage_space || 'N/A'} Go</p>
                      <p><strong>Bande Passante :</strong> {offer.bandwidth || 'N/A'} Go</p>
                    </>
                  )}
                </div>
                <div className="offer-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedOffer(offer);
                      setShowEditForm(true);
                    }}
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteOffer(offer.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-offers">Aucune offre trouvée.</p>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="form-modal">
          <div className="form-container">
            <h2>Ajouter une offre</h2>
            <form onSubmit={handleAddOffer}>
              <div className="form-group">
                <label>Nom :</label>
                <input type="text" name="name" required placeholder="Nom de l'offre" />
              </div>
              <div className="form-group">
                <label>Type d'Offre :</label>
                <select name="offer_type" required>
                  <option value="domain">Domaine</option>
                  <option value="hosting">Hébergement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durée (mois) :</label>
                <input type="number" name="duration_months" required min="1" placeholder="Durée en mois" />
              </div>
              <div className="form-group">
                <label>Prix (€) :</label>
                <input type="number" step="0.01" name="price" required min="0.01" placeholder="Prix en €" />
              </div>
              <div className="form-group">
                <label>Description :</label>
                <textarea name="description" placeholder="Description de l'offre"></textarea>
              </div>
              <div className="form-group">
                <label>Fonctionnalités (séparées par des virgules) :</label>
                <input type="text" name="features" placeholder="SSL gratuit, Support 24/7" />
              </div>
              <div className="form-group">
                <label>Type de Domaine (pour les offres de domaine) :</label>
                <select name="domain_type">
                  <option value="">Aucun</option>
                  <option value="com">.com</option>
                  <option value="org">.org</option>
                  <option value="net">.net</option>
                  <option value="fr">.fr</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Espace de Stockage (Go, pour les offres d'hébergement) :</label>
                <input type="number" name="storage_space" min="0" placeholder="Espace en Go" />
              </div>
              <div className="form-group">
                <label>Bande Passante (Go, pour les offres d'hébergement) :</label>
                <input type="number" name="bandwidth" min="0" placeholder="Bande passante en Go" />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Ajouter</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire de modification */}
      {showEditForm && selectedOffer && (
        <div className="form-modal">
          <div className="form-container">
            <h2>Modifier l'offre</h2>
            <form onSubmit={handleEditOffer}>
              <div className="form-group">
                <label>Nom :</label>
                <input type="text" name="name" defaultValue={selectedOffer.name} required placeholder="Nom de l'offre" />
              </div>
              <div className="form-group">
                <label>Type d'Offre :</label>
                <select name="offer_type" defaultValue={selectedOffer.offer_type} required>
                  <option value="domain">Domaine</option>
                  <option value="hosting">Hébergement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durée (mois) :</label>
                <input type="number" name="duration_months" defaultValue={selectedOffer.duration_months} required min="1" />
              </div>
              <div className="form-group">
                <label>Prix (€) :</label>
                <input type="number" step="0.01" name="price" defaultValue={selectedOffer.price} required min="0.01" />
              </div>
              <div className="form-group">
                <label>Description :</label>
                <textarea name="description" defaultValue={selectedOffer.description}></textarea>
              </div>
              <div className="form-group">
                <label>Fonctionnalités (séparées par des virgules) :</label>
                <input type="text" name="features" defaultValue={selectedOffer.features} placeholder="SSL gratuit, Support 24/7" />
              </div>
              <div className="form-group">
                <label>Type de Domaine (pour les offres de domaine) :</label>
                <select name="domain_type" defaultValue={selectedOffer.domain_type}>
                  <option value="">Aucun</option>
                  <option value="com">.com</option>
                  <option value="org">.org</option>
                  <option value="net">.net</option>
                  <option value="fr">.fr</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Espace de Stockage (Go, pour les offres d'hébergement) :</label>
                <input type="number" name="storage_space" defaultValue={selectedOffer.storage_space} min="0" />
              </div>
              <div className="form-group">
                <label>Bande Passante (Go, pour les offres d'hébergement) :</label>
                <input type="number" name="bandwidth" defaultValue={selectedOffer.bandwidth} min="0" />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Modifier</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          .offers-page {
            padding: 40px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .page-header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin: 0;
          }

          .back-to-dashboard {
            background: #3498db;
            color: #fff;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            transition: background 0.3s ease;
          }

          .back-to-dashboard:hover {
            background: #2980b9;
          }

          .offers-section {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .section-header h2 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin: 0;
          }

          .add-offer-btn {
            background: #2ecc71;
            color: #fff;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1rem;
            transition: background 0.3s ease, transform 0.2s ease;
          }

          .add-offer-btn:hover {
            background: #27ae60;
            transform: translateY(-2px);
          }

          .offer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }

          .offer-card {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 20px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .offer-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .offer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .offer-header h3 {
            margin: 0;
            font-size: 1.4rem;
            color: #2c3e50;
          }

          .offer-type {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
            color: #fff;
          }

          .offer-type.domain {
            background: #3498db;
          }

          .offer-type.hosting {
            background: #e67e22;
          }

          .offer-details p {
            margin: 8px 0;
            color: #555;
            font-size: 0.95rem;
          }

          .offer-details strong {
            color: #2c3e50;
          }

          .offer-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }

          .edit-btn, .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.3s ease, transform 0.2s ease;
          }

          .edit-btn {
            color: #f1c40f;
          }

          .edit-btn:hover {
            background: #f1c40f33;
            transform: scale(1.1);
          }

          .delete-btn {
            color: #e74c3c;
          }

          .delete-btn:hover {
            background: #e74c3c33;
            transform: scale(1.1);
          }

          .no-offers {
            text-align: center;
            color: #888;
            font-size: 1.1rem;
            margin-top: 20px;
          }

          .loading-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #3498db;
            font-size: 1.2rem;
            margin: 20px 0;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .form-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
          }

          .form-container {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            width: 100%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
          }

          .form-container h2 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            font-size: 0.95rem;
            color: #2c3e50;
            margin-bottom: 8px;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            border-color: #3498db;
            outline: none;
          }

          .form-group textarea {
            height: 100px;
            resize: vertical;
          }

          .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }

          .submit-btn, .cancel-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease, transform 0.2s ease;
          }

          .submit-btn {
            background: #3498db;
            color: #fff;
          }

          .submit-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
          }

          .cancel-btn {
            background: #e74c3c;
            color: #fff;
          }

          .cancel-btn:hover {
            background: #c0392b;
            transform: translateY(-2px);
          }

          .error-message {
            background: #ffebee;
            color: #e74c3c;
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.95rem;
          }

          .success-message {
            background: #e7f3e7;
            color: #2ecc71;
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.95rem;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Offers;