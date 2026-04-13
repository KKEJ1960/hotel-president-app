export default function Contact() {
  return (
    <section style={{
      minHeight: "100vh",
      paddingTop: "100px",
      paddingBottom: "80px",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      background: "linear-gradient(160deg, #fdf6f0 0%, #fff 60%)",
    }}>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#e87722",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            Hôtel Président • Yamoussoukro
          </span>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "2.4rem",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 1rem",
            lineHeight: 1.2,
          }}>
            Restons en contact
          </h2>
          <div style={{
            width: "48px", height: "3px",
            background: "#e87722",
            margin: "0 auto 1rem",
            borderRadius: "2px",
          }} />
          <p style={{
            color: "#888",
            fontSize: "1rem",
            lineHeight: 1.7,
            maxWidth: "420px",
            margin: "0 auto",
          }}>
            Notre équipe est à votre disposition pour toute question ou réservation.
          </p>
        </div>

        {/* Cartes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { href: "tel:+2252730646464", color: "#e87722", bg: "rgba(232,119,34,0.12)", label: "Appelez-nous", value: "+225 27 30 64 64 64", action: "Appeler", icon: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" },
            { href: "https://www.hotel.ci", color: "#E1306C", bg: "rgba(225,48,108,0.1)", label: "Instagram", value: "www.hotel.ci", action: "Visiter", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
            { href: "https://www.facebook.com", color: "#1877F2", bg: "rgba(24,119,242,0.1)", label: "Facebook", value: "Hôtel Président de Yamoussoukro (Officiel)", action: "Suivre", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
            { href: "https://maps.google.com/?q=Quartier+Millionnaire+Yamoussoukro", color: "#0f9d58", bg: "rgba(15,157,88,0.1)", label: "Notre adresse", value: "Quartier Millionnaire, Yamoussoukro", action: "Itinéraire", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" }
          ].map((item, index) => (
            <a key={index} href={item.href} target={item.href.startsWith("http") ? "_blank" : ""} rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{
                ...card,
                animation: `contactSlideIn 0.7s ease-out ${index * 0.15}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                }}
              >
                <div style={iconWrap(item.color, item.bg)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={item.color}>
                    <path d={item.icon} />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={label}>{item.label}</p>
                  <p style={value}>{item.value}</p>
                </div>
                <div style={pill(item.color)}>{item.action} {"->"}</div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Styles réutilisables ── */
const card = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.1rem 1.4rem",
  borderRadius: "14px",
  background: "#fff",
  border: "1px solid #f0ece8",
  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
  cursor: "pointer",
  transition: "transform 0.18s, box-shadow 0.18s",
};

const iconWrap = (color, bg) => ({
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const pill = (color) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: color,
  background: `${color}15`,
  padding: "5px 12px",
  borderRadius: "50px",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

const label = {
  fontSize: "0.72rem",
  color: "#bbb",
  margin: 0,
  marginBottom: "3px",
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const value = {
  fontSize: "0.92rem",
  color: "#1a1a1a",
  margin: 0,
  fontWeight: 600,
};