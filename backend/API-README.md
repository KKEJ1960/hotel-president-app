# API d'Authentification - Hôtel Président

## Structure du projet

```
backend/
  config/
    db.js          # Connexion à la base de données MySQL
  controllers/
    authController.js  # Logique d'authentification
  routes/
    authRoutes.js     # Routes d'authentification
    protectedRoutes.js # Routes protégées
  middlewares/
    authMiddleware.js  # Middleware JWT et gestion des rôles
  .env              # Variables d'environnement
  server.js         # Serveur Express
  package.json      # Dépendances
```

## Base de données

### Table `utilisateurs`

```sql
CREATE TABLE utilisateurs (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nom                 VARCHAR(100)    NOT NULL,
    prenom              VARCHAR(100)    NOT NULL,
    email               VARCHAR(150)    NOT NULL UNIQUE,
    telephone           VARCHAR(20),
    mot_de_passe        VARCHAR(255)    NOT NULL,
    role                ENUM('client','receptionniste','media','admin') NOT NULL DEFAULT 'client',
    email_verifie       BOOLEAN         DEFAULT FALSE,
    token_verif         VARCHAR(255),
    token_reset         VARCHAR(255),
    token_expiration    DATETIME,
    actif               BOOLEAN         DEFAULT TRUE,
    cree_par            INT,
    date_creation       DATETIME        DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion  DATETIME
);
```

## Routes API

### Authentification

#### POST /api/auth/inscription
**Description**: Créer un nouveau compte utilisateur

**Corps de la requête**:
```json
{
  "nom": "Koné",
  "prenom": "Aminata",
  "email": "amina@test.com",
  "telephone": "0707070707",
  "mot_de_passe": "password123"
}
```

**Réponses**:
- `201` : Compte créé avec succès
```json
{
  "message": "Compte créé avec succès",
  "utilisateur": {
    "id": 1,
    "nom": "Koné",
    "prenom": "Aminata",
    "email": "amina@test.com",
    "telephone": "0707070707",
    "role": "client",
    "actif": true,
    "date_creation": "2026-04-10T00:57:07.000Z"
  }
}
```

- `400` : Champs obligatoires manquants
- `409` : Email déjà utilisé
- `500` : Erreur serveur

---

#### POST /api/auth/connexion
**Description**: Connecter un utilisateur

**Corps de la requête**:
```json
{
  "email": "amina@test.com",
  "mot_de_passe": "password123"
}
```

**Réponses**:
- `200` : Connexion réussie
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilisateur": {
    "id": 1,
    "nom": "Koné",
    "prenom": "Aminata",
    "email": "amina@test.com",
    "telephone": "0707070707",
    "role": "client",
    "actif": true
  }
}
```

- `400` : Champs obligatoires manquants
- `401` : Email/mot de passe incorrect ou compte inactif
- `500` : Erreur serveur

---

### Routes Protégées

Toutes les routes protégées nécessitent un header `Authorization: Bearer <token>`.

#### GET /api/protected/profile
**Description**: Obtenir le profil de l'utilisateur connecté
**Accès**: Tous les utilisateurs authentifiés

#### GET /api/protected/admin
**Description**: Accès à la zone admin
**Accès**: Admin uniquement

#### GET /api/protected/reception
**Description**: Accès à la zone réception
**Accès**: Receptionniste et Admin

**Réponses des routes protégées**:
- `200` : Accès autorisé
```json
{
  "message": "Accès autorisé au profil",
  "utilisateur": {
    "id": 1,
    "nom": "Koné",
    "prenom": "Aminata",
    "email": "amina@test.com",
    "role": "client"
  }
}
```

- `401` : Token manquant ou invalide
- `403` : Rôle non autorisé

---

## Middleware

### authMiddleware
Vérifie la présence et la validité du token JWT dans le header `Authorization: Bearer <token>`.

### requireRole(...roles)
Vérifie que l'utilisateur a l'un des rôles spécifiés.

**Exemple d'utilisation**:
```javascript
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Route protégée (tous les utilisateurs authentifiés)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ utilisateur: req.user });
});

// Route admin uniquement
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Zone admin' });
});

// Route réceptionniste et admin
router.get('/reception', authMiddleware, requireRole('receptionniste', 'admin'), (req, res) => {
  res.json({ message: 'Zone réception' });
});
```

## Utilisateurs de test

### Client
- **Email**: amina@test.com
- **Mot de passe**: password123
- **Rôle**: client

### Admin
- **Email**: admin@hotelpresident.ci
- **Mot de passe**: admin123
- **Rôle**: admin

## Sécurité

- **Mots de passe**: Hashés avec bcryptjs
- **Tokens**: JWT avec expiration 24h
- **Rôles**: Contrôle d'accès basé sur les rôles
- **Validation**: Input validation et gestion des erreurs

## Configuration

Variables d'environnement dans `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hotelpresident
PORT=5000
JWT_SECRET=votre_jwt_secret_securise_ici
```

## Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le serveur démarrera sur `http://localhost:5000`
