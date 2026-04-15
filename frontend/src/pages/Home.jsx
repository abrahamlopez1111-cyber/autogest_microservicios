function Home() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      
      {/*  NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        background: "#0f172a",
        color: "white"
      }}>
        <h2>AUTOGEST</h2>
        <div>
          <a href="/login" style={{ marginRight: "15px", color: "white" }}>
            Iniciar Sesión
          </a>
        </div>
      </div>

      {/*  HERO */}
      <div style={{
        textAlign: "center",
        padding: "80px",
        background: "linear-gradient(to right, #1e3a8a, #f97316)",
        color: "white"
      }}>
        <h1 style={{ fontSize: "40px" }}>Bienvenido a AUTOGEST</h1>
        <p>Sistema de gestión de talleres automotrices</p>

        <button
          onClick={() => window.location.href = "/citas"}
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            fontSize: "18px",
            background: "#f97316",
            border: "none",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
           Crear Cita
        </button>
      </div>

      {/*  SECCIÓN INFO */}
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>¿Qué es AUTOGEST?</h2>
        <p>Sistema integral para gestión de talleres</p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px"
        }}>
          <div style={{ padding: "20px", border: "1px solid #ccc" }}>
             Sucursales
          </div>

          <div style={{ padding: "20px", border: "1px solid #ccc" }}>
             Mecánicos
          </div>

          <div style={{ padding: "20px", border: "1px solid #ccc" }}>
             Citas
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;