import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function MesReservations({ onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("Connexion");
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations/mes-reservations");
        setReservations(response.data);
      } catch (err) {
        setError("Erreur lors du chargement de vos réservations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, onNavigate]);

  const getStatutColor = (statut) => {
    switch (statut) {
      case "en_attente": return "#f39c12";
      case "confirmee": return "#27ae60";
      case "en_cours": return "#3498db";
      case "terminee": return "#95a5a6";
      case "annulee": return "#e74c3c";
      default: return "#7f8c8d";
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case "en_attente": return "En attente";
      case "confirmee": return "Confirmée";
      case "en_cours": return "En cours";
      case "terminee": return "Terminée";
      case "annulee": return "Annulée";
      default: return statut;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDuree = (arrivee, depart) => {
    const dateArrivee = new Date(arrivee);
    const dateDepart = new Date(depart);
    const diffTime = Math.abs(dateDepart - dateArrivee);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <p style={{ marginTop: "1rem", color: "#666" }}>Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <section style={{
      minHeight: "100vh",
      paddingTop: "100px",
      padding: "2rem",
      background: "linear-gradient(160deg, #fdf6f0 0%, #fff 60%)"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          Mes Réservations
        </h1>

        {error && (
          <div style={{
            background: "#fee",
            color: "#e74c3c",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "center",
            border: "1px solid #fcc"
          }}>
            {error}
          </div>
        )}

        {reservations.length === 0 && !error && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <p style={{
              fontSize: "1.1rem",
              color: "#666",
              marginBottom: "1.5rem"
            }}>
              Vous n'avez aucune réservation pour le moment.
            </p>
            <button
              onClick={() => onNavigate("Chambres")}
              style={{
                background: "#e87722",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.target.style.background = "#cf6a1a"}
              onMouseLeave={e => e.target.style.background = "#e87722"}
            >
              Réserver une chambre
            </button>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2rem"
        }}>
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {reservation.chambre_photo && (
                <img
                  src={reservation.chambre_photo}
                  alt={reservation.chambre_titre}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                />
              )}
              
              <div style={{ padding: "1.5rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    margin: 0
                  }}>
                    {reservation.chambre_titre}
                  </h3>
                  <span style={{
                    background: getStatutColor(reservation.statut),
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}>
                    {getStatutText(reservation.statut)}
                  </span>
                </div>

                <div style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#e87722",
                  marginBottom: "1rem"
                }}>
                  {reservation.reference}
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <strong>Arrivée:</strong><br />
                    {formatDate(reservation.date_arrivee)}
                  </div>
                  <div>
                    <strong>Départ:</strong><br />
                    {formatDate(reservation.date_depart)}
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f0f0f0"
                }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {calculateDuree(reservation.date_arrivee, reservation.date_depart)} nuits
                    </div>
                    <div style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#1a1a1a"
                    }}>
                      {parseInt(reservation.prix_total).toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                {reservation.commentaire_client && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "#f9f9f9",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    color: "#666"
                  }}>
                    <strong>Note:</strong> {reservation.commentaire_client}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
    </section>
  );
}
