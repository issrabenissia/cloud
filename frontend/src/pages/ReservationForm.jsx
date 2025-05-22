import React from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';

const ReservationForm = ({
  onSubmit,
  initialData = {},
  domainOffers = [],
  hostingOffers = [],
  submitLabel = 'Soumettre',
  isEdit = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="reservation-form">
      <div className="form-group">
        <label>Nom de Domaine</label>
        <input
          type="text"
          name="domainName"
          defaultValue={initialData.domain_name || ''}
          placeholder="exemple.com"
          required
        />
      </div>
      <div className="form-group">
        <label>Offre de Domaine</label>
        <select name="offerId" defaultValue={initialData.offer_id || ''} required>
          <option value="">Sélectionner</option>
          {domainOffers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} ({offer.price}€ pour {offer.duration_months} mois)
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Offre d'Hébergement</label>
        <select name="hostingOfferId" defaultValue={initialData.hosting_offer_id || ''}>
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
          defaultValue={initialData.technologies || ''}
          placeholder="HTML, CSS, React"
          required
        />
      </div>
      <div className="form-group">
        <label>Type de Projet</label>
        <select name="projectType" defaultValue={initialData.project_type || ''} required>
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
            defaultChecked={initialData.hosting_needed}
          />
          Besoin d'Hébergement
        </label>
      </div>
      <div className="form-group">
        <label>Services Additionnels</label>
        <input
          type="text"
          name="additionalServices"
          defaultValue={initialData.additional_services || ''}
          placeholder="SEO, Maintenance"
        />
      </div>
      <div className="form-group">
        <label>Contact Préféré</label>
        <select
          name="preferredContactMethod"
          defaultValue={initialData.preferred_contact_method || 'email'}
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
          defaultValue={initialData.project_deadline || ''}
        />
      </div>
      <div className="form-group">
        <label>Budget</label>
        <select name="budgetRange" defaultValue={initialData.budget_range || ''}>
          <option value="0-100">0-100€</option>
          <option value="100-500">100-500€</option>
          <option value="500-1000">500-1000€</option>
          <option value="1000+">1000€ et plus</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {isEdit ? <FaEdit /> : <FaPlus />} {submitLabel}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => onSubmit(null)}
        >
          Annuler
        </button>
      </div>

      <style>
        {`
          .reservation-form {
            display: grid;
            gap: 20px;
            max-width: 640px;
            margin: 0 auto;
            padding: 24px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            animation: fadeIn 0.3s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
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

          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          input, select {
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
            color: #1f2937;
            background: #f9fafb;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          input:focus, select:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            outline: none;
          }

          .form-actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
          }

          .submit-btn, .cancel-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
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

          @media (max-width: 640px) {
            .reservation-form {
              padding: 16px;
            }
          }
        `}
      </style>
    </form>
  );
};

export default ReservationForm;