const db = require('./config/db');

// Lire et exécuter le fichier SQL
const fs = require('fs');
const path = require('path');

const sqlFile = path.join(__dirname, 'create-table.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Exécuter chaque instruction SQL séparée par ;
const statements = sql.split(';').filter(stmt => stmt.trim());

statements.forEach((statement, index) => {
  if (statement.trim()) {
    db.query(statement, (err, result) => {
      if (err) {
        console.error(`Erreur lors de l'exécution de l'instruction ${index + 1}:`, err);
      } else {
        console.log(`Instruction ${index + 1} exécutée avec succès`);
      }
      
      // Fermer la connexion après la dernière instruction
      if (index === statements.length - 1) {
        console.log('Configuration de la base de données terminée');
        db.end();
      }
    });
  }
});
