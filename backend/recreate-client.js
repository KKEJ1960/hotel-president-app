const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Recréer l'utilisateur client
const createClient = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const insertUser = `
      INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif)
      VALUES (?, ?, ?, ?, ?, 'client', true)
    `;

    db.query(insertUser, ['Koné', 'Aminata', 'amina@test.com', '0707070707', hashedPassword], (err, result) => {
      if (err) {
        console.error('Erreur lors de la création du client:', err);
        return;
      }
      console.log('Client recréé avec succès, ID:', result.insertId);
      console.log('Email: amina@test.com');
      console.log('Mot de passe: password123');
      db.end();
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
};

createClient();
