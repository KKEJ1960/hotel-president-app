# Hôtel Président — Application Web

## Prérequis
- Node.js v18+
- MySQL 8+

## Installation

### Base de données
1. Créer la base de données : `CREATE DATABASE hotelpresident;` 
2. Importer le schéma : `mysql -u root -p hotelpresident < schema.sql` 

### Backend
1. `cd backend` 
2. `npm install` 
3. Copier `.env.example` en `.env` et remplir les variables
4. `npm run dev` 

### Frontend
1. `cd frontend` 
2. `npm install` 
3. Copier `.env.example` en `.env` et remplir les variables
4. `npm run dev` 

## Déploiement
- Backend : Railway, Render ou VPS
- Frontend : Vercel ou Netlify
- Base de données : PlanetScale ou Railway MySQL

## Rôles
- **Admin** : gestion des comptes
- **Réceptionniste** : gestion des réservations
- **Média** : gestion du contenu (chambres, services, photos)
- **Client** : réservation des chambres

## Sécurité
- JWT avec secret 64+ caractères
- Rate limiting sur les routes d'authentification
- Validation stricte des entrées utilisateur
- Protection contre les injections SQL
- Sécurisation des uploads d'images
- CORS configuré pour le domaine client

## Variables d'environnement
### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=hotelpresident
JWT_SECRET=secret_64_caracteres_minimum
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
