const db = require('./config/db');

// Insérer des types de chambres
const insertTypesChambres = () => {
  const types = [
    { libelle: 'Chambre Standard', description: 'Chambre confortable avec lit double', prix_nuit: 45000, capacite: 2 },
    { libelle: 'Chambre Supérieure', description: 'Chambre spacieuse avec vue sur le jardin', prix_nuit: 65000, capacite: 2 },
    { libelle: 'Suite', description: 'Suite luxueuse avec salon séparé', prix_nuit: 120000, capacite: 4 },
    { libelle: 'Suite Présidentielle', description: 'La suite la plus luxueuse de l\'hôtel', prix_nuit: 200000, capacite: 6 }
  ];

  types.forEach((type, index) => {
    const query = 'INSERT INTO type_chambres (libelle, description, prix_nuit, capacite) VALUES (?, ?, ?, ?)';
    db.query(query, [type.libelle, type.description, type.prix_nuit, type.capacite], (err, result) => {
      if (err) {
        console.error('Erreur insertion type chambre:', err);
      } else {
        console.log(`Type de chambre ${type.libelle} inséré (ID: ${result.insertId})`);
        
        // Insérer quelques chambres pour chaque type
        if (index === 0) { // Standard
          insertChambres(result.insertId, 'STD-', 3);
        } else if (index === 1) { // Supérieure
          insertChambres(result.insertId, 'SUP-', 2);
        } else if (index === 2) { // Suite
          insertChambres(result.insertId, 'SUI-', 2);
        } else if (index === 3) { // Présidentielle
          insertChambres(result.insertId, 'PRES-', 1);
        }
      }
    });
  });
};

// Insérer des chambres pour un type donné
const insertChambres = (idType, prefix, count) => {
  const chambres = [];
  
  for (let i = 1; i <= count; i++) {
    const numero = `${prefix}${String(i).padStart(2, '0')}`;
    const etage = Math.floor(Math.random() * 3) + 1; // Étages 1-3
    const titre = `Chambre ${numero}`;
    const description = `Description de la ${titre}`;
    const photo_url = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=600&h=400&fit=crop`;
    const superficie = 20 + Math.floor(Math.random() * 30); // 20-50 m²
    const prix = 45000 + Math.floor(Math.random() * 100000); // Prix variable

    chambres.push({ numero, idType, etage, titre, description, photo_url, superficie, prix });
  }

  chambres.forEach((chambre, index) => {
    const query = `
      INSERT INTO chambres (numero, id_type, etage, titre, description, photo_url, superficie_m2, prix_nuit, cree_par)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2)
    `;
    
    db.query(query, [
      chambre.numero, 
      chambre.idType, 
      chambre.etage, 
      chambre.titre, 
      chambre.description, 
      chambre.photo_url, 
      chambre.superficie, 
      chambre.prix
    ], (err, result) => {
      if (err) {
        console.error('Erreur insertion chambre:', err);
      } else {
        console.log(`Chambre ${chambre.numero} insérée (ID: ${result.insertId})`);
      }
      
      // Fin du processus après la dernière insertion
      if (idType === 4 && index === chambres.length - 1) {
        console.log('Données de test insérées avec succès');
        db.end();
      }
    });
  });
};

// Créer un utilisateur réceptionniste pour les tests
const createReceptionniste = () => {
  const bcrypt = require('bcryptjs');
  
  bcrypt.hash('recep123', 10, (err, hash) => {
    if (err) {
      console.error('Erreur hashage mot de passe:', err);
      return;
    }

    const query = `
      INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role, actif)
      VALUES (?, ?, ?, ?, ?, 'receptionniste', true)
    `;

    db.query(query, ['Réceptionniste', 'Hotel', 'reception@hotelpresident.ci', '0202020202', hash], (err, result) => {
      if (err) {
        console.error('Erreur création réceptionniste:', err);
      } else {
        console.log('Réceptionniste créé (ID: ' + result.insertId + ')');
      }
    });
  });
};

// Démarrer l'insertion
console.log('Insertion des données de test...');
insertTypesChambres();
createReceptionniste();
