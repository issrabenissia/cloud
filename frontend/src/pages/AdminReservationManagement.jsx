import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [domainOffers, setDomainOffers] = useState([]);
  const [hostingOffers, setHostingOffers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReservations(response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des réservations.');
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [domainResponse, hostingResponse] = await Promise.all([
          axios.get('/api/offers?type=domain', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('/api/offers?type=hosting', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setDomainOffers(domainResponse.data);
        setHostingOffers(hostingResponse.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des offres.');
      }
    };
    fetchOffers();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/reservations/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const response = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
      setSuccess(`Réservation ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès !`);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour.');
      setSuccess(null);
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
    };
    try {
      await axios.put(`/api/reservations/${selectedReservation.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShowEditForm(false);
      setSelectedReservation(null);
      const response = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
      setSuccess('Réservation modifiée avec succès !');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification.');
      setSuccess(null);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await axios.delete(`/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const response = await axios.get('/api/reservations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReservations(response.data);
        setSuccess('Réservation supprimée avec succès !');
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression.');
        setSuccess(null);
      }
    }
  };

  return (
    <div className="admin-reservation-management">
      <h2>Gestion des Réservations</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="reservation-list">
        {reservations.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Domaine</th>
                  <th>Offre</th>
                  <th>Technologies</th>
                  <th>Projet</th>
                  <th>Hébergement</th>
                  <th>Services</th>
                  <th>Contact</th>
                  <th>Date Limite</th>
                  <th>Budget</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      {reservation.nom
                        ? `${reservation.nom} ${reservation.prenom} (${reservation.email})`
                        : 'N/A'}
                    </td>
                    <td>{reservation.domain_name}</td>
                    <td>
                      {reservation.offer_name} ({reservation.price}€)
                      <br />
                      <small>{reservation.description}</small>
                    </td>
                    <td>{reservation.technologies}</td>
                    <td>{reservation.project_type}</td>
                    <td>{reservation.hosting_needed ? 'Oui' : 'Non'}</td>
                    <td>{reservation.additional_services || 'Aucun'}</td>
                    <td>{reservation.preferred_contact_method}</td>
                    <td>{reservation.project_deadline || 'N/A'}</td>
                    <td>{reservation.budget_range}€</td>
                    <td>{reservation.status}</td>
                    <td>
                      {reservation.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="accept-btn"
                            onClick={() => handleUpdateStatus(reservation.id, 'accepted')}
                          >
                            <FaCheck /> Accepter
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleUpdateStatus(reservation.id, 'rejected')}
                          >
                            <FaTimes /> Refuser
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowEditForm(true);
                            }}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">Aucune réservation trouvée.</p>
        )}
      </div>

      {showEditForm && selectedReservation && (
        <div className="edit-form">
          <h3>Modifier la Réservation #{selectedReservation.id}</h3>
          <form onSubmit={handleEditReservation}>
            <div className="form-group">
              <label>Nom de Domaine</label>
              <input
                type="text"
                name="domainName"
                defaultValue={selectedReservation.domain_name}
                required
              />
            </div>
            <div className="form-group">
              <label>Offre de Domaine</label>
              <select name="offerId" defaultValue={selectedReservation.offer_id} required>
                <option value="">Sélectionner</option>
                {domainOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Offre d'Hébergement</label>
              <select
                name="hostingOfferId"
                defaultValue={selectedReservation.hosting_offer_id || ''}
              >
                <option value="">Aucune</option>
                {hostingOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} ({offer.price}€)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <input
                type="text"
                name="technologies"
                defaultValue={selectedReservation.technologies}
                required
              />
            </div>
            <div className="form-group">
              <label>Type de Projet</label>
              <select
                name="projectType"
                defaultValue={selectedReservation.project_type}
                required
              >
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="business">Business</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="hostingNeeded"
                  defaultChecked={selectedReservation.hosting_needed}
                />
                Besoin d'Hébergement
              </label>
            </div>
            <div className="form-group">
              <label>Services Additionnels</label>
              <input
                type="text"
                name="additionalServices"
                defaultValue={selectedReservation.additional_services}
              />
            </div>
            <div className="form-group">
              <label>Contact Préféré</label>
              <select
                name="preferredContactMethod"
                defaultValue={selectedReservation.preferred_contact_method}
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
                defaultValue={selectedReservation.project_deadline}
              />
            </div>
            <div className="form-group">
              <label>Budget</label>
              <select
                name="budgetRange"
                defaultValue={selectedReservation.budget_range}
              >
                <option value="0-100">0-100€</option>
                <option value="100-500">100-500€</option>
                <option value="500-1000">500-1000€</option>
                <option value="1000+">1000€ et plus</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <FaEdit /> Modifier
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEditForm(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <style>
        {`
          .admin-reservation-management {
            max-width: 1440px;
            margin: 40px auto;
            padding: 32px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            font-family: Inter, system-ui, sans-serif;
            animation: fadeIn 0.5s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 24px;
            text-align: center;
            letter-spacing: -0.025em;
          }

          .error-message {
            background: #fef2f2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.875rem;
            text-align: center;
            animation: slideIn 0.3s ease-out;
          }

          .success-message {
            background: #f0fdf4;
            color: #16a34a;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.875rem;
            text-align: center;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }

          th, td {
            padding: 16px;
            text-align: left;
            font-size: 0.875rem;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
          }

          th {
            background: #2563eb;
            color: #ffffff;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          tr:last-child td {
            border-bottom: none;
          }

          tr:hover {
            background: #f8fafc;
            transition: background 0.2s;
          }

          small {
            color: #6b7280;
            font-size: 0.75rem;
            display: block;
            margin-top: 4px;
          }

          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .accept-btn, .reject-btn, .edit-btn, .delete-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            transition: background 0.2s, transform 0.2s;
          }

          .accept-btn {
            background: #16a34a;
            color: #ffffff;
          }

          .accept-btn:hover {
            background: #15803d;
            transform: translateY(-1px);
          }

          .reject-btn {
            background: #dc2626;
            color: #ffffff;
          }

          .reject-btn:hover {
            background: #b91c1c;
            transform: translateY(-1px);
          }

          .edit-btn {
            background: #d97706;
            color: #ffffff;
          }

          .edit-btn:hover {
            background: #b45309;
            transform: translateY(-1px);
          }

          .delete-btn {
            background: #dc2626;
            color: #ffffff;
          }

          .delete-btn:hover {
            background: #b91c1c;
            transform: translateY(-1px);
          }

          .edit-form {
            margin-top: 32px;
            padding: 24px;
            background: #f8fafc;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            animation: fadeIn 0.3s ease-out;
          }

          .edit-form h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }

          .edit-form form {
            display: grid;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group.checkbox {
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }

          .edit-form label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          .edit-form input, .edit-form select {
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
            color: #1f2937;
            background: #ffffff;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .edit-form input:focus, .edit-form select:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            outline: none;
          }

          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 16px;
          }

          .submit-btn, .cancel-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background 0.2s, transform 0.2s;
          }

          .submit-btn {
            background: #2563eb;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .submit-btn:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
          }

          .cancel-btn {
            background: #e5e7eb;
            color: #1f2937;
          }

          .cancel-btn:hover {
            background: #d1d5db;
            transform: translateY(-1px);
          }

          .no-data {
            text-align: center;
            font-size: 1rem;
            color: #6b7280;
            padding: 24px 0;
          }

          @media (max-width: 768px) {
            .admin-reservation-management {
              margin: 24px 16px;
              padding: 24px;
            }

            .table-wrapper {
              margin: 0 -16px;
            }

            table {
              min-width: 1000px;
            }

            .action-buttons {
              flex-direction: column;
              align-items: flex-start;
            }

            h2 {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminReservationManagement;