import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Connexion({ onNavigate }) {
  const { login, register, isAuthenticated } = useAuth();
  const [view, setView] = useState("login"); // "login" ou "register"
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    nom: "", prenom: "", telephone: "", email: "", mot_de_passe: ""
  });
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegisterPwd, setShowRegisterPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // S'assurer qu'on reste sur la page de connexion si on y est
  useEffect(() => {
    // Si on a une erreur, on s'assure de rester sur la connexion
    if (error) {
      // Pas de navigation automatique en cas d'erreur
      return;
    }
  }, [error]);

  // Handler pour la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!loginData.email || !loginData.password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      // Succès → redirige selon le rôle
      const role = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
      if (role === 'admin')          onNavigate('Administration');
      else if (role === 'receptionniste') onNavigate('Dashboard Réceptionniste');
      else if (role === 'media')     onNavigate('Gestion contenu');
      else                           onNavigate('Accueil');
    } catch (err) {
      // Échec → reste sur le formulaire, affiche l'erreur
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
      // NE PAS appeler onNavigate ici
    } finally {
      setLoading(false);
    }
  };

  // Handler pour l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!registerData.nom || !registerData.prenom || !registerData.email || !registerData.telephone || !registerData.mot_de_passe) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    // Concaténer +225 avec le numéro de téléphone
    const dataToSend = {
      ...registerData,
      telephone: registerData.telephone ? `+225${registerData.telephone}` : ''
    };

    const result = await register(dataToSend);
    
    if (result.success) {
      setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setTimeout(() => {
        setView("login");
        setRegisterData({
          nom: "", prenom: "", telephone: "", email: "", mot_de_passe: ""
        });
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <section style={{
      minHeight: "100vh",
      paddingTop: "90px",
      background: "linear-gradient(160deg, #fdf6f0 0%, #fff 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "90px 1.5rem 60px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "460px",
      }}>

        {/* Logo / Titre haut */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="https://tse1.explicit.bing.net/th/id/OIP.oIzRpWXFguAVQlus6yfReAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Hôtel Président"
            style={{
              width: "80px",
              height: "100px",
              borderRadius: "30px",
              objectFit: "cover",
              margin: "0 auto 1rem",
              display: "block",
            }}
          />
          <span style={{
            fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.18em", color: "#e87722",
            textTransform: "uppercase",
          }}>
          
          </span>
        </div>

        {/* Carte formulaire */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #f0ece8",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          padding: "2.5rem",
        }}>

          {/* ───── VUE CONNEXION ───── */}
          {view === "login" && (
            <>
              <h2 style={formTitle}>Connexion</h2>
              <p style={formSubtitle}>Bienvenue ! Connectez-vous à votre espace.</p>

              <div style={fieldGroup}>
                <label style={labelStyle}>Adresse e-mail</label>
                <input
                  type="email"
                  placeholder=""
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  style={input}
                  onFocus={e => e.target.style.borderColor = "#e87722"}
                  onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                />
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showLoginPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    style={{ ...input, paddingRight: "3rem" }}
                    onFocus={e => e.target.style.borderColor = "#e87722"}
                    onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                  />
                  <button
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                    style={eyeBtn}
                  >
                    {showLoginPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                <span style={linkStyle}>Mot de passe oublié ?</span>
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  background: "rgba(239,68,68,0.1)",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  textAlign: "center",
                }}>
                  ❌ {error}
                </div>
              )}

              <button 
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  background: "#e87722", color: "#fff",
                  border: "none", borderRadius: "10px",
                  fontSize: "0.95rem", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>

              <div style={divider}>
                <span style={dividerLine} />
                <span style={{ color: "#bbb", fontSize: "0.8rem", padding: "0 1rem" }}>ou</span>
                <span style={dividerLine} />
              </div>

              <p style={{ textAlign: "center", fontSize: "0.88rem", color: "#888", margin: 0 }}>
                Pas encore de compte ?{" "}
                <span
                  onClick={() => setView("register")}
                  style={linkStyle}
                >
                  Créer un compte
                </span>
              </p>
            </>
          )}

          {/* ───── VUE INSCRIPTION ───── */}
          {view === "register" && (
            <>
              <h2 style={formTitle}>Créer un compte</h2>
              <p style={formSubtitle}>Rejoignez l'Hôtel Président en quelques secondes.</p>

              {/* Nom & Prénom côte à côte */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Nom</label>
                  <input
                    type="text"
                    placeholder=""
                    value={registerData.nom}
                    onChange={e => setRegisterData({ ...registerData, nom: e.target.value })}
                    style={input}
                    onFocus={e => e.target.style.borderColor = "#e87722"}
                    onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                  />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Prénom</label>
                  <input
                    type="text"
                    placeholder=""
                    value={registerData.prenom}
                    onChange={e => setRegisterData({ ...registerData, prenom: e.target.value })}
                    style={input}
                    onFocus={e => e.target.style.borderColor = "#e87722"}
                    onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                  />
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Numéro de téléphone</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{
                    ...input,
                    width: "80px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 600, color: "#1a1a1a", fontSize: "0.85rem",
                    background: "#fafafa",
                  }}>
                    🇨🇮 +225
                  </div>
                  <input
                    type="tel"
                    placeholder=""
                    value={registerData.telephone}
                    onChange={e => setRegisterData({ ...registerData, telephone: e.target.value })}
                    style={{ ...input, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = "#e87722"}
                    onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                  />
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Adresse e-mail</label>
                <input
                  type="email"
                  placeholder=""
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                  style={input}
                  onFocus={e => e.target.style.borderColor = "#e87722"}
                  onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                />
                <p style={hint}>
                   Un e-mail de vérification vous sera envoyé.
                </p>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showRegisterPwd ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    value={registerData.mot_de_passe}
                    onChange={e => setRegisterData({ ...registerData, mot_de_passe: e.target.value })}
                    style={{ ...input, paddingRight: "3rem" }}
                    onFocus={e => e.target.style.borderColor = "#e87722"}
                    onBlur={e => e.target.style.borderColor = "#e8e4e0"}
                  />
                  <button
                    onClick={() => setShowRegisterPwd(!showRegisterPwd)}
                    style={eyeBtn}
                  >
                    {showRegisterPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button 
                style={{ ...submitBtn, marginTop: "0.5rem" }}
                onMouseEnter={e => e.currentTarget.style.background = "#cf6a1a"}
                onMouseLeave={e => e.currentTarget.style.background = "#e87722"}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>

              {error && (
                <div style={{ 
                  color: "#e74c3c", 
                  fontSize: "0.85rem", 
                  textAlign: "center", 
                  marginTop: "1rem",
                  padding: "0.5rem",
                  background: "#fee",
                  borderRadius: "8px",
                  border: "1px solid #fcc"
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ 
                  color: "#27ae60", 
                  fontSize: "0.85rem", 
                  textAlign: "center", 
                  marginTop: "1rem",
                  padding: "0.5rem",
                  background: "#efe",
                  borderRadius: "8px",
                  border: "1px solid #cfc"
                }}>
                  {success}
                </div>
              )}

              <p style={{ textAlign: "center", fontSize: "0.88rem", color: "#888", margin: "1.2rem 0 0" }}>
                Déjà un compte ?{" "}
                <span
                  onClick={() => setView("login")}
                  style={linkStyle}
                >
                  Se connecter
                </span>
              </p>
            </>
          )}

        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center", fontSize: "0.75rem",
          color: "#ccc", marginTop: "1.5rem"
        }}>
          
        </p>

      </div>
    </section>
  );
}

