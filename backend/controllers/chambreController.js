const db = require('../config/db');

const getTypes = (req, res) => {
  // Simplifié : retourne les types de chambres statiques
  const types = [
    { id: 1, libelle: 'Standard', description: 'Chambre standard', capacite: 2 },
    { id: 2, libelle: 'Suite', description: 'Suite luxueuse', capacite: 4 },
    { id: 3, libelle: 'Deluxe', description: 'Chambre deluxe', capacite: 3 }
  ];
  res.json(types);
};

// Obtenir toutes les chambres publiques (disponibles)
const getAllChambres = async (req, res) => {
  try {
    const query = 'SELECT * FROM chambres ORDER BY numero';
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des chambres' });
  }
};

// Obtenir une chambre par son ID
const getChambreById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM chambres WHERE id = ?';
    const [results] = await db.query(query, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }
    
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la récupération de la chambre' });
  }
};

// Créer une nouvelle chambre (protégé, role: media)
const createChambre = async (req, res) => {
  try {
    const { numero, etage, titre, description, image_url, capacite, prix_nuit } = req.body;
    const cree_par = req.user.id;

    // Validation des champs obligatoires
    if (!numero || !prix_nuit) {
      return res.status(400).json({ 
        error: 'Champs obligatoires manquants: numero, prix_nuit' 
      });
    }

    const query = `
      INSERT INTO chambres (numero, etage, titre, description, image_url, capacite, prix_nuit, cree_par)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [numero, etage, titre, description, image_url, capacite, prix_nuit, cree_par]);

    // Récupérer la chambre créée
    const getQuery = 'SELECT * FROM chambres WHERE id = ?';
    const [chambreResults] = await db.query(getQuery, [result.insertId]);

    res.status(201).json({
      message: 'Chambre créée avec succès',
      chambre: chambreResults[0]
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ce numéro de chambre existe déjà' });
    }
    return res.status(500).json({ error: 'Erreur lors de la création de la chambre' });
  }
};

// Modifier une chambre (protégé, role: media)
const updateChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, etage, titre, description, image_url, capacite, prix_nuit, disponible } = req.body;
    const modifie_par = req.user.id;

    // Vérifier si la chambre existe
    const checkQuery = 'SELECT id FROM chambres WHERE id = ?';
    const [checkResults] = await db.query(checkQuery, [id]);

    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }

    // Construire la requête de mise à jour dynamique
    const updateFields = [];
    const updateValues = [];

    if (numero !== undefined) {
      updateFields.push('numero = ?');
      updateValues.push(numero);
    }
    if (etage !== undefined) {
      updateFields.push('etage = ?');
      updateValues.push(etage);
    }
    if (titre !== undefined) {
      updateFields.push('titre = ?');
      updateValues.push(titre);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (capacite !== undefined) {
      updateFields.push('capacite = ?');
      updateValues.push(capacite);
    }
    if (prix_nuit !== undefined) {
      updateFields.push('prix_nuit = ?');
      updateValues.push(prix_nuit);
    }
    if (disponible !== undefined) {
      updateFields.push('disponible = ?');
      updateValues.push(disponible);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à modifier' });
    }

    updateFields.push('modifie_par = ?');
    updateValues.push(modifie_par);
    updateValues.push(id);

    const updateQuery = `UPDATE chambres SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(updateQuery, updateValues);

    // Récupérer la chambre mise à jour
    const getQuery = 'SELECT * FROM chambres WHERE id = ?';
    const [chambreResults] = await db.query(getQuery, [id]);

    res.json({
      message: 'Chambre mise à jour avec succès',
      chambre: chambreResults[0]
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ce numéro de chambre existe déjà' });
    }
    return res.status(500).json({ error: 'Erreur lors de la modification de la chambre' });
  }
};

// Supprimer une chambre (protégé, role: admin)
const deleteChambre = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la chambre existe
    const checkQuery = 'SELECT id FROM chambres WHERE id = ?';
    const [checkResults] = await db.query(checkQuery, [id]);

    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }

    // Vérifier si la chambre a des réservations actives
    const checkReservations = 'SELECT id FROM reservations WHERE id_chambre = ? AND statut NOT IN ("annulee", "terminee")';
    const [reservationResults] = await db.query(checkReservations, [id]);

    if (reservationResults.length > 0) {
      return res.status(400).json({ error: 'Impossible de supprimer une chambre avec des réservations actives' });
    }

    // Supprimer la chambre
    const deleteQuery = 'DELETE FROM chambres WHERE id = ?';
    await db.query(deleteQuery, [id]);

    res.json({
      message: 'Chambre supprimée avec succès'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la suppression de la chambre' });
  }
};

// GET /api/chambres/:id/disponibilite?date_arrivee=2026-05-01&date_depart=2026-05-05
const checkDisponibilite = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_arrivee, date_depart } = req.query;

    if (!date_arrivee || !date_depart) {
      return res.status(400).json({ message: 'Dates manquantes' });
    }

    const query = `
      SELECT r.date_arrivee, r.date_depart
      FROM reservations r
      WHERE r.id_chambre = ?
      AND r.statut IN ('en_attente', 'confirmee', 'en_cours')
      AND r.date_arrivee < ?
      AND r.date_depart  > ?
    `;

    const [results] = await db.query(query, [id, date_depart, date_arrivee]);

    if (results.length > 0) {
      return res.json({
        disponible: false,
        message: `Chambre réservée du ${results[0].date_arrivee} au ${results[0].date_depart}`,
        libre_le: results[0].date_depart
      });
    }

    res.json({ disponible: true });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  getAllChambres,
  getChambreById,
  createChambre,
  updateChambre,
  deleteChambre,
  getTypes,
  checkDisponibilite
};
