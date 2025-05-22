const Hosting = require('../models/Hosting');
const Reservation = require('../models/Reservation');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simuler une intégration avec cPanel (remplace avec ton API réelle)
const deployWebsite = async (domainName, filePath) => {
  return new Promise((resolve, reject) => {
    // Exemple : Commande pour déployer via cPanel (à adapter)
    const command = `curl -u "username:password" -X POST "https://ton-serveur:2083/json-api/createacct?domain=${domainName}&plan=ton_plan"`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout);
    });

    // Déplacer les fichiers uploadés vers le répertoire d'hébergement
    const hostingDir = `/home/user/public_html/${domainName}`;
    fs.mkdirSync(hostingDir, { recursive: true });
    fs.copyFileSync(filePath, path.join(hostingDir, 'index.html')); // Exemple simple
  });
};

exports.acceptReservationAndHost = async (req, res) => {
  const { reservationId } = req.params;

  try {
    // Récupérer la réservation
    const [reservation] = await db.query('SELECT * FROM reservations WHERE id = ?', [reservationId]);
    if (!reservation.length) return res.status(404).json({ message: 'Réservation non trouvée' });

    const { domain_name, hosting_offer_id, status } = reservation[0];
    if (status !== 'pending') return res.status(400).json({ message: 'Réservation déjà traitée' });

    // Récupérer les fichiers uploadés
    const [files] = await db.query('SELECT file_path FROM project_files WHERE reservation_id = ?', [reservationId]);
    if (!files.length) return res.status(400).json({ message: 'Aucun fichier uploadé' });

    // Créer un enregistrement d'hébergement
    const hostingId = await Hosting.create({
      reservationId,
      domainName: domain_name,
      hostingOfferId: hosting_offer_id,
      filePath: files[0].file_path, // Simplification : un seul fichier pour l'exemple
    });

    // Déployer le site
    await deployWebsite(domain_name, files[0].file_path);

    // Mettre à jour le statut
    await Reservation.updateStatus(reservationId, 'accepted');
    await Hosting.updateStatus(hostingId, 'active');

    res.status(200).json({ message: 'Site hébergé avec succès', hostingId });
  } catch (error) {
    console.error('Erreur lors de l\'hébergement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};