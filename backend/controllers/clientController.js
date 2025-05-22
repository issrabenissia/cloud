// server/controllers/clientController.js
const User = require('../models/userModel');

const clientController = {
 // server/controllers/clientController.js
getClients: async (req, res) => {
  try {
      console.log('Récupération des clients...');
      const clients = await User.findAllClients(); // Pas besoin de destructurer ici
      res.status(200).json(clients);
  } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
  }
},

  addClient: async (req, res) => {
    const { nom, prenom, email, mot_de_passe, role = 'client' } = req.body;
    try {
      console.log('Ajout d\'un client:', { nom, prenom, email, role });
      const existingUser = await User.findByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      await User.createUser(nom, prenom, email, mot_de_passe, role);
      res.status(201).json({ message: 'Client ajouté avec succès !' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  updateClient: async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, role } = req.body;
    try {
      console.log(`Mise à jour du client ID ${id}:`, { nom, prenom, email, role });
      const existingUser = await User.findById(id);
      if (!existingUser) return res.status(404).json({ message: 'Client non trouvé.' });

      if (email !== existingUser.email) {
        const emailExists = await User.findByEmail(email);
        if (emailExists) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      await User.updateClient(id, nom, prenom, email, role);
      res.status(200).json({ message: 'Client mis à jour avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  deleteClient: async (req, res) => {
    const { id } = req.params;
    try {
      console.log(`Suppression du client ID ${id}`);
      const existingUser = await User.findById(id);
      if (!existingUser) return res.status(404).json({ message: 'Client non trouvé.' });
      await User.deleteClient(id);
      res.status(200).json({ message: 'Client supprimé avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
};

module.exports = clientController;