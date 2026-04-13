const mysql = require('mysql2');
require('dotenv').config();

// Création du pool de connexions à la base de données
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotelpresident',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    console.error('Configuration utilisée:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '***' : 'VIDE',
      database: process.env.DB_NAME
    });
  } else {
    console.log('Connexion à la base de données MySQL réussie');
    connection.release();
  }
});

module.exports = db.promise();
