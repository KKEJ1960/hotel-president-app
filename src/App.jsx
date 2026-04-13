import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Chambres from "./components/chambres";
import Services from "./components/Services";
import Contact from "./components/contact";
import Connexion from "./components/connexion";
import MesReservations from "./components/MesReservations";
import DashboardReceptionniste from "./components/DashboardReceptionniste";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedia from "./components/DashboardMedia";

// Animation fadeIn dans index.css — à ajouter si pas déjà présent

function AppContent() {
  const [page, setPage] = useState("Accueil");
  const { isAuthenticated, role } = useAuth();

  const navigate = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  // Quand l'utilisateur se déconnecte, renvoie vers Accueil
  useEffect(() => {
    if (!isAuthenticated) {
      const pagesPrivees = [
        "Mes Réservations",
        "Dashboard Réceptionniste",
        "Administration",
        "Gestion contenu",
      ];
      // Ne pas rediriger si on est déjà sur la page de connexion
      if (pagesPrivees.includes(page) && page !== "Connexion") {
        setPage("Accueil");
      }
    }
  }, [isAuthenticated]);

  const renderPage = () => {
    switch (page) {

      // ── Pages publiques ──────────────────
      case "Accueil":   return <Hero />;
      case "Chambres":  return <Chambres />;
      case "Services":  return <Services />;
      case "Contact":   return <Contact />;
      case "Connexion": return <Connexion onNavigate={navigate} />;

      // ── Pages privées ────────────────────
      case "Mes Réservations":
        if (!isAuthenticated || role !== "client") {
          setPage("Connexion");
          return null;
        }
        return <MesReservations onNavigate={navigate} />;

      case "Dashboard Réceptionniste":
        if (!isAuthenticated || role !== "receptionniste") {
          setPage("Accueil");
          return null;
        }
        return <DashboardReceptionniste onNavigate={navigate} />;

      case "Administration":
        if (!isAuthenticated || role !== "admin") {
          setPage("Accueil");
          return null;
        }
        return <DashboardAdmin />;

      case "Gestion contenu":
        if (!isAuthenticated || role !== "media") {
          setPage("Accueil");
          return null;
        }
        return <DashboardMedia />;

      default:
        return <Hero />;
    }
  };

  return (
    <>
      <Navbar currentPage={page} onNavigate={navigate} />
      <div style={{ animation: "fadeIn 0.25s ease-in-out" }}>
        {renderPage()}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}