const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Middleware de validation des résultats
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: errors.array() 
    });
  }
  next();
};

// Inscription
const inscription = [
  // Validation des données
  body('nom')
    .trim()
    .escape()
    .isAlpha('fr-FR')
    .withMessage('Le nom ne doit contenir que des lettres')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
    
  body('prenom')
    .trim()
    .escape()
    .isAlpha('fr-FR')
    .withMessage('Le prénom ne doit contenir que des lettres')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
    
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email invalide')
    .isLength({ max: 100 })
    .withMessage('Email trop long'),
    
  body('telephone')
    .trim()
    .escape()
    .matches(/^0[1-9]\d{7}$/)
    .withMessage('Le numéro doit être au format ivoirien (ex: 07XXXXXXXX)'),
    
  body('mot_de_passe')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
    
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const { nom, prenom, email, telephone, mot_de_passe } = req.body;

      // Vérifier si l'email existe déjà
      const checkEmail = 'SELECT id FROM utilisateurs WHERE email = ?';
      const [emailResults] = await db.query(checkEmail, [email]);

      if (emailResults.length > 0) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe avec saltRounds = 12
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

      // Insérer le nouvel utilisateur
      const insertUser = `
        INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif)
          VALUES (?, ?, ?, ?, ?, 'client', true)
      `;

      const [result] = await db.query(insertUser, [nom, prenom, email, telephone, hashedPassword]);

      // Récupérer les infos de l'utilisateur créé (sans mot de passe)
      const getUser = `
        SELECT id, nom, prenom, email, telephone, role, actif, date_creation
          FROM utilisateurs WHERE id = ?
      `;

      const [userResults] = await db.query(getUser, [result.insertId]);

      res.status(201).json({
        message: 'Compte créé avec succès',
        utilisateur: userResults[0]
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
];

// Connexion
const connexion = [
  // Validation des données
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email invalide'),
    
  body('mot_de_passe')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
    
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const { email, mot_de_passe } = req.body;

      // Rechercher l'utilisateur
      const getUser = `
        SELECT id, nom, prenom, email, telephone, mot_de_passe, role, actif
          FROM utilisateurs WHERE email = ?
      `;

      const [results] = await db.query(getUser, [email]);

      if (results.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const utilisateur = results[0];

      // Vérifier si le compte est actif
      if (!utilisateur.actif) {
        return res.status(401).json({ error: 'Ce compte a été désactivé' });
      }

      // Vérifier le mot de passe
      const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
      if (!motDePasseValide) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Mettre à jour la dernière connexion
      const updateLastLogin = 'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?';
      await db.query(updateLastLogin, [utilisateur.id]);

      // Générer le token JWT
      const token = jwt.sign(
        { 
          id: utilisateur.id, 
          nom: utilisateur.nom, 
          prenom: utilisateur.prenom, 
          email: utilisateur.email, 
          role: utilisateur.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Retourner le token et les infos utilisateur (sans mot de passe)
      const utilisateurSansMdp = {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        role: utilisateur.role,
        actif: utilisateur.actif,
        derniere_connexion: utilisateur.derniere_connexion
      };

      res.json({
        message: 'Connexion réussie',
        token,
        utilisateur: utilisateurSansMdp
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
];

module.exports = {
  inscription,
  connexion
};
