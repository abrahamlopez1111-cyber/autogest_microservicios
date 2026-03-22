import { useEffect, useState } from "react";
import { getClientes } from "../services/citasApi";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClientes()
      .then(data => {
        setClientes(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudo cargar la lista de clientes");
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>{c.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;