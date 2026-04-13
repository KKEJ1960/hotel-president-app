const db = require('../config/db');

// Créer une nouvelle réservation (protégé, role: client)
const createReservation = (req, res) => {
  const { id_chambre, date_arrivee, date_depart, nombre_personnes, commentaire_client } = req.body;
  const id_client = req.user.id;

  // Validation des champs obligatoires
  if (!id_chambre || !date_arrivee || !date_depart) {
    return res.status(400).json({ 
      error: 'Champs obligatoires manquants: id_chambre, date_arrivee, date_depart' 
    });
  }

  // Validation des dates
  const arrivee = new Date(date_arrivee);
  const depart = new Date(date_depart);
  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  if (arrivee <= aujourdHui) {
    return res.status(400).json({ error: 'La date d\'arrivée doit être dans le futur' });
  }

  if (depart <= arrivee) {
    return res.status(400).json({ error: 'La date de départ doit être postérieure à la date d\'arrivée' });
  }

  // Vérifier que la chambre existe
  const checkChambre = 'SELECT id, titre, prix_nuit FROM chambres WHERE id = ?';
  db.query(checkChambre, [id_chambre], (err, chambreResults) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification de la chambre' });
    }

    if (chambreResults.length === 0) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }

    const chambre = chambreResults[0];

    // Vérification chevauchement de dates
    const checkConflit = `
      SELECT r.id, r.date_arrivee, r.date_depart
      FROM reservations r
      WHERE r.id_chambre = ?
      AND r.statut IN ('en_attente', 'confirmee', 'en_cours')
      AND r.date_arrivee < ?
      AND r.date_depart  > ?
    `;

    db.query(checkConflit, [id_chambre, date_depart, date_arrivee], (err, conflitResults) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur lors de la vérification des disponibilités' });
      }

      if (conflitResults.length > 0) {
        return res.status(409).json({
          message: `Chambre déjà réservée du ${conflitResults[0].date_arrivee} au ${conflitResults[0].date_depart}`,
          libre_le: conflitResults[0].date_depart
        });
      }

      // Générer la référence
      const year = new Date().getFullYear();
      const getReference = 'SELECT COUNT(*) as count FROM reservations WHERE YEAR(date_reservation) = ?';
      
      db.query(getReference, [year], (err, countResults) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la génération de la référence' });
        }

        const count = countResults[0].count + 1;
        const reference = `RES-${year}-${String(count).padStart(5, '0')}`;

        // Calculer le prix total
        const dureeNuits = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
        const prixTotal = parseFloat(chambre.prix_nuit) * dureeNuits;

        // Créer la réservation
        const insertReservation = `
          INSERT INTO reservations 
          (reference, id_client, id_chambre, date_arrivee, date_depart, nombre_personnes, prix_total, commentaire_client)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertReservation, [reference, id_client, id_chambre, date_arrivee, date_depart, nombre_personnes || 1, prixTotal, commentaire_client], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
          }

          // Créer des notifications pour les réceptionnistes (plus de mise à jour du champ disponible)
          const getReceptionnistes = 'SELECT id, nom, prenom FROM utilisateurs WHERE role = "receptionniste" AND actif = true';
          
          db.query(getReceptionnistes, (err, receptionnisteResults) => {
            if (err || receptionnisteResults.length === 0) {
              // Pas de réceptionnistes, mais la réservation est créée
              return sendResponse(result.insertId, reference);
            }

            // Obtenir les infos du client
            const getClientInfo = 'SELECT nom, prenom FROM utilisateurs WHERE id = ?';
            db.query(getClientInfo, [id_client], (err, clientResults) => {
              if (err) {
                return sendResponse(result.insertId, reference);
              }

              const client = clientResults[0];
              const message = `Nouvelle réservation ${reference} - Client : ${client.prenom} ${client.nom} - Chambre : ${chambre.titre} - Arrivée : ${date_arrivee} - Départ : ${date_depart}`;

              // Insérer les notifications
              receptionnisteResults.forEach(receptionniste => {
                const insertNotification = 'INSERT INTO notifications (id_destinataire, id_reservation, message) VALUES (?, ?, ?)';
                db.query(insertNotification, [receptionniste.id, result.insertId, message]);
              });

              sendResponse(result.insertId, reference);
            });
          });
        });
      });
    });
  });

  function sendResponse(reservationId, reference) {
    // Récupérer la réservation créée avec détails
    const getReservation = `
      SELECT r.*, c.titre as chambre_titre, c.photo_url as chambre_photo, c.numero as chambre_numero
      FROM reservations r
      LEFT JOIN chambres c ON r.id_chambre = c.id
      WHERE r.id = ?
    `;

    db.query(getReservation, [reservationId], (err, reservationResults) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération de la réservation' });
      }

      res.status(201).json({
        message: 'Réservation créée avec succès',
        reservation: reservationResults[0]
      });
    });
  }
};

// Obtenir les réservations du client connecté (protégé, role: client)
const getMesReservations = (req, res) => {
  const id_client = req.user.id;

  const query = `
    SELECT r.*, c.titre as chambre_titre, c.photo_url as chambre_photo, c.numero as chambre_numero
    FROM reservations r
    LEFT JOIN chambres c ON r.id_chambre = c.id
    WHERE r.id_client = ?
    ORDER BY r.date_reservation DESC
  `;

  db.query(query, [id_client], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }

    res.json(results);
  });
};

// Obtenir toutes les réservations (protégé, role: receptionniste ou admin)
const getAllReservations = (req, res) => {
  const query = `
    SELECT r.*, 
           u.nom as client_nom, u.prenom as client_prenom, u.email as client_email,
           c.titre as chambre_titre, c.photo_url as chambre_photo, c.numero as chambre_numero
    FROM reservations r
    LEFT JOIN utilisateurs u ON r.id_client = u.id
    LEFT JOIN chambres c ON r.id_chambre = c.id
    ORDER BY r.date_reservation DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }

    res.json(results);
  });
};

