const db = require('./config/db');
const fs = require('fs');
const path = require('path');

// Script SQL pour créer les tables
const sqlScript = `
CREATE TABLE IF NOT EXISTS type_chambres (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    libelle     VARCHAR(100)  NOT NULL,
    description TEXT,
    prix_nuit   DECIMAL(10,2) NOT NULL,
    capacite    INT           DEFAULT 2,
    actif       BOOLEAN       DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS chambres (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    numero            VARCHAR(10)   NOT NULL UNIQUE,
    id_type           INT           NOT NULL,
    etage             INT           DEFAULT 1,
    titre             VARCHAR(150),
    description       TEXT,
    photo_url         VARCHAR(500),
    superficie_m2     DECIMAL(5,1),
    prix_nuit         DECIMAL(10,2) NOT NULL,
    disponible        BOOLEAN       DEFAULT TRUE,
    cree_par          INT,
    modifie_par       INT,
    date_creation     DATETIME      DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME      ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_type)     REFERENCES type_chambres(id),
    FOREIGN KEY (cree_par)    REFERENCES utilisateurs(id),
    FOREIGN KEY (modifie_par) REFERENCES utilisateurs(id)
);

CREATE TABLE IF NOT EXISTS reservations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    reference           VARCHAR(20)   NOT NULL UNIQUE,
    id_client           INT           NOT NULL,
    id_chambre          INT           NOT NULL,
    id_receptionniste   INT,
    date_reservation    DATETIME      DEFAULT CURRENT_TIMESTAMP,
    date_arrivee        DATE          NOT NULL,
    date_depart         DATE          NOT NULL,
    duree_nuits         INT GENERATED ALWAYS AS (DATEDIFF(date_depart, date_arrivee)) STORED,
    nombre_personnes    INT           DEFAULT 1,
    prix_total          DECIMAL(10,2),
    statut              ENUM('en_attente','confirmee','en_cours','terminee','annulee') DEFAULT 'en_attente',
    commentaire_client  TEXT,
    note_receptionniste TEXT,
    notif_envoyee       BOOLEAN       DEFAULT FALSE,
    date_modification   DATETIME      ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_client)         REFERENCES utilisateurs(id),
    FOREIGN KEY (id_chambre)        REFERENCES chambres(id),
    FOREIGN KEY (id_receptionniste) REFERENCES utilisateurs(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    id_destinataire INT  NOT NULL,
    id_reservation  INT,
    message         TEXT NOT NULL,
    lue             BOOLEAN  DEFAULT FALSE,
    date_envoi      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_destinataire) REFERENCES utilisateurs(id),
    FOREIGN KEY (id_reservation)  REFERENCES reservations(id)
);
`;

// Exécuter le script SQL
const statements = sqlScript.split(';').filter(stmt => stmt.trim());

statements.forEach((statement, index) => {
  if (statement.trim()) {
    db.query(statement, (err, result) => {
      if (err) {
        console.error(`Erreur lors de l'exécution de l'instruction ${index + 1}:`, err);
      } else {
        console.log(`Table ${index + 1} créée avec succès`);
      }
      
      // Fermer la connexion après la dernière instruction
      if (index === statements.length - 1) {
        console.log('Configuration des tables terminée');
        db.end();
      }
    });
  }
});
