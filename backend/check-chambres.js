const db = require('./config/db');

// Vérifier l'état des chambres
const query = 'SELECT id, numero, titre, disponible FROM chambres ORDER BY id';

db.query(query, (err, results) => {
  if (err) {
    console.error('Erreur:', err);
    return;
  }

  console.log('État des chambres:');
  results.forEach(chambre => {
    console.log(`ID: ${chambre.id} - ${chambre.numero} - ${chambre.titre} - Disponible: ${chambre.disponible ? 'Oui' : 'Non'}`);
  });

  db.end();
});
