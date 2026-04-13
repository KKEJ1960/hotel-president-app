const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET tous les utilisateurs
exports.getUtilisateurs = (req, res) => {
  const query = `SELECT id, nom, prenom, email, telephone, role, actif, date_creation, derniere_connexion
                 FROM utilisateurs ORDER BY date_creation DESC`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.json(results);
  });
};

// PUT activer/désactiver un compte
exports.toggleStatut = (req, res) => {
  const { id } = req.params;
  const { actif } = req.body;
  
  db.query('UPDATE utilisateurs SET actif = ? WHERE id = ?', [actif, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.json({ message: `Compte ${actif ? 'activé' : 'désactivé'} avec succès` });
  });
};

// POST créer un compte staff
exports.creerStaff = (req, res) => {
  const { nom, prenom, email, telephone, mot_de_passe, role } = req.body;
  if (!nom || !prenom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }
  if (!['receptionniste', 'media'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }
  
  // Vérifier si l'email existe déjà
  db.query('SELECT id FROM utilisateurs WHERE email = ?', [email], (err, existResults) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    if (existResults.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    
    // Hasher le mot de passe
    bcrypt.hash(mot_de_passe, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur', error: err.message });
      }
      
      // Insérer le nouvel utilisateur
      const insertQuery = `INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif, email_verifie, cree_par)
                          VALUES (?, ?, ?, ?, ?, ?, true, true, ?)`;
      
      db.query(insertQuery, [nom, prenom, email, telephone, hash, role, req.user.id], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
        res.status(201).json({ message: 'Compte créé avec succès', id: result.insertId });
      });
    });
  });
};