// Mettre à jour le statut d'une réservation (protégé, role: receptionniste)
const updateReservationStatut = (req, res) => {
  const { id } = req.params;
  const { statut, note_receptionniste } = req.body;
  const id_receptionniste = req.user.id;

  // Validation du statut
  const statutsValides = ['confirmee', 'en_cours', 'terminee', 'annulee'];
  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  // Vérifier que la réservation existe
  const checkReservation = 'SELECT id, id_chambre, statut FROM reservations WHERE id = ?';
  db.query(checkReservation, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    const reservation = results[0];

    // Mettre à jour le statut
    const updateQuery = `
      UPDATE reservations 
      SET statut = ?, note_receptionniste = ?, id_receptionniste = ?, date_modification = NOW()
      WHERE id = ?
    `;

    db.query(updateQuery, [statut, note_receptionniste, id_receptionniste, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la réservation' });
      }

      // Plus de mise à jour automatique du champ disponible (géré manuellement par le média)

      res.json({
        message: 'Statut de réservation mis à jour avec succès'
      });
    });
  });
};

// Obtenir les notifications du réceptionniste (protégé, role: receptionniste)
const getNotifications = (req, res) => {
  const id_destinataire = req.user.id;

  const query = `
    SELECT n.*, r.reference
    FROM notifications n
    LEFT JOIN reservations r ON n.id_reservation = r.id
    WHERE n.id_destinataire = ? AND n.lue = false
    ORDER BY n.date_envoi DESC
  `;

  db.query(query, [id_destinataire], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }

    res.json(results);
  });
};

// Marquer une notification comme lue (protégé, role: receptionniste)
const markNotificationAsRead = (req, res) => {
  const { id } = req.params;
  const id_destinataire = req.user.id;

  // Vérifier que la notification appartient au réceptionniste
  const checkNotification = 'SELECT id FROM notifications WHERE id = ? AND id_destinataire = ?';
  db.query(checkNotification, [id, id_destinataire], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    // Marquer comme lue
    const updateQuery = 'UPDATE notifications SET lue = true WHERE id = ?';
    db.query(updateQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
      }

      res.json({
        message: 'Notification marquée comme lue'
      });
    });
  });
};

module.exports = {
  createReservation,
  getMesReservations,
  getAllReservations,
  updateReservationStatut,
  getNotifications,
  markNotificationAsRead
};
