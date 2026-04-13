-- Schema de la base de données Hôtel Président
-- Généré pour le déploiement en production

-- Créer la base de données
-- CREATE DATABASE hotelpresident;
-- USE hotelpresident;

-- Table des utilisateurs
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('client', 'receptionniste', 'media', 'admin') DEFAULT 'client',
  actif BOOLEAN DEFAULT TRUE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  derniere_connexion DATETIME NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Table des chambres
CREATE TABLE chambres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(10) UNIQUE NOT NULL,
  titre VARCHAR(100) NOT NULL,
  description TEXT,
  prix_nuit DECIMAL(10,2) NOT NULL,
  capacite INT NOT NULL,
  etage INT NOT NULL,
  image_url VARCHAR(255),
  disponible BOOLEAN DEFAULT TRUE,
  libre_le DATE NULL,
  statut ENUM('disponible', 'occupée', 'maintenance') DEFAULT 'disponible',
  modifie_par INT NULL,
  date_modification DATETIME NULL,
  INDEX idx_numero (numero),
  INDEX idx_statut (statut),
  INDEX idx_disponible (disponible)
);

-- Table des services
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  icone VARCHAR(50),
  actif BOOLEAN DEFAULT TRUE,
  modifie_par INT NULL,
  date_modification DATETIME NULL,
  INDEX idx_actif (actif)
);

-- Table des réservations
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(20) UNIQUE NOT NULL,
  id_chambre INT NOT NULL,
  id_client INT NOT NULL,
  date_arrivee DATE NOT NULL,
  date_depart DATE NOT NULL,
  prix_total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee') DEFAULT 'en_attente',
  date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
  message_reservation TEXT,
  INDEX idx_reference (reference),
  INDEX idx_client (id_client),
  INDEX idx_chambre (id_chambre),
  INDEX idx_dates (date_arrivee, date_depart),
  INDEX idx_statut (statut),
  FOREIGN KEY (id_chambre) REFERENCES chambres(id),
  FOREIGN KEY (id_client) REFERENCES utilisateurs(id)
);

-- Table des notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_utilisateur INT NOT NULL,
  titre VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_utilisateur (id_utilisateur),
  INDEX idx_lu (lu),
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id)
);

-- Compte administrateur par défaut
-- INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) 
-- VALUES ('Admin', 'Système', 'admin@hotelpresident.ci', '$2b$12$hashed_password_here', 'admin');
