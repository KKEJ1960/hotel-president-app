import { useState, useEffect } from "react";
import api from "../api/axios";
import ImageUpload from "./ImageUpload";

export default function DashboardMedia() {
  const [onglet, setOnglet]     = useState("chambres");
  const [chambres, setChambres] = useState([]);
  const [services, setServices] = useState([]);
  const [types, setTypes]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState(null);
  const [modal, setModal]       = useState(null); // { type: 'chambre'|'service', data: {} }

  useEffect(() => {
    chargerChambres();
    chargerServices();
    chargerTypes();
  }, []);

  const chargerChambres = async () => {
    try {
      console.log('Token:', localStorage.getItem('token'));
      console.log('Appel GET /chambres');
      const res = await api.get('/chambres');
      console.log('Réponse chambres:', res);
      setChambres(res.data);
    } catch (err) {
      console.error('Erreur chambres:', err);
      showMessage("error", err.response?.data?.message || err.message || "Erreur chargement chambres");
    }
  };

  const chargerServices = async () => {
    try {
      console.log('Token:', localStorage.getItem('token'));
      console.log('Appel GET /services');
      const res = await api.get('/services');
      console.log('Réponse services:', res);
      setServices(res.data);
    } catch (err) {
      console.error('Erreur services:', err);
      showMessage("error", err.response?.data?.message || err.message || "Erreur chargement services");
    }
  };

  const chargerTypes = async () => {
    try {
      console.log('Token:', localStorage.getItem('token'));
      console.log('Appel GET /chambres/types');
      const res = await api.get('/chambres/types');
      console.log('Réponse types:', res);
      setTypes(res.data);
    } catch {}
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const supprimerChambre = async (id) => {
    if (!window.confirm("Supprimer cette chambre ?")) return;
    try {
      await api.delete(`/chambres/${id}`);
      showMessage("success", "Chambre supprimée");
      chargerChambres();
    } catch { showMessage("error", "Erreur lors de la suppression"); }
  };

  return (
    <section style={{ paddingTop: "90px", minHeight: "100vh", background: "#f8f6f3", padding: "90px 2rem 60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.3rem" }}>
          Gestion du contenu
        </h2>
        <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Gérez les chambres, services et visuels de l'hôtel
        </p>

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

        {/* Onglets */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {[
            { key: "chambres", label: "Chambres" },
            { key: "services", label: "Services" },
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

        {/* ── ONGLET CHAMBRES ── */}
        {onglet === "chambres" && (
          <div>
            <button onClick={() => setModal({ type: "chambre", data: { numero:"", id_type:"", etage:1, titre:"", description:"", photo_url:"", superficie_m2:"", prix_nuit:"", disponible:true } })}
              style={btnOrange}>
              + Ajouter une chambre
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
              {chambres.map(c => (
                <div key={c.id} style={{
                  background: "#fff", 
                  borderRadius: "14px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }
                }}>
                  <div style={{ position: "relative" }}>
                    <img src={c.photo_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"}
                      alt={c.titre} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                    <span style={{
                      position: "absolute", top: 10, right: 10,
                      padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700,
                      background: c.disponible ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)",
                      color: "#fff",
                    }}>
                      {c.disponible ? "Disponible" : "Occupée"}
                    </span>
                  </div>
                  <div style={{ padding: "1.1rem" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#1a1a1a", fontSize: "0.95rem" }}>{c.titre || c.numero}</p>
                    <p style={{ margin: "0 0 10px", fontSize: "0.8rem", color: "#aaa" }}>Chambre {c.numero} • Étage {c.etage}</p>
                    <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#e87722" }}>{Number(c.prix_nuit).toLocaleString()} FCFA / nuit</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => setModal({ type: "chambre", data: { ...c } })} style={btnEdit}>
                        Modifier
                      </button>
                      <button onClick={() => supprimerChambre(c.id)} style={btnDelete}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ONGLET SERVICES ── */}
        {onglet === "services" && (
          <div>
            <button onClick={() => setModal({ type: "service", data: { nom:"", description:"", photo_url:"", horaires:"", prix:0 } })}
              style={btnOrange}>
              + Ajouter un service
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
              {services.map(s => (
                <div key={s.id} style={{ 
                  background: "#fff", 
                  borderRadius: "14px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }
                }}>
                  <img src={s.photo_url || "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400"}
                    alt={s.nom} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "1.1rem" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#1a1a1a" }}>{s.nom}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "0.82rem", color: "#888" }}>{s.horaires}</p>
                    <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#e87722" }}>
                      {s.prix > 0 ? `${Number(s.prix).toLocaleString()} FCFA` : "Inclus"}
                    </p>
                    <button onClick={() => setModal({ type: "service", data: { ...s } })} style={btnEdit}>
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL CHAMBRE / SERVICE ── */}
      {modal && (
        <ModalForm
          modal={modal}
          types={types}
          onClose={() => setModal(null)}
          onSuccess={(msg) => {
            showMessage("success", msg);
            setModal(null);
            chargerChambres();
            chargerServices();
          }}
          onError={(msg) => showMessage("error", msg)}
        />
      )}
    </section>
  );
}

function ModalForm({ modal, types, onClose, onSuccess, onError }) {
  const [form, setForm]     = useState(modal.data);
  const [loading, setLoading] = useState(false);
  const isChambre = modal.type === "chambre";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isChambre) {
        if (form.id) {
          await api.put(`/chambres/${form.id}`, form);
          onSuccess("Chambre modifiée avec succès");
        } else {
          await api.post('/chambres', form);
          onSuccess("Chambre créée avec succès");
        }
      } else {
        if (form.id) {
          await api.put(`/services/${form.id}`, form);
          onSuccess("Service modifié avec succès");
        } else {
          await api.post('/services', form);
          onSuccess("Service créé avec succès");
        }
      }
    } catch (err) {
        // Le backend retourne parfois "error" et parfois "message"
        onError(err.response?.data?.error || err.response?.data?.message || "Erreur de connexion au serveur");
      } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "2rem",
        width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#1a1a1a" }}>
            {form.id ? "Modifier" : "Ajouter"} {isChambre ? "une chambre" : "un service"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#aaa" }}>✕</button>
        </div>

        {isChambre ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Numéro" value={form.numero} onChange={v => setForm({ ...form, numero: v })} placeholder="" />
              <Field label="Étage"  value={form.etage}  onChange={v => setForm({ ...form, etage: v })}  placeholder="" type="number" />
            </div>
            <div style={fg}>
              <label style={lbl}>Type de chambre</label>
              <select value={form.id_type} onChange={e => setForm({ ...form, id_type: e.target.value })} style={inp}>
                <option value="">-- Choisir --</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.libelle}</option>)}
              </select>
            </div>
            <Field label="Titre"         value={form.titre}        onChange={v => setForm({ ...form, titre: v })}        placeholder="" />
            <Field label="Description"   value={form.description}  onChange={v => setForm({ ...form, description: v })}  placeholder="" textarea />
            <ImageUpload 
              value={form.photo_url} 
              onChange={v => setForm({ ...form, photo_url: v })} 
              placeholder="" 
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Superficie (m²)" value={form.superficie_m2} onChange={v => setForm({ ...form, superficie_m2: v })} type="number" placeholder="" />
              <Field label="Prix / nuit (FCFA)" value={form.prix_nuit} onChange={v => setForm({ ...form, prix_nuit: v })} type="number" placeholder="" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
              <input type="checkbox" checked={form.disponible} onChange={e => setForm({ ...form, disponible: e.target.checked })} id="dispo" />
              <label htmlFor="dispo" style={{ fontSize: "0.88rem", color: "#555", fontWeight: 500 }}>Chambre disponible</label>
            </div>
          </>
        ) : (
          <>
            <Field label="Nom du service" value={form.nom}         onChange={v => setForm({ ...form, nom: v })}         placeholder="Piscine" />
            <Field label="Description"    value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Description..." textarea />
            <ImageUpload 
              value={form.photo_url} 
              onChange={v => setForm({ ...form, photo_url: v })} 
              placeholder="https://example.com/image.jpg ou utilisez l'onglet Appareil" 
            />
            <Field label="Horaires"       value={form.horaires}    onChange={v => setForm({ ...form, horaires: v })}    placeholder="7h – 20h" />
            <Field label="Prix (FCFA, 0 = inclus)" value={form.prix} onChange={v => setForm({ ...form, prix: v })} type="number" placeholder="0" />
          </>
        )}

        {/* Aperçu photo */}
        {(form.photo_url) && (
          <div style={{ marginBottom: "1.2rem" }}>
            <p style={{ ...lbl, marginBottom: "6px" }}>Aperçu</p>
            <img src={form.photo_url} alt="aperçu" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px" }}
              onError={e => e.target.style.display = "none"} />
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "13px", background: "#e87722", color: "#fff",
          border: "none", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700,
          cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Enregistrement..." : (form.id ? "Enregistrer les modifications" : "Créer")}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", textarea }) {
  const style = { ...inp, ...(textarea ? { height: "80px", resize: "vertical" } : {}) };
  return (
    <div style={fg}>
      <label style={lbl}>{label}</label>
      {textarea
        ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style}
            onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
        : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style}
            onFocus={e => e.target.style.borderColor="#e87722"} onBlur={e => e.target.style.borderColor="#e8e4e0"} />
      }
    </div>
  );
}

const fg  = { marginBottom: "1.1rem" };
const lbl = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" };
const inp = { width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "0.9rem", border: "1.5px solid #e8e4e0", outline: "none", color: "#1a1a1a", background: "#fafafa", boxSizing: "border-box", transition: "border-color 0.2s" };
const btnOrange = { padding: "10px 20px", background: "#e87722", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" };
const btnEdit   = { flex: 1, padding: "7px", background: "rgba(232,119,34,0.1)", color: "#e87722", border: "none", borderRadius: "7px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" };
const btnDelete = { flex: 1, padding: "7px", background: "rgba(239,68,68,0.1)",  color: "#dc2626", border: "none", borderRadius: "7px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" };