// server/controllers/offerController.js
const Offer = require('../models/offerModel');

const offerController = {
  // Récupérer toutes les offres
  getAllOffers: async (req, res) => {
    const { type } = req.query; // Filtrer par type (domain ou hosting)
    try {
      const offers = await Offer.findAll(type);
      res.status(200).json(offers);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error.message);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Récupérer une offre par ID
  getOfferById: async (req, res) => {
    const { id } = req.params;
    try {
      const offer = await Offer.findById(id);
      if (!offer) {
        return res.status(404).json({ message: 'Offre non trouvée.' });
      }
      res.status(200).json(offer);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error.message);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Ajouter une nouvelle offre
  addOffer: async (req, res) => {
    const { name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth } = req.body;
    try {
      // Validation des champs obligatoires
      if (!name || !duration_months || !price || !offer_type) {
        return res.status(400).json({ message: 'Les champs name, duration_months, price et offer_type sont obligatoires.' });
      }

      // Validation des champs spécifiques à l'hébergement
      if (offer_type === 'hosting' && (!storage_space || !bandwidth)) {
        return res.status(400).json({ message: 'Les champs storage_space et bandwidth sont obligatoires pour une offre d\'hébergement.' });
      }

      // Validation du domain_type pour les offres de domaine
      if (offer_type === 'domain' && !domain_type) {
        return res.status(400).json({ message: 'Le champ domain_type est obligatoire pour une offre de domaine.' });
      }

      const offerId = await Offer.create(
        name,
        duration_months,
        price,
        description,
        features,
        domain_type || null,
        offer_type,
        storage_space || null,
        bandwidth || null
      );
      res.status(201).json({ message: 'Offre ajoutée avec succès !', offerId });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'offre:', error.message);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Mettre à jour une offre
  updateOffer: async (req, res) => {
    const { id } = req.params;
    const { name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth } = req.body;
    try {
      const offer = await Offer.findById(id);
      if (!offer) {
        return res.status(404).json({ message: 'Offre non trouvée.' });
      }

      // Validation des champs obligatoires
      if (!name || !duration_months || !price || !offer_type) {
        return res.status(400).json({ message: 'Les champs name, duration_months, price et offer_type sont obligatoires.' });
      }

      // Validation des champs spécifiques à l'hébergement
      if (offer_type === 'hosting' && (!storage_space || !bandwidth)) {
        return res.status(400).json({ message: 'Les champs storage_space et bandwidth sont obligatoires pour une offre d\'hébergement.' });
      }

      // Validation du domain_type pour les offres de domaine
      if (offer_type === 'domain' && !domain_type) {
        return res.status(400).json({ message: 'Le champ domain_type est obligatoire pour une offre de domaine.' });
      }

      await Offer.update(
        id,
        name,
        duration_months,
        price,
        description,
        features,
        domain_type || null,
        offer_type,
        storage_space || null,
        bandwidth || null
      );
      res.status(200).json({ message: 'Offre mise à jour avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error.message);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Supprimer une offre
  deleteOffer: async (req, res) => {
    const { id } = req.params;
    try {
      const offer = await Offer.findById(id);
      if (!offer) {
        return res.status(404).json({ message: 'Offre non trouvée.' });
      }

      await Offer.delete(id);
      res.status(200).json({ message: 'Offre supprimée avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error.message);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
};

module.exports = offerController;