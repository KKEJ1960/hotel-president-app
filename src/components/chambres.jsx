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
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          Nos Chambres
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

        {chambres.length === 0 && !error && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <p style={{
              fontSize: "1.1rem",
              color: "#666"
            }}>
              Aucune chambre disponible pour le moment.
            </p>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2rem"
        }}>
          {chambres.map((chambre, index) => (
            <div
              key={chambre.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                animation: `luxuryFadeIn 0.7s ease-out ${index * 0.15}s both`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 50px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.08)";
              }}
            >
              {chambre.photo_url && (
                <img
                  src={chambre.photo_url}
                  alt={chambre.titre}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover"
                  }}
                />
              )}

              <div style={{ padding: "2rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: "0 0 0.5rem 0"
                    }}>
                      {chambre.titre}
                    </h3>
                    <p style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      margin: "0",
                      fontStyle: "italic"
                    }}>
                      {chambre.numero}
                    </p>
                  </div>
                  <div style={{
                    background: "#e87722",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}>
                    {chambre.type_libelle}
                  </div>
                </div>

                {chambre.description && (
                  <p style={{
                    color: "#666",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem"
                  }}>
                    {chambre.description}
                  </p>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem"
                }}>
                  <div>
                    {chambre.superficie_m2 && (
                      <p style={{
                        color: "#666",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0"
                      }}>
                        {chambre.superficie_m2} m²
                      </p>
                    )}
                    {chambre.type_capacite && (
                      <p style={{
                        color: "#666",
                        fontSize: "0.85rem",
                        margin: 0
                      }}>
                        {chambre.type_capacite} personne(s)
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#e87722",
                      margin: 0
                    }}>
                      {parseInt(chambre.prix_nuit).toLocaleString()} FCFA
                    </p>
                    <p style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      margin: 0
                    }}>
                      / nuit
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleReservationClick(chambre)}
                  style={{
                    width: "100%",
                    background: "#e87722",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    fontFamily: "'Syne', sans-serif"
                  }}
                  onMouseEnter={e => e.target.style.background = "#cf6a1a"}
                  onMouseLeave={e => e.target.style.background = "#e87722"}
                >
                  {isAuthenticated && role === 'client' ? "Réserver" : "Connectez-vous pour réserver"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de réservation */}
      {showReservationModal && selectedChambre && (
        <ReservationModal
          chambre={selectedChambre}
          onClose={() => setShowReservationModal(false)}
          onSuccess={() => setShowReservationModal(false)}
        />
      )}

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

