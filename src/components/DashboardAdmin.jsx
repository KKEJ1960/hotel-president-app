import { useState, useEffect } from "react";
import api from "../api/axios";

const ROLES_COLORS = {
  client:         { bg: "rgba(100,100,100,0.1)", color: "#555" },
  receptionniste: { bg: "rgba(24,119,242,0.1)",  color: "#1877F2" },
  media:          { bg: "rgba(139,92,246,0.1)",  color: "#7c3aed" },
  admin:          { bg: "rgba(232,119,34,0.1)",  color: "#e87722" },
};

export default function DashboardAdmin() {
  const [onglet, setOnglet]             = useState("comptes");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filtre, setFiltre]             = useState("Tous");
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState(null);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", role: "receptionniste"
  });

  useEffect(() => { chargerUtilisateurs(); }, []);

  const chargerUtilisateurs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/utilisateurs');
      setUtilisateurs(res.data);
    } catch { setMessage({ type: "error", text: "Erreur lors du chargement" }); }
    finally { setLoading(false); }
  };

  const toggleStatut = async (id, actif) => {
    try {
      await api.put(`/admin/utilisateurs/${id}/statut`, { actif: !actif });
      setMessage({ type: "success", text: `Compte ${!actif ? "activé" : "désactivé"}` });
      chargerUtilisateurs();
    } catch { setMessage({ type: "error", text: "Erreur lors de la mise à jour" }); }
  };

  const creerStaff = async () => {
    setLoading(true);
    try {
      await api.post('/admin/utilisateurs/creer-staff', {
        ...form, telephone: '+225' + form.telephone
      });
      setMessage({ type: "success", text: "Compte staff créé avec succès" });
      setForm({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", role: "receptionniste" });
      chargerUtilisateurs();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Erreur serveur" });
    } finally { setLoading(false); }
  };

  const filtres = ["Tous", "client", "receptionniste", "media", "admin"];
  const utilisateursFiltres = filtre === "Tous"
    ? utilisateurs
    : utilisateurs.filter(u => u.role === filtre);

  return (
    <section style={{ paddingTop: "90px", minHeight: "100vh", background: "#f8f6f3", padding: "90px 2rem 60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Titre */}
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.3rem" }}>
          Administration
        </h2>
        <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Gestion des comptes et supervision générale
        </p>

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "1.5rem",
            background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: message.type === "success" ? "#059669" : "#dc2626",
            fontSize: "0.88rem", fontWeight: 500,
          }}>
            {message.text}
          </div>
        )}

        {/* Onglets internes */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {[
            { key: "comptes", label: "Gestion des comptes" },
            { key: "creer",   label: "+ Créer un compte staff" },
          ].map(o => (
            <button key={o.key} onClick={() => setOnglet(o.key)} style={{
              padding: "9px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontSize: "0.85rem", fontWeight: 600,
              background: onglet === o.key ? "#e87722" : "#fff",
              color:      onglet === o.key ? "#fff"    : "#888",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
              transition: "all 0.2s",
            }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* ── ONGLET COMPTES ── */}
        {onglet === "comptes" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

            {/* Filtres */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {filtres.map(f => (
                <button key={f} onClick={() => setFiltre(f)} style={{
                  padding: "6px 16px", borderRadius: "50px", border: "none", cursor: "pointer",
                  fontSize: "0.8rem", fontWeight: 600,
                  background: filtre === f ? "#1a1a1a" : "#f0ece8",
                  color:      filtre === f ? "#fff"    : "#888",
                  transition: "all 0.2s",
                }}>
                  {f === "Tous" ? "Tous" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>Chargement...</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0ece8" }}>
                      {["Nom & Prénom", "Email", "Téléphone", "Rôle", "Statut", "Créé le", "Actions"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#aaa", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateursFiltres.map(u => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f8f6f3" }}>
                        <td style={{ padding: "12px" }}>
                          <p style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>{u.prenom} {u.nom}</p>
                        </td>
                        <td style={{ padding: "12px", color: "#555" }}>{u.email}</td>
                        <td style={{ padding: "12px", color: "#555" }}>{u.telephone || "—"}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600,
                            background: ROLES_COLORS[u.role]?.bg,
                            color:      ROLES_COLORS[u.role]?.color,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600,
                            background: u.actif ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            color:      u.actif ? "#059669" : "#dc2626",
                          }}>
                            {u.actif ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#aaa", fontSize: "0.8rem" }}>
                          {new Date(u.date_creation).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button onClick={() => toggleStatut(u.id, u.actif)} style={{
                            padding: "6px 14px", borderRadius: "6px", border: "none", cursor: "pointer",
                            fontSize: "0.8rem", fontWeight: 600,
                            background: u.actif ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                            color:      u.actif ? "#dc2626" : "#059669",
                            transition: "all 0.2s",
                          }}>
                            {u.actif ? "Désactiver" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {utilisateursFiltres.length === 0 && (
                  <p style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>Aucun utilisateur trouvé</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ONGLET CRÉER STAFF ── */}
        {onglet === "creer" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", maxWidth: "500px" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem" }}>
              Nouveau compte staff
            </h3>

            {/* Rôle */}
            <div style={fg}>
              <label style={lbl}>Rôle</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inp}>
                <option value="receptionniste">Réceptionniste</option>
                <option value="media">Compte Média</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fg}>
                <label style={lbl}>Nom</label>
                <input style={inp} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                  onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
              </div>
              <div style={fg}>
                <label style={lbl}>Prénom</label>
                <input style={inp} value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                  onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
              </div>
            </div>

            <div style={fg}>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
            </div>

            <div style={fg}>
              <label style={lbl}>Téléphone</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div style={{ ...inp, width: "90px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", fontWeight: 600, fontSize: "0.82rem" }}>
                  🇨🇮 +225
                </div>
                <input style={{ ...inp, flex: 1 }} value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                  onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
              </div>
            </div>

            <div style={fg}>
              <label style={lbl}>Mot de passe</label>
              <input style={inp} type="password" value={form.mot_de_passe} onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
                onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
            </div>

            <button onClick={creerStaff} disabled={loading} style={{
              width: "100%", padding: "13px", background: "#e87722", color: "#fff",
              border: "none", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Syne',sans-serif", marginTop: "0.5rem",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

const fg  = { marginBottom: "1.1rem" };
const lbl = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" };
const inp = { width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "0.9rem", border: "1.5px solid #e8e4e0", outline: "none", color: "#1a1a1a", background: "#fafafa", boxSizing: "border-box", transition: "border-color 0.2s" };