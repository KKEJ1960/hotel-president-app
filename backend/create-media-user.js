const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Créer un utilisateur avec le rôle media
const createMediaUser = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('media123', salt);

    const insertUser = `
      INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif)
      VALUES (?, ?, ?, ?, ?, 'media', true)
    `;

    db.query(insertUser, ['Media', 'Hotel', 'media@hotelpresident.ci', '0303030303', hashedPassword], (err, result) => {
      if (err) {
        console.error('Erreur lors de la création de l\'utilisateur media:', err);
        return;
      }
      console.log('Utilisateur media créé avec succès, ID:', result.insertId);
      console.log('Email: media@hotelpresident.ci');
      console.log('Mot de passe: media123');
      db.end();
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
};

createMediaUser();
