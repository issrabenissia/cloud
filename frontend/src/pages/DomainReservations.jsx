// client/src/pages/AdminDomainReservations.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';

Modal.setAppElement('#root');

const AdminDomainReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [domainOffers, setDomainOffers] = useState([]);
  const [hostingOffers, setHostingOffers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectFiles, setProjectFiles] = useState({});
  const reservationsPerPage = 6;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await axios.get('http://localhost:5000/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError(error.response?.data?.error || 'Erreur lors du chargement des réservations.');
          toast.error('Erreur lors du chargement des réservations.');
        }
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const domainResponse = await axios.get('http://localhost:5000/api/offers?type=domain', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDomainOffers(domainResponse.data);
        const hostingResponse = await axios.get('http://localhost:5000/api/offers?type=hosting', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostingOffers(hostingResponse.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.error || 'Erreur lors du chargement des offres.');
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    reservations.forEach((reservation) => {
      if (reservation.status === 'accepted' && !projectFiles[reservation.id]) {
        fetchProjectFiles(reservation.id);
      }
    });
  }, [reservations, projectFiles]);

  const fetchProjectFiles = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/project-files/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectFiles((prev) => ({ ...prev, [reservationId]: response.data }));
    } catch (error) {
      console.error('Erreur fetchProjectFiles:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
  console.log(`Updating status for reservation ${id} to ${status}`);
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/reservations/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const response = await axios.get('http://localhost:5000/api/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservations(response.data);
    setError(null);
    toast.success(`Réservation ${status === 'accepted' ? 'acceptée et SMS envoyé' : 'refusée'} avec succès !`);
  } catch (error) {
    setError(error.response?.data?.error || 'Erreur lors de la mise à jour du statut.');
    toast.error('Erreur lors de la mise à jour du statut.');
  }
};
  const handlePaymentStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Aucun token trouvé. Veuillez vous reconnecter.');
        window.location.href = '/login';
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/api/reservations/${id}/payment`,
        { payment_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reservationsResponse = await axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(reservationsResponse.data);
      setError(null);
      toast.success('Statut de paiement mis à jour !');
      if (newStatus === 'paid') {
        toast.success('Notification envoyée au client !');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du statut de paiement.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditReservation = async (e) => {
    e.preventDefault();
    if (!selectedReservation || !selectedReservation.id) {
      setError('Aucune réservation sélectionnée.');
      return;
    }
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
      paymentStatus: e.target.paymentStatus.value,
    };
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reservations/${selectedReservation.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      setSelectedReservation(null);
      const response = await axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
      setError(null);
      toast.success('Réservation modifiée avec succès !');
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la modification.');
      toast.error('Erreur lors de la modification.');
    }
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await axios.get('http://localhost:5000/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
        setError(null);
        toast.success('Réservation supprimée avec succès !');
      } catch (error) {
        setError(error.response?.data?.error || 'Erreur lors de la suppression.');
        toast.error('Erreur lors de la suppression.');
      }
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reservation.nom &&
        `${reservation.nom} ${reservation.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? reservation.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isHosted = (reservation) =>
    projectFiles[reservation.id]?.length > 0 && reservation.payment_status === 'paid' && reservation.hosting_needed;

  return (
    <div className="admin-reservations-page">
      <header className="page-header">
        <h1>Gestion des Réservations</h1>
        <Link to="/dashboard" className="back-btn">
          Retour au Dashboard
        </Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="reservations-section">
        <div className="controls">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher par domaine ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>
        </div>

        <div className="reservation-grid">
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <h3>{reservation.domain_name}</h3>
                <p>
                  <strong>Client:</strong>{' '}
                  {reservation.nom ? `${reservation.nom} ${reservation.prenom}` : 'N/A'}
                </p>
                <p>
                  <strong>Offre:</strong> {reservation.offer_name}
                </p>
                <p>
                  <strong>Technologies:</strong> {reservation.technologies}
                </p>
                <p>
                  <strong>Type:</strong> {reservation.project_type}
                </p>
                <p>
                  <strong>Hébergement:</strong> {reservation.hosting_needed ? 'Oui' : 'Non'}
                </p>
                <p>
                  <strong>Statut:</strong> {reservation.status}
                </p>
                <p>
                  <strong>Paiement:</strong>{' '}
                  <select
                    value={reservation.payment_status || 'unpaid'}
                    onChange={(e) => handlePaymentStatusChange(reservation.id, e.target.value)}
                    className={reservation.payment_status === 'paid' ? 'status-paid' : 'status-unpaid'}
                  >
                    <option value="unpaid">Non Payé</option>
                    <option value="paid">Payé</option>
                  </select>
                </p>
                {projectFiles[reservation.id]?.length > 0 && reservation.payment_status === 'paid' && reservation.hosting_needed && (
                  <p>
                    <strong>Lien d'Hébergement:</strong>{' '}
                    <a
                      href={`http://hosting.${reservation.domain_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hosting-link"
                    >
                      Accéder à l'hébergement
                    </a>
                  </p>
                )}
                <div className="card-actions">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleUpdateStatus(reservation.id, 'accepted')}
                      >
                        Accepter
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleUpdateStatus(reservation.id, 'rejected')}
                      >
                        Refuser
                      </button>
                    </>
                  )}
                  <button
                    className="edit-btn"
                    onClick={() => {
                      if (!isHosted(reservation)) {
                        setSelectedReservation(reservation);
                        setShowEditModal(true);
                      }
                    }}
                    disabled={isHosted(reservation)}
                  >
                    <FaEdit /> Modifier
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (!isHosted(reservation)) handleDeleteReservation(reservation.id);
                    }}
                    disabled={isHosted(reservation)}
                  >
                    <FaTrash /> Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune réservation trouvée.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Modifier Réservation</h2>
        <form onSubmit={handleEditReservation} className="edit-form">
          <div className="form-group">
            <label>Nom de Domaine</label>
            <input
              type="text"
              name="domainName"
              defaultValue={selectedReservation?.domain_name}
              required
            />
          </div>
          <div className="form-group">
            <label>Offre de Domaine</label>
            <select name="offerId" defaultValue={selectedReservation?.offer_id} required>
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
              defaultValue={selectedReservation?.hosting_offer_id || ''}
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
              defaultValue={selectedReservation?.technologies}
              required
            />
          </div>
          <div className="form-group">
            <label>Type de Projet</label>
            <select
              name="projectType"
              defaultValue={selectedReservation?.project_type}
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
              defaultChecked={selectedReservation?.hosting_needed}
            />
          </div>
          <div className="form-group">
            <label>Services Additionnels</label>
            <input
              type="text"
              name="additionalServices"
              defaultValue={selectedReservation?.additional_services}
            />
          </div>
          <div className="form-group">
            <label>Contact Préféré</label>
            <select
              name="preferredContactMethod"
              defaultValue={selectedReservation?.preferred_contact_method}
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
              defaultValue={selectedReservation?.project_deadline}
            />
          </div>
          <div className="form-group">
            <label>Budget</label>
            <select
              name="budgetRange"
              defaultValue={selectedReservation?.budget_range}
            >
              <option value="0-100">0-100€</option>
              <option value="100-500">100-500€</option>
              <option value="500-1000">500-1000€</option>
              <option value="1000+">1000€ et plus</option>
            </select>
          </div>
          <div className="form-group">
            <label>Statut de Paiement</label>
            <select
              name="paymentStatus"
              defaultValue={selectedReservation?.payment_status || 'unpaid'}
            >
              <option value="unpaid">Non Payé</option>
              <option value="paid">Payé</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Modifier</button>
            <button type="button" onClick={() => setShowEditModal(false)}>
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <style>
        {`
          .admin-reservations-page {
            padding: 40px;
            background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%);
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

          .controls {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .search-bar {
            display: flex;
            align-items: center;
            background: #f4f6f9;
            padding: 10px;
            border-radius: 25px;
            flex: 1;
            min-width: 200px;
          }

          .search-bar svg {
            margin-right: 10px;
            color: #555;
          }

          .search-bar input {
            border: none;
            background: none;
            outline: none;
            width: 100%;
            font-size: 1rem;
            color: #2c3e50;
          }

          .filter {
            display: flex;
            align-items: center;
            background: #f4f6f9;
            padding: 10px;
            border-radius: 25px;
          }

          .filter svg {
            margin-right: 10px;
            color: #555;
          }

          .filter select {
            border: none;
            background: none;
            outline: none;
            font-size: 1rem;
            color: #2c3e50;
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

          .reservation-card select {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ddd;
            font-size: 0.9rem;
          }

          .status-paid {
            background-color: #2ecc71;
            color: #fff;
          }

          .status-unpaid {
            background-color: #e74c3c;
            color: #fff;
          }

          .hosting-link {
            color: #2ecc71;
            text-decoration: underline;
          }

          .hosting-link:hover {
            color: #27ae60;
          }

          .card-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }

          .accept-btn,
          .reject-btn,
          .edit-btn,
          .delete-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
            font-size: 0.9rem;
          }

          .accept-btn {
            background: #2ecc71;
            color: #fff;
          }

          .accept-btn:hover {
            background: #27ae60;
          }

          .reject-btn {
            background: #e74c3c;
            color: #fff;
          }

          .reject-btn:hover {
            background: #c0392b;
          }

          .edit-btn {
            background: #f1c40f;
            color: #fff;
          }

          .edit-btn:hover {
            background: #d4ac0d;
          }

          .edit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .delete-btn {
            background: #e74c3c;
            color: #fff;
          }

          .delete-btn:hover {
            background: #c0392b;
          }

          .delete-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
          }

          .pagination button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background: #f4f6f9;
            cursor: pointer;
            transition: background 0.3s;
          }

          .pagination button:hover {
            background: #3498db;
            color: #fff;
          }

          .pagination button.active {
            background: #3498db;
            color: #fff;
          }

          .modal-overlay {
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .modal h2 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .edit-form {
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

          .form-group input,
          .form-group select {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
          }

          .form-actions {
            grid-column: span 2;
            display: flex;
            gap: 10px;
            margin-top: 20px;
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

export default AdminDomainReservations;