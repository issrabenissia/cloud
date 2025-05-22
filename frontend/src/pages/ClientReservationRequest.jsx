import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from './ReservationForm';

const ClientReservationRequest = ({ userId }) => {
  const [domainOffers, setDomainOffers] = useState([]);
  const [hostingOffers, setHostingOffers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleAddReservation = async (e) => {
    if (!e) return;
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
      await axios.post('/api/reservations', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Réservation ajoutée avec succès !');
      setError(null);
      e.target.reset();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l’ajout.');
      setSuccess(null);
    }
  };

  return (
    <div className="reservation-request-container">
      <h2>Nouvelle Demande de Réservation</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <ReservationForm
        onSubmit={handleAddReservation}
        domainOffers={domainOffers}
        hostingOffers={hostingOffers}
        submitLabel="Soumettre"
      />
    </div>
  );
};

export default ClientReservationRequest;