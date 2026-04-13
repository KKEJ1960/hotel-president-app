const express = require('express');
const router = express.Router();
const { inscription, connexion } = require('../controllers/authController');

// Route d'inscription
router.post('/inscription', inscription);

// Route de connexion
router.post('/connexion', connexion);

module.exports = router;
