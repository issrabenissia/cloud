// client/src/pages/ClientDomainReservations.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaUpload, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ClientDomainReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [domainOffers, setDomainOffers] = useState([]);
  const [hostingOffers, setHostingOffers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [error, setError] = useState(null);
  const [userId] = useState(JSON.parse(localStorage.getItem('user'))?.id || 1);
  const [userRole] = useState(JSON.parse(localStorage.getItem('user'))?.role || 'client');
  const [projectFiles, setProjectFiles] = useState({});
  const [showUploadForm, setShowUploadForm] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reservations/user/${userId}`);
        setReservations(response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des réservations.');
        console.error('Erreur fetchReservations:', error);
      }
    };
    fetchReservations();
  }, [userId]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const domainResponse = await axios.get('http://localhost:5000/api/offers?type=domain');
        setDomainOffers(domainResponse.data);
        const hostingResponse = await axios.get('http://localhost:5000/api/offers?type=hosting');
        setHostingOffers(hostingResponse.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des offres.');
        console.error('Erreur fetchOffers:', error);
      }
    };
    fetchOffers();
  }, []);

  const fetchProjectFiles = async (reservationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project-files/${reservationId}`);
      setProjectFiles((prev) => ({ ...prev, [reservationId]: response.data }));
    } catch (error) {
      setError('Erreur lors du chargement des fichiers.');
      console.error('Erreur fetchProjectFiles:', error);
    }
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    const formData = {
      userId,
      domainName: e.target.domainName.value,
      offerId: parseInt(e.target.offerId.value),
      hostingOfferId: e.target.hostingOfferId.value ? parseInt(e.target.hostingOfferId.value) : null,
      technologies: e.target.technologies.value,
      projectType: e.target.projectType.value,
      hostingNeeded: e.target.hostingNeeded.checked ? 1 : 0,
      additionalServices: e.target.additionalServices.value,
      preferredContactMethod: e.target.preferredContactMethod.value,
      projectDeadline: e.target.projectDeadline.value,
      budgetRange: e.target.budgetRange.value,
    };
    try {
      await axios.post('http://localhost:5000/api/reservations', formData);
      setShowAddForm(false);
      const response = await axios.get(`http://localhost:5000/api/reservations/user/${userId}`);
      setReservations(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout de la réservation.');
      console.error('Erreur handleAddReservation:', error);
    }
  };

  const handleEditReservation = async (e, reservationId) => {
    e.preventDefault();
    const formData = {
      domainName: e.target.domainName.value,
      offerId: parseInt(e.target.offerId.value),
      hostingOfferId: e.target.hostingOfferId.value ? parseInt(e.target.hostingOfferId.value) : null,
      technologies: e.target.technologies.value,
      projectType: e.target.projectType.value,
      hostingNeeded: e.target.hostingNeeded.checked ? 1 : 0,
      additionalServices: e.target.additionalServices.value,
      preferredContactMethod: e.target.preferredContactMethod.value,
      projectDeadline: e.target.projectDeadline.value,
      budgetRange: e.target.budgetRange.value,
    };
    try {
      await axios.put(`http://localhost:5000/api/reservations/${reservationId}`, formData);
      setShowEditForm(null);
      const response = await axios.get(`http://localhost:5000/api/reservations/user/${userId}`);
      setReservations(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification de la réservation.');
      console.error('Erreur handleEditReservation:', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm('Confirmer la suppression de cette réservation ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`);
        const response = await axios.get(`http://localhost:5000/api/reservations/user/${userId}`);
        setReservations(response.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression de la réservation.');
        console.error('Erreur handleDeleteReservation:', error);
      }
    }
  };

  const handleUploadFiles = async (e, reservationId) => {
    e.preventDefault();
    const files = e.target.files.files;
    if (!files || files.length === 0) {
      setError('Veuillez sélectionner au moins un fichier.');
      return;
    }
    const formData = new FormData();
    formData.append('reservationId', reservationId);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      await axios.post('http://localhost:5000/api/project-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowUploadForm(null);
      fetchProjectFiles(reservationId);
      const response = await axios.get(`http://localhost:5000/api/reservations/user/${userId}`);
      setReservations(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'upload des fichiers.');
      console.error('Erreur handleUploadFiles:', error);
    }
  };

  return (
    <div className="client-reservations-page">
      <header className="page-header">
        <h1>Mes Réservations</h1>
        <Link to="/home" className="back-btn">Retour à l'Accueil</Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="reservations-section">
        <h2>Vos Réservations</h2>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Nouvelle Réservation
        </button>
        <div className="reservation-list">
          {reservations.length > 0 ? (
            <div className="reservation-grid">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                  <h3>{reservation.domain_name}</h3>
                  <p><strong>Offre:</strong> {reservation.offer_name}</p>
                  <p><strong>Hébergement:</strong> {reservation.hosting_offer_name || 'N/A'}</p>
                  <p><strong>Technologies:</strong> {reservation.technologies}</p>
                  <p><strong>Type:</strong> {reservation.project_type}</p>
                  <p><strong>Statut:</strong> {reservation.status || 'pending'}</p>
                  <p>
                    <strong>URL:</strong>{' '}
                    {reservation.deployed_url ? (
                      <a href={reservation.deployed_url} target="_blank" rel="noopener noreferrer">
                        <FaEye /> Voir
                      </a>
                    ) : (
                      'Non déployé'
                    )}
                  </p>
                  {reservation.status === 'accepted' && (
                    <button
                      className="upload-btn"
                      onClick={() => {
                        setShowUploadForm(reservation.id);
                        fetchProjectFiles(reservation.id);
                      }}
                    >
                      <FaUpload /> Uploader Fichiers
                    </button>
                  )}
                  {userRole === 'client' && reservation.status === 'pending' && (
                    <div className="admin-actions">
                      <button
                        className="edit-btn"
                        onClick={() => setShowEditForm(reservation.id)}
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </div>
                  )}
                  {projectFiles[reservation.id]?.length > 0 && (
                    <div className="file-list">
                      <h4>Fichiers:</h4>
                      <ul>
                        {projectFiles[reservation.id].map((file) => (
                          <li key={file.id}>{file.file_name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune réservation trouvée.</p>
          )}
        </div>
      </section>

      {showAddForm && (
        <section className="form-section">
          <h2>Nouvelle Réservation</h2>
          <form onSubmit={handleAddReservation} className="reservation-form">
            <div className="form-group">
              <label>Nom de Domaine</label>
              <input type="text" name="domainName" required />
            </div>
            <div className="form-group">
              <label>Offre de Domaine</label>
              <select name="offerId" required>
                <option value="">Choisir</option>
                {domainOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€ pour {offer.duration_months} mois)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Offre d'Hébergement</label>
              <select name="hostingOfferId">
                <option value="">Aucune</option>
                {hostingOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€ pour {offer.duration_months} mois)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <input type="text" name="technologies" placeholder="HTML, CSS, React" required />
            </div>
            <div className="form-group">
              <label>Type de Projet</label>
              <select name="projectType" required>
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="business">Business</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label>Besoin d'Hébergement</label>
              <input type="checkbox" name="hostingNeeded" />
            </div>
            <div className="form-group">
              <label>Services Additionnels</label>
              <input type="text" name="additionalServices" placeholder="SEO, Maintenance" />
            </div>
            <div className="form-group">
              <label>Contact Préféré</label>
              <select name="preferredContactMethod">
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
                <option value="both">Les deux</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Limite</label>
              <input type="date" name="projectDeadline" />
            </div>
            <div className="form-group">
              <label>Budget</label>
              <select name="budgetRange">
                <option value="0-100">0-100€</option>
                <option value="100-500">100-500€</option>
                <option value="500-1000">500-1000€</option>
                <option value="1000+">1000€ et plus</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">Ajouter</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Annuler</button>
            </div>
          </form>
        </section>
      )}

      {showEditForm && (
        <section className="form-section">
          <h2>Modifier Réservation #{showEditForm}</h2>
          <form
            onSubmit={(e) => handleEditReservation(e, showEditForm)}
            className="reservation-form"
          >
            <div className="form-group">
              <label>Nom de Domaine</label>
              <input
                type="text"
                name="domainName"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.domain_name || ''}
                required
              />
            </div>
            <div className="form-group">
              <label>Offre de Domaine</label>
              <select
                name="offerId"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.offer_id || ''}
                required
              >
                <option value="">Choisir</option>
                {domainOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€ pour {offer.duration_months} mois)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Offre d'Hébergement</label>
              <select
                name="hostingOfferId"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.hosting_offer_id || ''}
              >
                <option value="">Aucune</option>
                {hostingOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€ pour {offer.duration_months} mois)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <input
                type="text"
                name="technologies"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.technologies || ''}
                required
              />
            </div>
            <div className="form-group">
              <label>Type de Projet</label>
              <select
                name="projectType"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.project_type || ''}
                required
              >
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="business">Business</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label>Besoin d'Hébergement</label>
              <input
                type="checkbox"
                name="hostingNeeded"
                defaultChecked={reservations.find((r) => r.id === showEditForm)?.hosting_needed || false}
              />
            </div>
            <div className="form-group">
              <label>Services Additionnels</label>
              <input
                type="text"
                name="additionalServices"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.additional_services || ''}
              />
            </div>
            <div className="form-group">
              <label>Contact Préféré</label>
              <select
                name="preferredContactMethod"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.preferred_contact_method || ''}
              >
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
                <option value="both">Les deux</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Limite</label>
              <input
                type="date"
                name="projectDeadline"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.project_deadline || ''}
              />
            </div>
            <div className="form-group">
              <label>Budget</label>
              <select
                name="budgetRange"
                defaultValue={reservations.find((r) => r.id === showEditForm)?.budget_range || ''}
              >
                <option value="0-100">0-100€</option>
                <option value="100-500">100-500€</option>
                <option value="500-1000">500-1000€</option>
                <option value="1000+">1000€ et plus</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">Modifier</button>
              <button type="button" onClick={() => setShowEditForm(null)}>Annuler</button>
            </div>
          </form>
        </section>
      )}

      {showUploadForm && (
        <section className="form-section">
          <h2>Uploader Fichiers (Réservation #{showUploadForm})</h2>
          <form onSubmit={(e) => handleUploadFiles(e, showUploadForm)} className="upload-form">
            <div className="form-group">
              <label>Fichiers</label>
              <input type="file" name="files" multiple required />
            </div>
            <div className="form-actions">
              <button type="submit">Uploader</button>
              <button type="button" onClick={() => setShowUploadForm(null)}>Annuler</button>
            </div>
          </form>
        </section>
      )}

      <style>
        {`
          .client-reservations-page {
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
          }

          .back-btn {
            background: #3498db;
            color: #fff;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            transition: background 0.3s;
          }

          .back-btn:hover {
            background: #2980b9;
          }

          .reservations-section {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .add-btn {
            background: #2ecc71;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            transition: background 0.3s;
          }

          .add-btn:hover {
            background: #27ae60;
          }

          .reservation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .reservation-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s;
          }

          .reservation-card:hover {
            transform: translateY(-5px);
          }

          .reservation-card h3 {
            font-size: 1.5rem;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .reservation-card p {
            margin: 5px 0;
            color: #555;
          }

          .upload-btn, .edit-btn, .delete-btn {
            background: #3498db;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            transition: background 0.3s;
          }

          .upload-btn:hover, .edit-btn:hover {
            background: #2980b9;
          }

          .admin-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          .edit-btn {
            background: #f1c40f;
          }

          .delete-btn {
            background: #e74c3c;
          }

          .delete-btn:hover {
            background: #c0392b;
          }

          .file-list {
            margin-top: 15px;
          }

          .file-list ul {
            list-style: none;
            padding: 0;
          }

          .file-list li {
            padding: 5px 0;
            color: #555;
          }

          .form-section {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .reservation-form, .upload-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
          }

          .form-group input, .form-group select {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
          }

          .form-actions {
            grid-column: span 2;
            display: flex;
            gap: 10px;
          }

          .form-actions button {
            background: #3498db;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: background 0.3s;
          }

          .form-actions button:hover {
            background: #2980b9;
          }

          .form-actions button:last-child {
            background: #e74c3c;
          }

          .form-actions button:last-child:hover {
            background: #c0392b;
          }

          .error-message {
            background: #ffebee;
            color: #e74c3c;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default ClientDomainReservations;