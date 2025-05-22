const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token reçu:', token);
  if (!token) return res.status(401).json({ error: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit: réservé aux administrateurs' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return res.status(401).json({ error: 'Token invalide' });
  }
};