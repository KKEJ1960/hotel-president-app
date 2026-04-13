const db = require('./config/db');

// Vérifier les utilisateurs existants
const query = 'SELECT id, nom, prenom, email, role, actif FROM utilisateurs ORDER BY id';

db.query(query, (err, results) => {
  if (err) {
    console.error('Erreur:', err);
    return;
  }

  console.log('Utilisateurs existants:');
  results.forEach(user => {
    console.log(`ID: ${user.id} - ${user.prenom} ${user.nom} - ${user.email} - ${user.role} - Actif: ${user.actif}`);
  });

  db.end();
});
