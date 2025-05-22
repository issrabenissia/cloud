const express = require('express');
const router = express.Router();
const domainReservationController = require('../controllers/domainReservationController');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Twilio Configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token reçu:', token);
  if (!token) {
    console.log('Aucun token fourni');
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    if (decoded.role !== 'admin') {
      console.log('Rôle non admin:', decoded.role);
      return res.status(403).json({ error: 'Accès interdit: réservé aux administrateurs' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Validate phone number (basic E.164 format check)
const validatePhoneNumber = (phone) => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

// Update reservation status
router.put('/reservations/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`Mise à jour du statut de la réservation ${id}: ${status}`);
  try {
    const reservation = await domainReservationController.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }
    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Cette réservation a déjà été traitée.' });
    }
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    await domainReservationController.updateStatus(id, status);

    if (status === 'accepted') {
      const clientPhone = reservation.client_phone || reservation.phone;
      if (!clientPhone || !validatePhoneNumber(clientPhone)) {
        console.error('Numéro de téléphone invalide:', clientPhone);
        return res.status(400).json({ message: 'Numéro de téléphone invalide pour l\'envoi de SMS.' });
      }

      // Load RIB details from environment variables
      const companyRIB = {
        bankName: process.env.COMPANY_BANK_NAME || 'Banque XYZ',
        iban: process.env.COMPANY_IBAN || 'FR76XXXXXXXXXXXXXXXXXXXX',
        bic: process.env.COMPANY_BIC || 'XYZFR2X',
        accountHolder: process.env.COMPANY_ACCOUNT_HOLDER || 'Votre Entreprise SARL',
      };

      // Construct SMS message
      const ribMessage = `Votre réservation pour ${reservation.domain_name} a été acceptée ! Veuillez effectuer le paiement via virement bancaire. Détails du RIB : Titulaire : ${companyRIB.accountHolder}, IBAN : ${companyRIB.iban}, BIC : ${companyRIB.bic}.`;

      try {
        await twilioClient.messages.create({
          body: ribMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: clientPhone,
        });
        console.log(`SMS envoyé à ${clientPhone} pour réservation acceptée.`);
      } catch (twilioError) {
        console.error('Erreur lors de l\'envoi du SMS:', twilioError.message);
        return res.status(500).json({ message: 'Réservation acceptée, mais échec de l\'envoi du SMS.', error: twilioError.message });
      }

      const deployedUrl = await domainReservationController.deployWebsite(reservation);
      if (deployedUrl) {
        await domainReservationController.updateDeployedUrl(id, deployedUrl);
        return res.status(200).json({ message: 'Réservation acceptée et notification envoyée !', deployedUrl });
      } else {
        return res.status(200).json({ message: 'Réservation acceptée et notification envoyée, mais aucun fichier à déployer pour l\'instant.' });
      }
    }

    res.status(200).json({ message: `Réservation ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès !` });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la réservation:', error.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Other routes (unchanged, included for context)
router.get('/reservations', authenticateAdmin, domainReservationController.getAllReservations);
router.get('/offers', domainReservationController.getOffers);
router.put('/reservations/:id/payment', authenticateAdmin, domainReservationController.updatePaymentStatus);

module.exports = router;