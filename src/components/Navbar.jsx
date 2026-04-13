import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Accueil",                   href: "#bienvenue" },
  { label: "Chambres",                  href: "#chambres" },
  { label: "Services",                  href: "#services" },
  { label: "Contact",                   href: "#contact" },
  { label: "Connexion",                 href: "#connection" },
  { label: "Mes Réservations",          href: "#mes-reservations" },
  { label: "Dashboard Réceptionniste",  href: "#receptionniste" },
  { label: "Administration",            href: "#admin" },
  { label: "Gestion contenu",           href: "#media" },
];

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout, isAuthenticated, role } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && role === 'receptionniste') {
      const fetchNotifications = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/reservations/notifications', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setNotificationCount(data.length);
        } catch (error) {
          console.error('Erreur notification:', error);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, role]);

  const shouldShow = (label) => {
    if (label === "Connexion"                && isAuthenticated)                           return false;
    if (label === "Mes Réservations"         && (!isAuthenticated || role !== 'client'))   return false;
    if (label === "Dashboard Réceptionniste" && (!isAuthenticated || role !== 'receptionniste')) return false;
    if (label === "Administration"           && (!isAuthenticated || role !== 'admin'))    return false;
    if (label === "Gestion contenu"          && (!isAuthenticated || role !== 'media'))    return false;
    return true;
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
      background: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: "68px",
      }}>

        {/* Logo */}
        <a href="/" style={{
          display: "flex", alignItems: "center", gap: "10px",
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem",
          color: "#fff", textDecoration: "none", letterSpacing: "0.5px",
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#e87722",
          }} />
          Hôtel Président
        </a>

        {/* Liens */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {navLinks.map(({ label, href }) => {
            if (!shouldShow(label)) return null;
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(label);
                }}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: currentPage === label ? 600 : 400,
                  color: currentPage === label ? "#e87722" : "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  borderBottom: currentPage === label ? "2px solid #e87722" : "2px solid transparent",
                  transition: "color 0.2s",
                }}
              >
                {label}
                {label === "Dashboard Réceptionniste" && notificationCount > 0 && (
                  <span style={{
                    marginLeft: "5px",
                    background: "#e74c3c",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}>
                    {notificationCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Utilisateur connecté */}
        {isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#fff", fontSize: "0.9rem" }}>
              Bonjour, {user?.prenom}
              {role === 'receptionniste' && notificationCount > 0 && (
                <span style={{
                  marginLeft: "8px",
                  background: "#e74c3c",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}>
                  {notificationCount}
                </span>
              )}
            </span>
            <button
              onClick={logout}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              Déconnexion
            </button>
          </div>
        )}

      </div>
    </header>
  );
}