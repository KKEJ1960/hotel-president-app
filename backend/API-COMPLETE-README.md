# API Complète Hôtel Président - Chambres et Réservations

## Structure du projet

```
backend/
  config/
    db.js                    # Connexion MySQL
  controllers/
    authController.js       # Authentification
    chambreController.js    # Gestion chambres
    reservationController.js # Gestion réservations
  routes/
    authRoutes.js           # Routes authentification
    chambreRoutes.js        # Routes chambres
    reservationRoutes.js    # Routes réservations
    protectedRoutes.js      # Routes protégées
  middlewares/
    authMiddleware.js       # JWT et rôles
  .env                      # Configuration
  server.js                 # Serveur Express
  package.json              # Dépendances
```

## Base de données

### Tables créées

1. **type_chambres** - Types de chambres
2. **chambres** - Chambres individuelles
3. **reservations** - Réservations
4. **notifications** - Notifications système
5. **utilisateurs** - Utilisateurs (déjà existante)

## Routes API

### Chambres

#### GET /api/chambres - PUBLIC
Retourne toutes les chambres disponibles avec détails du type

**Exemple de réponse**:
```json
[
  {
    "id": 1,
    "numero": "STD-01",
    "titre": "Chambre STD-01",
    "prix_nuit": "45000.00",
    "disponible": true,
    "type_libelle": "Chambre Standard",
    "type_capacite": 2
  }
]
```

#### GET /api/chambres/:id - PUBLIC
Retourne les détails complets d'une chambre

#### POST /api/chambres - PROTÉGÉ (role: media)
Crée une nouvelle chambre

**Corps de la requête**:
```json
{
  "numero": "STD-04",
  "id_type": 1,
  "etage": 2,
  "titre": "Chambre Standard 4",
  "description": "Description...",
  "photo_url": "https://...",
  "superficie_m2": 25.5,
  "prix_nuit": 45000
}
```

#### PUT /api/chambres/:id - PROTÉGÉ (role: media)
Modifie une chambre existante

#### DELETE /api/chambres/:id - PROTÉGÉ (role: admin)
Supprime une chambre (vérifie qu'aucune réservation active)

---

### Réservations

#### POST /api/reservations - PROTÉGÉ (role: client)
Crée une nouvelle réservation

**Corps de la requête**:
```json
{
  "id_chambre": 1,
  "date_arrivee": "2026-06-15",
  "date_depart": "2026-06-17",
  "nombre_personnes": 2,
  "commentaire_client": "Commentaire optionnel"
}
```

**Réponse**:
```json
{
  "message": "Réservation créée avec succès",
  "reservation": {
    "id": 1,
    "reference": "RES-2026-00001",
    "prix_total": "90000.00",
    "statut": "en_attente",
    "chambre_titre": "Chambre STD-01"
  }
}
```

#### GET /api/reservations/mes-reservations - PROTÉGÉ (role: client)
Retourne les réservations du client connecté

#### GET /api/reservations - PROTÉGÉ (role: receptionniste ou admin)
Retourne toutes les réservations avec infos clients et chambres

#### PUT /api/reservations/:id/statut - PROTÉGÉ (role: receptionniste)
Met à jour le statut d'une réservation

**Corps de la requête**:
```json
{
  "statut": "confirmee",
  "note_receptionniste": "Note du réceptionniste"
}
```

#### GET /api/reservations/notifications - PROTÉGÉ (role: receptionniste)
Retourne les notifications non lues du réceptionniste

#### PUT /api/reservations/notifications/:id/lue - PROTÉGÉ (role: receptionniste)
Marque une notification comme lue

---

## Utilisateurs de test

### Client
- **Email**: amina@test.com
- **Mot de passe**: password123
- **Rôle**: client

### Admin
- **Email**: admin@hotelpresident.ci
- **Mot de passe**: admin123
- **Rôle**: admin

### Réceptionniste
- **Email**: reception@hotelpresident.ci
- **Mot de passe**: recep123
- **Rôle**: receptionniste

### Media
- **Email**: media@hotelpresident.ci
- **Mot de passe**: media123
- **Rôle**: media

## Fonctionnalités validées

### Chambres
- [x] Liste des chambres publiques
- [x] Détails chambre spécifique
- [x] Création chambre (media)
- [x] Modification chambre (media)
- [x] Suppression chambre (admin)
- [x] Validation disponibilité

### Réservations
- [x] Création réservation client
- [x] Calcul automatique prix total
- [x] Génération référence unique
- [x] Vérification disponibilité dates
- [x] Mise à jour statut (réceptionniste)
- [x] Liste réservations client
- [x] Liste toutes réservations (admin/receptionniste)

### Notifications
- [x] Création automatique notifications
- [x] Envoi aux réceptionnistes
- [x] Lecture notifications non lues
- [x] Marquage comme lu

### Sécurité
- [x] Authentification JWT
- [x] Contrôle des rôles
- [x] Validation des données
- [x] Gestion des erreurs

## Tests réalisés

### Tests Chambres
- [x] GET /api/chambres - 8 chambres trouvées
- [x] GET /api/chambres/1 - Détails chambre OK
- [x] POST /api/chambres - Création chambre TEST-01 OK
- [x] PUT /api/chambres/1 - Modification OK

### Tests Réservations
- [x] POST /api/reservations - Réservation RES-2026-00001 créée
- [x] GET /api/reservations/mes-reservations - 1 réservation trouvée
- [x] GET /api/reservations - 3 réservations totales
- [x] PUT /api/reservations/1/statut - Confirmée OK

### Tests Notifications
- [x] Création automatique lors réservation
- [x] GET /api/reservations/notifications - 2 notifications trouvées
- [x] PUT /api/reservations/notifications/3/lue - Marquée comme lue

## Données de test

### Chambres disponibles
- STD-02, STD-03, SUP-01, SUP-02, SUI-01, SUI-02, PRES-01, TEST-01

### Types de chambres
- Chambre Standard (45 000 FCFA/nuit)
- Chambre Supérieure (65 000 FCFA/nuit)
- Suite (120 000 FCFA/nuit)
- Suite Présidentielle (200 000 FCFA/nuit)

### Réservations créées
- RES-2026-00001: STD-01 (confirmée)
- RES-2026-00002: STD-03 (en attente)
- RES-2026-00003: STD-02 (en attente)

## Points forts du système

1. **Sécurité**: Authentification robuste avec JWT et rôles
2. **Validation**: Vérification complète des disponibilités et dates
3. **Notifications**: Système automatique pour les réceptionnistes
4. **Gestion d'état**: Suivi complet du cycle de vie des réservations
5. **API RESTful**: Structure claire et cohérente
6. **Gestion erreurs**: Messages d'erreur clairs et codes HTTP appropriés

## Serveur

- **URL**: http://localhost:5000
- **Base de données**: hotelpresident (MySQL)
- **Statut**: Opérationnel

L'API complète est **100% fonctionnelle** et prête pour l'intégration frontend !
