import { useEffect, useState } from "react";

function VehiculosPanel() {

  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // 🚗 VEHÍCULOS
      const resVehiculos = await fetch("http://localhost:8003/vehiculos");
      const dataVehiculos = await resVehiculos.json();

      // 👤 USUARIOS
      const resUsuarios = await fetch("http://localhost:8002/usuarios");
      const dataUsuarios = await resUsuarios.json();

      // 📞 PERFIL
      const perfiles = await Promise.all(
        dataVehiculos.map(async (v) => {
          try {
            const res = await fetch(`http://localhost:8002/perfil/${v.usuario_id}`);
            return await res.json();
          } catch {
            return null;
          }
        })
      );

      // 🔗 UNIR DATOS
      const combinados = dataVehiculos.map((v, index) => {
        const usuario = dataUsuarios.find(
          (u) => u.id === v.usuario_id || u.id_usuarios === v.usuario_id
        );

        const perfil = perfiles[index];

        return {
          ...v,
          nombre: usuario?.nombre || "N/A",
          telefono: perfil?.telefono || "N/A",
          documento: perfil?.documento || "N/A"
        };
      });

      setVehiculos(combinados);

    } catch (err) {
      console.error(err);
      setError("Error cargando vehículos");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTRO DINÁMICO (mientras escribes)
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const texto = busqueda.toLowerCase();

    return (
      v.placa?.toLowerCase().includes(texto) ||
      v.marca?.toLowerCase().includes(texto) ||
      v.modelo?.toLowerCase().includes(texto) ||
      v.nombre?.toLowerCase().includes(texto) ||
      v.documento?.toLowerCase().includes(texto)
    );
  });

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>🚗 Vehículos Registrados</h2>

      {/* 🔍 BUSCADOR */}
      <input
        style={styles.buscar}
        placeholder="Buscar por placa, marca, modelo o usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* 🔄 ESTADOS */}
      {loading && <p style={styles.mensaje}>Cargando vehículos...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && vehiculosFiltrados.length === 0 && (
        <p style={styles.mensaje}>No se encontraron resultados</p>
      )}

      {/* 📋 TABLA */}
      {!loading && vehiculosFiltrados.length > 0 && (
        <table style={styles.table}>

          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Usuario</th>
              <th>Teléfono</th>
              <th>Documento</th>
            </tr>
          </thead>

          <tbody>
            {vehiculosFiltrados.map((v) => (
              <tr key={v.id}>
                <td>{v.placa}</td>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.anio_fabricacion}</td>
                <td>{v.nombre}</td>
                <td>{v.telefono}</td>
                <td>{v.documento}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

const styles = {

  container: {
    width: "100%",
    background: "#1f2937",
    padding: "30px",
    borderRadius: "12px"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  buscar: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#111827"
  },

  mensaje: {
    textAlign: "center",
    marginTop: "20px"
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px"
  }

};

export default VehiculosPanel;