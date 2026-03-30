import { useEffect, useState } from "react";

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 🔥 1. Citas
        const resCitas = await fetch("http://localhost:8000/citas");
        const citasData = await resCitas.json();

        // 🔥 2. Sucursales
        const resSuc = await fetch("http://localhost:8000/sucursales");
        const sucursales = await resSuc.json();

        // 🔥 3. Mecánicos
        const resMec = await fetch("http://localhost:8000/mecanicos");
        const mecanicos = await resMec.json();

        // 🔥 4. Enriquecer citas
        const citasEnriquecidas = await Promise.all(
          citasData
            .filter((c) => c.usuario_id === usuario.id)
            .map(async (c) => {
              // buscar sucursal
              const sucursal = sucursales.find(s => s.id === c.sucursal_id);

              // buscar mecánico
              const mecanico = mecanicos.find(m => m.id === c.mecanico_id);

              let nombreMecanico = "Desconocido";

              if (mecanico) {
                try {
                  const resUser = await fetch(
                    `http://localhost:8002/usuarios/${mecanico.usuario_id}`
                  );
                  const userData = await resUser.json();

                  nombreMecanico =
                    userData.nombre ||
                    userData.email ||
                    "Sin nombre";
                } catch {
                  nombreMecanico = "Error usuario";
                }
              }

              return {
                ...c,
                sucursal_nombre: sucursal?.nombre || "N/A",
                mecanico_nombre: nombreMecanico,
              };
            })
        );

        setCitas(citasEnriquecidas);

      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div>
      <h2>📋 Mis Citas</h2>

      {citas.length === 0 ? (
        <p>No tienes citas</p>
      ) : (
        citas.map((c) => (
          <div key={c.id} style={styles.card}>
            <p><strong>Sucursal:</strong> {c.sucursal_nombre}</p>
            <p><strong>Mecánico:</strong> {c.mecanico_nombre}</p>
            <p><strong>Vehículo:</strong> {c.vehiculo_id}</p>
            <p><strong>Estado:</strong> {c.estado}</p>
            <p><strong>Inicio:</strong> {c.fecha_hora_inicio}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    color: "white",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  }
};

export default MisCitas;