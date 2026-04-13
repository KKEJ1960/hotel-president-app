const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const {
  getAllChambres,
  getChambreById,
  createChambre,
  updateChambre,
  deleteChambre,
  getTypes,
  checkDisponibilite
} = require('../controllers/chambreController');

// ⚠️ IMPORTANT : /types DOIT être avant /:id
// sinon Express croit que "types" est un :id
router.get('/types', authMiddleware, requireRole('media'), getTypes);

// Routes publiques
router.get('/', getAllChambres);
router.get('/:id/disponibilite', checkDisponibilite);
router.get('/:id', getChambreById);

// Routes protégées (role: media)
router.post('/', authMiddleware, requireRole('media'), createChambre);
router.put('/:id', authMiddleware, requireRole('media'), updateChambre);

// Routes protégées (role: admin)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteChambre);

module.exports = router;