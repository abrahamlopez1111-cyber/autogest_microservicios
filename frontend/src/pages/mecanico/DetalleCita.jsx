import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetalleCita() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resCita = await fetch(`http://localhost:8000/citas/${id}`);
        const citaData = await resCita.json();

        const resUser = await fetch(
          `http://localhost:8002/usuarios/${citaData.usuario_id}`
        );
        const userData = await resUser.json();

        const resVehiculo = await fetch(
          `http://localhost:8003/vehiculos/${citaData.vehiculo_id}`
        );
        const vehiculoData = await resVehiculo.json();

        setCita(citaData);
        setCliente(userData);
        setVehiculo(vehiculoData);

      } catch (error) {
        console.error("❌ Error:", error);
      }
    };

    cargar();
  }, [id]);

  if (!cita || !cliente || !vehiculo) return <p>Cargando...</p>;

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>🔧 Detalle del Servicio</h2>

      <p><strong>Cliente:</strong> {cliente.nombre}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>

      <p><strong>Placa:</strong> {vehiculo.placa}</p>
      <p><strong>Marca:</strong> {vehiculo.marca}</p>
      <p><strong>Modelo:</strong> {vehiculo.modelo}</p>

      <p><strong>Observación cliente:</strong> {cita.observacion_cliente}</p>

      <button onClick={() => navigate(-1)}>⬅ Volver</button>
    </div>
  );
}

export default DetalleCita;