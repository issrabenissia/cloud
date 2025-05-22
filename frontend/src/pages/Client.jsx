// client/src/pages/Client.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';


const Clients = ({ setClientCount }) => {
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
      setClientCount(response.data.length);
      console.log('Clients récupérés:', response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setError('Erreur lors du chargement des clients.');
    }
  }, [setClientCount]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    const formData = {
      nom: e.target.nom.value,
      prenom: e.target.prenom.value,
      email: e.target.email.value,
      mot_de_passe: e.target.mot_de_passe.value,
      role: 'client',
    };
    try {
      await axios.post('http://localhost:5000/api/clients', formData);
      setShowAddForm(false);
      fetchClients();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout du client.');
    }
  };

  const handleEditClient = async (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedClient.id) return;
    const formData = {
      nom: e.target.nom.value,
      prenom: e.target.prenom.value,
      email: e.target.email.value,
      role: 'client',
    };
    try {
      await axios.put(`http://localhost:5000/api/clients/${selectedClient.id}`, formData);
      setShowEditForm(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification.');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/clients/${id}`);
        fetchClients();
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="clients-section animate-fade-in-up">
        <h2>Liste des Clients</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Ajouter un client
        </button>
        <div className="client-list">
          {clients.length > 0 ? (
            <div className="client-cards">
              {clients.map((client) => (
                <div key={client.id} className="client-card glassmorphic tilt-card animate-fade-in-up">
                  <h3>{client.prenom} {client.nom}</h3>
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Rôle:</strong> {client.role}</p>
                  <div className="client-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowEditForm(true);
                      }}
                    >
                      <FaEdit /> Modifier
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data glassmorphic animate-fade-in-up">
              <p>Aucun client trouvé.</p>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="add-client-form">
          <h2>Ajouter un client</h2>
          <form onSubmit={handleAddClient}>
            <div className="form-group">
              <label>Nom :</label>
              <input type="text" name="nom" required />
            </div>
            <div className="form-group">
              <label>Prénom :</label>
              <input type="text" name="prenom" required />
            </div>
            <div className="form-group">
              <label>Email :</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-group">
              <label>Mot de passe :</label>
              <input type="password" name="mot_de_passe" required />
            </div>
            <button type="submit">Ajouter</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Annuler</button>
          </form>
        </div>
      )}

      {showEditForm && selectedClient && (
        <div className="add-client-form">
          <h2>Modifier le client</h2>
          <form onSubmit={handleEditClient}>
            <div className="form-group">
              <label>Nom :</label>
              <input type="text" name="nom" defaultValue={selectedClient.nom} required />
            </div>
            <div className="form-group">
              <label>Prénom :</label>
              <input type="text" name="prenom" defaultValue={selectedClient.prenom} required />
            </div>
            <div className="form-group">
              <label>Email :</label>
              <input type="email" name="email" defaultValue={selectedClient.email} required />
            </div>
            <button type="submit">Modifier</button>
            <button type="button" onClick={() => setShowEditForm(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Clients;