const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    // Vérifier le format "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Format de token invalide. Utilisez: Bearer <token>' });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que le compte est toujours actif
    db.query('SELECT actif FROM utilisateurs WHERE id = ?', [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la vérification du compte' });
      }
      
      if (!results[0] || !results[0].actif) {
        return res.status(401).json({ error: 'Compte désactivé' });
      }
      
      // Attacher les informations de l'utilisateur à la requête
      req.user = decoded;
      next();
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    } else {
      return res.status(500).json({ error: 'Erreur lors de la vérification du token' });
    }
  }
};

// Middleware de vérification des rôles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé. Rôles autorisés: ' + roles.join(', ') 
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole
};
