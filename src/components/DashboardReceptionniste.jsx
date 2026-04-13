import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function DashboardReceptionniste({ onNavigate }) {
  const { user, isAuthenticated, role } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || role !== 'receptionniste') {
      onNavigate("Accueil");
      return;
    }

    const fetchData = async () => {
      try {
        // Récupérer toutes les réservations
        const reservationsResponse = await api.get("/reservations");
        setReservations(reservationsResponse.data);

        // Récupérer les notifications non lues
        const notificationsResponse = await api.get("/reservations/notifications");
        setNotifications(notificationsResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, role, onNavigate]);

  const updateReservationStatut = async (reservationId, newStatut, note) => {
    try {
      await api.put(`/reservations/${reservationId}/statut`, {
        statut: newStatut,
        note_receptionniste: note
      });

      // Mettre à jour la réservation dans la liste
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, statut: newStatut, note_receptionniste: note }
            : res
        )
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/reservations/notifications/${notificationId}/lue`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err);
    }
  };

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
        <p style={{ marginTop: "1rem", color: "#666" }}>Chargement du dashboard...</p>
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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          Dashboard Réceptionniste
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

        {/* Section Notifications */}
        {notifications.length > 0 && (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "1rem"
            }}>
              Notifications ({notifications.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: "1rem",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    borderLeft: "4px solid #e87722",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: "#1a1a1a", fontSize: "0.9rem" }}>
                      {notification.message}
                    </p>
                    <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.8rem" }}>
                      {new Date(notification.date_envoi).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    style={{
                      background: "#e87722",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.background = "#cf6a1a"}
                    onMouseLeave={e => e.target.style.background = "#e87722"}
                  >
                    Marquer comme lu
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tableau des réservations */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflowX: "auto"
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: "1.5rem"
          }}>
            Toutes les réservations ({reservations.length})
          </h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Référence</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Client</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Chambre</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Dates</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Durée</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Prix</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Statut</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#e87722" }}>
                    {reservation.reference}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{reservation.client_prenom} {reservation.client_nom}</div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>{reservation.client_email}</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{reservation.chambre_titre}</div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>{reservation.chambre_numero}</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <div>{formatDate(reservation.date_arrivee)}</div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>au {formatDate(reservation.date_depart)}</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {calculateDuree(reservation.date_arrivee, reservation.date_depart)} nuit(s)
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>
                    {parseInt(reservation.prix_total).toLocaleString()} FCFA
                  </td>
                  <td style={{ padding: "1rem" }}>
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
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {reservation.statut === "en_attente" && (
                        <>
                          <button
                            onClick={() => updateReservationStatut(reservation.id, "confirmee", "Réservation confirmée")}
                            style={{
                              background: "#27ae60",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => updateReservationStatut(reservation.id, "annulee", "Réservation annulée")}
                            style={{
                              background: "#e74c3c",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {reservation.statut === "confirmee" && (
                        <>
                          <button
                            onClick={() => updateReservationStatut(reservation.id, "en_cours", "Client arrivé")}
                            style={{
                              background: "#3498db",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            En cours
                          </button>
                          <button
                            onClick={() => updateReservationStatut(reservation.id, "annulee", "Réservation annulée")}
                            style={{
                              background: "#e74c3c",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {reservation.statut === "en_cours" && (
                        <button
                          onClick={() => updateReservationStatut(reservation.id, "terminee", "Séjour terminé")}
                          style={{
                            background: "#95a5a6",
                            color: "#fff",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