// Composant Modal de réservation
function ReservationModal({ chambre, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    date_arrivee: "",
    date_depart: "",
    nombre_personnes: 1,
    commentaire_client: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dispoStatus, setDispoStatus] = useState(null); // null = pas encore vérifié

  const calculateNights = () => {
    if (!formData.date_arrivee || !formData.date_depart) return 0;
    const arrivee = new Date(formData.date_arrivee);
    const depart = new Date(formData.date_depart);
    const diffTime = depart - arrivee;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * parseFloat(chambre.prix_nuit);
  };

  // Vérifie la dispo dès que les deux dates sont saisies
  useEffect(() => {
    if (formData.date_arrivee && formData.date_depart && formData.date_arrivee < formData.date_depart) {
      checkDispo();
    } else {
      setDispoStatus(null);
    }
  }, [formData.date_arrivee, formData.date_depart]);

  const checkDispo = async () => {
    if (!formData.date_arrivee || !formData.date_depart) {
      setDispoStatus(1); // État 1 : pas de dates
      setMessageDispo("Veuillez sélectionner des dates pour vérifier la disponibilité");
      return;
    }

    try {
      const res = await api.get(
        `/chambres/${chambre.id}/disponibilite`,
        { params: { date_arrivee: formData.date_arrivee, date_depart: formData.date_depart } }
      );
      setDispoStatus(res.data);
    } catch (err) {
      setDispoStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.date_arrivee || !formData.date_depart) {
      setError("Veuillez remplir toutes les dates");
      setLoading(false);
      return;
    }

    const arrivee = new Date(formData.date_arrivee);
    const depart = new Date(formData.date_depart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrivee <= today) {
      setError("La date d'arrivée doit être dans le futur");
      setLoading(false);
      return;
    }

    if (depart <= arrivee) {
      setError("La date de départ doit être postérieure à la date d'arrivée");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/reservations", {
        ...formData,
        id_chambre: chambre.id
      });
      setSuccess(`Réservation ${response.data.reservation.reference} créée avec succès !`);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Cette chambre n'est pas disponible pour les dates sélectionnées");
      } else {
        setError("Erreur lors de la réservation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "2rem",
        maxWidth: "500px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "1rem"
        }}>
          Réservation - {chambre.titre}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Date d'arrivée
            </label>
            <input
              type="date"
              value={formData.date_arrivee}
              onChange={e => setFormData({ ...formData, date_arrivee: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Date de départ
            </label>
            <input
              type="date"
              value={formData.date_depart}
              onChange={e => setFormData({ ...formData, date_depart: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Nombre de personnes
            </label>
            <input
              type="number"
              min="1"
              value={formData.nombre_personnes}
              onChange={e => setFormData({ ...formData, nombre_personnes: parseInt(e.target.value) })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Commentaire (optionnel)
            </label>
            <textarea
              value={formData.commentaire_client}
              onChange={e => setFormData({ ...formData, commentaire_client: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                minHeight: "80px",
                resize: "vertical"
              }}
            />
          </div>

          {/* État 1 : dates pas encore saisies */}
          {(!formData.date_arrivee || !formData.date_depart) && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem",
              background: "rgba(100,100,100,0.08)", color: "#888",
              fontSize: "0.85rem", fontWeight: 500,
            }}>
              Sélectionnez vos dates d'arrivée et de départ pour vérifier la disponibilité
            </div>
          )}

          {/* État 2 : dates saisies et chambre disponible */}
          {dispoStatus?.disponible === true && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem",
              background: "rgba(16,185,129,0.1)", color: "#059669",
              fontSize: "0.85rem", fontWeight: 500,
            }}>
              Chambre disponible pour ces dates — vous pouvez réserver !
            </div>
          )}

          {/* État 3 : dates saisies mais chambre occupée */}
          {dispoStatus?.disponible === false && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem",
              background: "rgba(232,119,34,0.1)", color: "#e87722",
              fontSize: "0.85rem", fontWeight: 500,
              lineHeight: 1.6,
            }}>
              {dispoStatus.message}
              <br />
              <strong>
                Disponible à partir du{" "}
                {new Date(dispoStatus.libre_le).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </strong>
              <br />
              <span style={{ fontSize: "0.8rem", color: "#b05a10" }}>
                Vous pouvez choisir des dates à partir de cette date pour réserver cette chambre.
              </span>
            </div>
          )}

          {calculateNights() > 0 && (
            <div style={{
              background: "#f9f9f9",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Prix par nuit:</span>
                <span>{parseInt(chambre.prix_nuit).toLocaleString()} FCFA</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Nombre de nuits:</span>
                <span>{calculateNights()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", color: "#e87722" }}>
                <span>Total:</span>
                <span>{calculateTotal().toLocaleString()} FCFA</span>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              color: "#e74c3c",
              background: "#fee",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #fcc"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              color: "#27ae60",
              background: "#efe",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #cfc"
            }}>
              {success}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={!dispoStatus?.disponible || loading}
              style={{
                flex: 1,
                padding: "14px",
                background: !dispoStatus?.disponible ? "#ccc" : "#e87722",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: !dispoStatus?.disponible ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => {
                if (dispoStatus?.disponible) e.target.style.background = "#cf6a1a";
              }}
              onMouseLeave={e => {
                if (dispoStatus?.disponible) e.target.style.background = "#e87722";
              }}
            >
              {loading
                ? "Réservation en cours..."
                : !formData.date_arrivee || !formData.date_depart
                  ? "ð Sélectionnez vos dates"
                  : dispoStatus === null
                    ? "Vérification en cours..."
                    : dispoStatus.disponible
                      ? "â Confirmer la réservation"
                      : "â Dates non disponibles â choisissez d'autres dates"
              }
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "#ccc",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
