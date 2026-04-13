const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const serviceController = require('../controllers/serviceController');

router.get('/',        serviceController.getServices);
router.post('/',       authMiddleware, requireRole('media'), serviceController.creerService);
router.put('/:id',     authMiddleware, requireRole('media'), serviceController.modifierService);
router.delete('/:id',  authMiddleware, requireRole('admin'), serviceController.supprimerService);

module.exports = router;