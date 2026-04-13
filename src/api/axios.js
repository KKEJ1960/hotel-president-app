import axios from 'axios';

// Créer l'instance axios avec la base URL du backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête - Ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Ne redirige que si on n'est PAS en train de se connecter
      const isLoginRequest = error.config?.url?.includes('/auth/connexion');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/connexion';
      }
    }
    // Toujours propager l'erreur pour que le composant puisse l'attraper
    return Promise.reject(error);
  }
);

export default api;
