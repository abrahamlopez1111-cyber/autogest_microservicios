import { useEffect, useState } from "react";

function Inventario() {
  const [repuestos, setRepuestos] = useState(() => {
    const datos = localStorage.getItem("repuestos");
    return datos ? JSON.parse(datos) : [];
  });

  const [nuevo, setNuevo] = useState({
    codigo_inventario: "",
    descripcion: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  // 🔥 Guardar automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("repuestos", JSON.stringify(repuestos));
  }, [repuestos]);

  // 🔥 Crear repuesto
  const handleCrear = () => {
    if (!nuevo.codigo_inventario || !nuevo.descripcion) return;

    const nuevoRepuesto = {
      id: Date.now(),
      codigo_inventario: nuevo.codigo_inventario,
      descripcion: nuevo.descripcion,
    };

    setRepuestos([...repuestos, nuevoRepuesto]);

    setNuevo({
      codigo_inventario: "",
      descripcion: "",
    });
  };

  // 🔥 Eliminar repuesto
  const handleEliminar = (id) => {
    setRepuestos(repuestos.filter((r) => r.id !== id));
  };

  // 🔥 Editar repuesto
  const handleEditar = (rep) => {
    setEditandoId(rep.id);
    setNuevo({
      codigo_inventario: rep.codigo_inventario,
      descripcion: rep.descripcion,
    });
  };

  // 🔥 Actualizar repuesto
  const handleActualizar = () => {
    setRepuestos(
      repuestos.map((r) =>
        r.id === editandoId ? { ...r, ...nuevo } : r
      )
    );

    setEditandoId(null);
    setNuevo({
      codigo_inventario: "",
      descripcion: "",
    });
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

            <button onClick={() => handleEditar(r)}>Editar</button>
            <button onClick={() => handleEliminar(r.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventario;