const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de sécurité
app.use(helmet());

// Limitation des requêtes
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives par IP
  message: { message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.' }
});

app.use(limiterGlobal);
app.use('/api/auth', limiterAuth);

// CORS sécurisé
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://192.168.1.10:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Import des routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const chambreRoutes = require('./routes/chambreRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/chambres', chambreRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API Hôtel Président - Serveur opérationnel' });
});

// Route pour tester la connexion à la base de données
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur de connexion à la base de données', details: err });
      return;
    }
    res.json({ message: 'Connexion à la base de données réussie', data: results });
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Une erreur est survenue',
    ...(isDev && { stack: err.stack })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur sécurisé démarré sur le port ${PORT}`);
});
