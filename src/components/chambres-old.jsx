import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Chambres({ onNavigate }) {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedChambre, setSelectedChambre] = useState(null);
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    const fetchChambres = async () => {
      try {
        const response = await api.get("/chambres");
        setChambres(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des chambres");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChambres();
  }, []);

  const handleReservationClick = (chambre) => {
    if (!isAuthenticated) {
      onNavigate("Connexion");
      return;
    }

    if (role !== 'client') {
      alert("Seuls les clients peuvent réserver des chambres");
      return;
    }

    setSelectedChambre(chambre);
    setShowReservationModal(true);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        flexDirection: "column"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #e87722",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "1rem", color: "#666" }}>Chargement des chambres...</p>
      </div>
    );
  }

  return (
    <section style={{
      paddingTop: "100px",
      paddingBottom: "60px",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    }}>
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "2rem",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: "0.5rem",
        color: "#1a1a1a",
      }}>
        Nos Chambres
      </h2>
      <p style={{
        textAlign: "center",
        color: "#888",
        marginBottom: "3rem",
        fontSize: "1rem",
      }}>
        Choisissez le séjour qui vous correspond
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
      }}>
        {chambres.map((chambre, index) => (
          <div key={chambre.nom} style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            background: "#fff",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            animation: `luxuryFadeIn 0.6s ease-out ${index * 0.15}s both`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={chambre.image}
              alt={chambre.nom}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "1.25rem" }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "#1a1a1a",
              }}>
                {chambre.nom}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
                {chambre.description}
              </p>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{ fontWeight: 700, color: "#e87722", fontSize: "0.95rem" }}>
                  {chambre.prix}
                </span>
                <a href="#reservation" style={{
                  background: "#e87722",
                  color: "#fff",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}>
                  Réserver
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}