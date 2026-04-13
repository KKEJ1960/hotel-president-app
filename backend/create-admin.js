const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

// Créer un utilisateur admin pour les tests
const createAdmin = async () => {
  try {
    // Vérifier si l'admin existe déjà
    const checkAdmin = 'SELECT id FROM utilisateurs WHERE email = ?';
    const [existing] = await db.query(checkAdmin, ['admin@hotelpresident.ci']);
    
    if (existing.length > 0) {
      console.log('L\'administrateur existe déjà');
      process.exit(0);
    }

    // Hasher le mot de passe avec saltRounds = 12
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);

    // Créer l'administrateur
    const insertAdmin = `
      INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif)
      VALUES (?, ?, ?, ?, ?, 'admin', true)
    `;

    const [result] = await db.query(insertAdmin, [
      'Admin',
      'Système',
      'admin@hotelpresident.ci', 
      '0101010101',
      hashedPassword
    ]);

    console.log('Administrateur créé avec succès:', {
      id: result.insertId,
      email: 'admin@hotelpresident.ci',
      mot_de_passe: 'Admin123!'
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

createAdmin();
