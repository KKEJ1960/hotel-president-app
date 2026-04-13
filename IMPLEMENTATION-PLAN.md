# Plan d'Implementation - Corrections et Améliorations

## BUGS À CORRIGER

### BUG 1 - Déconnexion immédiate
- [ ] AuthContext.jsx : logout() vide localStorage + états
- [ ] App.jsx : Protection des pages par rôle
- [ ] Redirection automatique si non autorisé

### BUG 2 - Upload d'image Dashboard Media  
- [ ] Installation multer : npm install multer
- [ ] Endpoint POST /api/upload
- [ ] Composant 3 options (URL/Appareil/URL)
- [ ] Validation frontend corrigée
- [ ] Images par défaut si vide

### BUG 3 - Activation/Désactivation comptes
- [ ] authController.js : Vérification actif à connexion
- [ ] authMiddleware.js : Vérification actif à chaque requête
- [ ] AuthContext.jsx : Logout auto sur 401

## AMÉLIORATIONS

### 1. Transitions de page fluides
- [ ] Animation fadeIn dans App.jsx
- [ ] Scroll en haut automatique

### 2. États de chargement
- [ ] Spinners sur tous les formulaires
- [ ] Désactivation boutons pendant requête

### 3. Feedback utilisateur
- [ ] Messages auto-disparition 4s
- [ ] Animations d'apparition douce

### 4. Navbar améliorée
- [ ] Transitions couleurs liens actifs
- [ ] Scroll automatique

### 5. Effets cartes chambres/services
- [ ] Hover transform: translateY(-4px)
- [ ] Transitions fluides

## ORDRE D'IMPLÉMENTATION

1. Backend (upload + sécurité)
2. AuthContext (déconnexion + sécurité)
3. App.jsx (protection + transitions)
4. DashboardMedia (upload images)
5. Components généraux (spinners + feedback)
6. Navbar (transitions)
7. Tests finaux
