import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si un token existe au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email, motDePasse) => {
    const response = await api.post('/auth/connexion', {
      email,
      mot_de_passe: motDePasse
    });

    const { token: receivedToken, utilisateur } = response.data;
    
    // Stocker dans le localStorage
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(utilisateur));
    
    // Mettre à jour l'état
    setToken(receivedToken);
    setUser(utilisateur);

    // Ne fait RIEN d'autre — pas de navigate, pas de redirect
    // C'est le composant Connexion.jsx qui gère la navigation après
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/inscription', userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 409) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      } else if (error.response?.status === 400) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires' };
      } else {
        return { success: false, error: 'Erreur lors de l\'inscription' };
      }
    }
  };

  // Fonction de déconnexion améliorée
  const logout = () => {
    // Vider immédiatement le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser les états
    setToken(null);
    setUser(null);
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  // Obtenir le rôle de l'utilisateur
  const role = user?.role;

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    role,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
