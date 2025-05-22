import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUpload, FaEye, FaEdit } from 'react-icons/fa';
import ReservationForm from './ReservationForm';
import styles from '../styles';

const ClientReservationManagement = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [projectFiles, setProjectFiles] = useState({});
  const [domainOffers, setDomainOffers] = useState([]);
  const [hostingOffers, setHostingOffers] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`/api/reservations/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReservations(response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des réservations.');
      }
    };
    const fetchOffers = async () => {
      try {
        const domainResponse = await axios.get('/api/offers?type=domain', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDomainOffers(domainResponse.data);
        const hostingResponse = await axios.get('/api/offers?type=hosting', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setHostingOffers(hostingResponse.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement des offres.');
      }
    };
    fetchReservations();
    fetchOffers();
  }, [userId]);

  const fetchProjectFiles = async (reservationId) => {
    try {
      const response = await axios.get(`/api/project-files/${reservationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjectFiles((prev) => ({ ...prev, [reservationId]: response.data }));
    } catch (error) {
      setError('Erreur lors du chargement des fichiers.');
    }
  };

  const handleEditReservation = async (e) => {
    e.preventDefault();
    if (!selectedReservation?.id) {
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
      const response = await axios.get(`/api/reservations/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
      setShowEditForm(false);
      setSelectedReservation(null);
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
        const response = await axios.get(`/api/reservations/user/${userId}`, {
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
      await axios.post('/api/project-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShowUploadForm(null);
      fetchProjectFiles(reservationId);
      const response = await axios.get(`/api/reservations/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
      setSuccess('Fichiers uploadés avec succès !');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'upload des fichiers.');
      setSuccess(null);
    }
  };

  const handleDeleteFile = async (fileId, reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        await axios.delete(`/api/project-files/${fileId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchProjectFiles(reservationId);
        const response = await axios.get(`/api/reservations/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReservations(response.data);
        setSuccess('Fichier supprimé avec succès !');
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression du fichier.');
        setSuccess(null);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Réservations</h2>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}
      <div style={styles.tableWrapper}>
        {reservations.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Domaine</th>
                <th style={styles.th}>Offre Domaine</th>
                <th style={styles.th}>Offre Hébergement</th>
                <th style={styles.th}>Technologies</th>
                <th style={styles.th}>Projet</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>URL</th>
                <th style={styles.th}>Actions</th>
                <th style={styles.th}>Fichiers</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td style={styles.td}>{reservation.domain_name}</td>
                  <td style={styles.td}>{reservation.offer_name}</td>
                  <td style={styles.td}>{reservation.hosting_offer_name || 'N/A'}</td>
                  <td style={styles.td}>{reservation.technologies}</td>
                  <td style={styles.td}>{reservation.project_type}</td>
                  <td style={styles.td}>{reservation.status}</td>
                  <td style={styles.td}>
                    {reservation.deployed_url ? (
                      <a
                        href={reservation.deployed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2563eb', textDecoration: 'none' }}
                      >
                        <FaEye /> Voir
                      </a>
                    ) : (
                      'Non déployé'
                    )}
                  </td>
                  <td style={styles.td}>
                    {reservation.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{ ...styles.button, ...styles.editButton }}
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowEditForm(true);
                          }}
                        >
                          <FaEdit /> Modifier
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.deleteButton }}
                          onClick={() => handleDeleteReservation(reservation.id)}
                        >
                          <FaTrash /> Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    {reservation.status === 'accepted' && (
                      <>
                        <button
                          style={{ ...styles.button, ...styles.uploadButton }}
                          onClick={() => {
                            setShowUploadForm(reservation.id);
                            fetchProjectFiles(reservation.id);
                          }}
                        >
                          <FaUpload /> Uploader
                        </button>
                        {projectFiles[reservation.id]?.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>
                              Fichiers :
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {projectFiles[reservation.id].map((file) => (
                                <li
                                  key={file.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    fontSize: '0.75rem',
                                    color: '#374151',
                                  }}
                                >
                                  {file.file_name}
                                  <button
                                    style={{ ...styles.button, ...styles.deleteButton }}
                                    onClick={() => handleDeleteFile(file.id, reservation.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noData}>Aucune réservation trouvée.</p>
        )}
      </div>
      {showUploadForm && (
        <div style={{ ...styles.container, marginTop: '32px' }}>
          <h3 style={styles.title}>Uploader des fichiers (Réservation #{showUploadForm})</h3>
          <form onSubmit={(e) => handleUploadFiles(e, showUploadForm)} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fichiers</label>
              <input style={styles.input} type="file" name="files" multiple required />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button style={{ ...styles.button, ...styles.submitButton }}>
                <FaUpload /> Uploader
              </button>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setShowUploadForm(null)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      {showEditForm && selectedReservation && (
        <ReservationForm
          onSubmit={handleEditReservation}
          onCancel={() => setShowEditForm(false)}
          initialData={selectedReservation}
          domainOffers={domainOffers}
          hostingOffers={hostingOffers}
          isEdit
        />
      )}
    </div>
  );
};

export default ClientReservationManagement;