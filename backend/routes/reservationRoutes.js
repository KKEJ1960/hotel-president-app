const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const {
  createReservation,
  getMesReservations,
  getAllReservations,
  updateReservationStatut,
  getNotifications,
  markNotificationAsRead
} = require('../controllers/reservationController');

// Routes protégées (role: client)
router.post('/', authMiddleware, requireRole('client'), createReservation);
router.get('/mes-reservations', authMiddleware, requireRole('client'), getMesReservations);

// Routes protégées (role: receptionniste ou admin)
router.get('/', authMiddleware, requireRole('receptionniste', 'admin'), getAllReservations);
router.put('/:id/statut', authMiddleware, requireRole('receptionniste'), updateReservationStatut);

// Routes protégées (role: receptionniste)
router.get('/notifications', authMiddleware, requireRole('receptionniste'), getNotifications);
router.put('/notifications/:id/lue', authMiddleware, requireRole('receptionniste'), markNotificationAsRead);

module.exports = router;
