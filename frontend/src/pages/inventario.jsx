import { useEffect, useState } from "react";
import {
  getRepuestos,
  crearRepuesto,
  eliminarRepuesto,
  actualizarRepuesto,
} from "../services/inventarioApi";

function Inventario() {
  const [repuestos, setRepuestos] = useState([]);
  const [nuevo, setNuevo] = useState({
    codigo_inventario: "",
    descripcion: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  const obtenerRepuestos = async () => {
    const data = await getRepuestos();
    setRepuestos(data);
  };

  useEffect(() => {
    obtenerRepuestos();
  }, []);

  const handleCrear = async () => {
    await crearRepuesto(nuevo);
    setNuevo({ codigo_inventario: "", descripcion: "" });
    obtenerRepuestos();
  };

  const handleEliminar = async (id) => {
    await eliminarRepuesto(id);
    obtenerRepuestos();
  };

  const handleEditar = (rep) => {
    setEditandoId(rep.id);
    setNuevo({
      codigo_inventario: rep.codigo_inventario,
      descripcion: rep.descripcion,
    });
  };

  const handleActualizar = async () => {
    await actualizarRepuesto(editandoId, nuevo);
    setEditandoId(null);
    setNuevo({ codigo_inventario: "", descripcion: "" });
    obtenerRepuestos();
  };

  return (
    <div>
      <h1>Inventario de Repuestos</h1>

      <input
        placeholder="Código"
        value={nuevo.codigo_inventario}
        onChange={(e) =>
          setNuevo({ ...nuevo, codigo_inventario: e.target.value })
        }
      />

      <input
        placeholder="Descripción"
        value={nuevo.descripcion}
        onChange={(e) =>
          setNuevo({ ...nuevo, descripcion: e.target.value })
        }
      />

      {editandoId ? (
        <button onClick={handleActualizar}>Actualizar</button>
      ) : (
        <button onClick={handleCrear}>Crear</button>
      )}

      <h2>Lista</h2>

      <ul>
        {repuestos.map((r) => (
          <li key={r.id}>
            {r.codigo_inventario} - {r.descripcion}

            <button onClick={() => handleEditar(r)}></button>
            <button onClick={() => handleEliminar(r.id)}></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventario;