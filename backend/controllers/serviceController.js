const db = require('../config/db');

exports.getServices = (req, res) => {
  db.query('SELECT * FROM services_hotel WHERE actif = true', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.json(results);
  });
};

exports.creerService = (req, res) => {
  const { nom, description, photo_url, horaires, prix } = req.body;
  if (!nom) return res.status(400).json({ message: 'Le nom est obligatoire' });
  
  const query = `INSERT INTO services_hotel (nom, description, photo_url, horaires, prix, cree_par)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [nom, description, photo_url, horaires, prix || 0, req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.status(201).json({ message: 'Service créé', id: result.insertId });
  });
};

exports.modifierService = (req, res) => {
  const { id } = req.params;
  const { nom, description, photo_url, horaires, prix } = req.body;
  
  const query = `UPDATE services_hotel SET nom=?, description=?, photo_url=?, horaires=?, prix=?, modifie_par=? WHERE id=?`;
  
  db.query(query, [nom, description, photo_url, horaires, prix, req.user.id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.json({ message: 'Service modifié avec succès' });
  });
};

exports.supprimerService = (req, res) => {
  db.query('UPDATE services_hotel SET actif = false WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
    res.json({ message: 'Service supprimé' });
  });
};