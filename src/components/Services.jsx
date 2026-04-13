const services = [
  {
    nom: "Piscine",
    description:
      "Profitez de notre piscine extérieure au cœur d'un cadre verdoyant. Ouverte tous les jours, elle offre un espace de détente et de fraîcheur idéal sous le soleil de Yamoussoukro.",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/35/3a/d5/hotel-president.jpg?w=2000&h=-1&s=1",
    horaires: "Tous les jours • 7h – 18h",
   
  },
  {
    nom: "Restaurant",
    description:
      "Notre restaurant vous propose une cuisine africaine et internationale raffinée, préparée par nos chefs. Un cadre élégant pour vos déjeuners, dîners et événements privés.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    horaires: "Lun – Dim • 7h – 23h",
    
  },
  {
    nom: "Cinéma Pathé",
    description:
      "Vivez une expérience cinématographique unique dans notre salle Pathé moderne. Films récents, son Dolby et sièges premium pour vos sorties en famille ou entre amis.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
    horaires: "Mar – Dim • 14h – 23h",
    
  },
];

export default function Services() {
  return (
    <section style={{
      paddingTop: "100px",
      paddingBottom: "60px",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    }}>

      {/* Titre */}
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "2rem",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: "0.5rem",
        color: "#1a1a1a",
      }}>
        Nos Services
      </h2>
      <p style={{
        textAlign: "center",
        color: "#888",
        marginBottom: "3rem",
        fontSize: "1rem",
      }}>
        Tout ce qu'il vous faut pour un séjour inoubliable
      </p>

      {/* Cartes */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
      }}>
        {services.map((service, index) => (
          <div key={service.nom} style={{
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            background: "#fff",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            animation: service.nom === "Restaurant" ? `elegantSlideIn 0.8s ease-out ${index * 0.2}s both` : "none",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)";
            }}
          >
            {/* Image */}
            <div style={{ position: "relative" }}>
              <img
                src={service.image}
                alt={service.nom}
                style={{ width: "100%", height: "210px", objectFit: "cover" }}
              />
              {/* Badge icone */}
              <span style={{
                position: "absolute", top: "14px", left: "14px",
                background: "#e87722",
                borderRadius: "50px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#fff",
              }}>
                {service.nom}
              </span>
            </div>

            {/* Contenu */}
            <div style={{ padding: "1.4rem" }}>
              <p style={{
                fontSize: "0.9rem",
                color: "#555",
                lineHeight: 1.6,
                marginBottom: "1.2rem",
              }}>
                {service.description}
              </p>

              {/* Horaires */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{
                  fontSize: "0.8rem",
                  color: "#e87722",
                  fontWeight: 600,
                  background: "rgba(232,119,34,0.1)",
                  padding: "5px 12px",
                  borderRadius: "50px",
                }}>
                  {service.horaires}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}