export default function Hero() {
  return (
    <section id="bienvenue" style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      minHeight: "800px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {/* Image de fond - ultra nette et éclatante */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://www.goafricaonline.com/uploads/media/default/0001/01/38019-hotel-president-yamoussoukro.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.85) contrast(1.4) saturate(1.3) sharpness(1.2) brightness(1.05)",
        transition: "filter 0.5s ease",
        imageRendering: "crisp-edges",
        transform: "scale(1.01)",
      }} />
      {/* Overlay doré */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(180, 100, 0, 0.25)",
      }} />

      {/* Contenu centré */}
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        padding: "0 1.5rem",
        maxWidth: "800px",
      }}>
        <h1 className="calligraphy-reveal" style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: "clamp(4rem, 9vw, 6.5rem)",
          fontWeight: 400,
          color: "#e87722",
          margin: "0 0 1rem",
          lineHeight: 1.2,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          width: "100%",
          textAlign: "center",
        }}>
          Bienvenue à l'Hôtel Président
        </h1>
       </div>

    </section>
  );
}