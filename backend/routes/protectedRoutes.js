const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Route protégée (nécessite un token valide)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Accès autorisé au profil',
    utilisateur: req.user
  });
});

// Route admin uniquement
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Accès autorisé - Zone admin',
    utilisateur: req.user
  });
});

// Route pour receptionniste et admin
router.get('/reception', authMiddleware, requireRole('receptionniste', 'admin'), (req, res) => {
  res.json({
    message: 'Accès autorisé - Zone réception',
    utilisateur: req.user
  });
});

module.exports = router;
