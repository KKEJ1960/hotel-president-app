const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/utilisateurs', authMiddleware, requireRole('admin'), adminController.getUtilisateurs);
router.put('/utilisateurs/:id/statut', authMiddleware, requireRole('admin'), adminController.toggleStatut);
router.post('/utilisateurs/creer-staff', authMiddleware, requireRole('admin'), adminController.creerStaff);

module.exports = router;