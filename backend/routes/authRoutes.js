const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');
const domainReservationController = require('../controllers/domainReservationController');
const offerController = require('../controllers/offerController');

// Routes d'authentification
router.post('/inscription', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/contact', authController.contact);

// Routes pour les clients
router.get('/clients', clientController.getClients);
router.post('/clients', clientController.addClient);
router.put('/clients/:id', clientController.updateClient);
router.delete('/clients/:id', clientController.deleteClient);

// Routes pour les réservations
router.post('/reservations', domainReservationController.addReservation);
router.get('/reservations/user/:userId', domainReservationController.getUserReservations);
router.get('/reservations', domainReservationController.getAllReservations);
router.put('/reservations/:id', domainReservationController.updateReservation);
router.delete('/reservations/:id', domainReservationController.deleteReservation);
router.put('/reservations/:id/status', domainReservationController.updateReservationStatus);

// Routes pour les offres
router.get('/offers', offerController.getAllOffers);
router.get('/offers/:id', offerController.getOfferById);
router.post('/offers', offerController.addOffer);
router.put('/offers/:id', offerController.updateOffer);
router.delete('/offers/:id', offerController.deleteOffer);

// Routes pour les fichiers de projet
router.post('/project-files', domainReservationController.uploadProjectFiles);
router.get('/project-files/:reservationId', domainReservationController.getProjectFiles);
router.delete('/project-files/:id', domainReservationController.deleteProjectFile);

module.exports = router;