/* ── Styles ── */
const formTitle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: "1.6rem", fontWeight: 700,
  color: "#1a1a1a", margin: "0 0 0.4rem",
};
const formSubtitle = {
  fontSize: "0.88rem", color: "#aaa",
  margin: "0 0 1.8rem", lineHeight: 1.5,
};
const fieldGroup = { marginBottom: "1.2rem" };
const labelStyle = {
  display: "block", fontSize: "0.78rem",
  fontWeight: 600, color: "#555",
  marginBottom: "6px", letterSpacing: "0.04em",
  textTransform: "uppercase",
};
const input = {
  width: "100%", padding: "11px 14px",
  borderRadius: "10px", fontSize: "0.92rem",
  border: "1.5px solid #e8e4e0",
  outline: "none", color: "#1a1a1a",
  background: "#fafafa",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const eyeBtn = {
  position: "absolute", right: "12px",
  top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none",
  cursor: "pointer", fontSize: "1rem", padding: 0,
};
const submitBtn = {
  width: "100%", padding: "13px",
  background: "#e87722", color: "#fff",
  border: "none", borderRadius: "10px",
  fontSize: "0.95rem", fontWeight: 700,
  cursor: "pointer", transition: "background 0.2s",
  fontFamily: "'Syne', sans-serif",
};
const linkStyle = {
  color: "#e87722", fontWeight: 600,
  cursor: "pointer", textDecoration: "underline",
};
const divider = {
  display: "flex", alignItems: "center",
  margin: "1.4rem 0",
};
const dividerLine = {
  flex: 1, height: "1px",
  background: "#f0ece8", display: "block",
};
const hint = {
  fontSize: "0.75rem", color: "#bbb",
  margin: "5px 0 0", lineHeight: 1.5,
};