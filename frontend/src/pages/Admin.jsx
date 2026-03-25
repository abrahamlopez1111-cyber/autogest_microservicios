import { useState } from "react";
import { crearUsuario } from "../services/usuariosApi";

function Admin() {
  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const handleCrear = async () => {
    try {
      await crearUsuario(nuevo);
      alert("Usuario creado correctamente");

      setNuevo({
        nombre: "",
        email: "",
        password: "",
        rol: "cliente",
      });
    } catch (error) {
      console.error(error);
      alert("Error al crear usuario");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Panel Administrador</h1>

      <h2>Crear Usuario</h2>

      <input
        placeholder="Nombre"
        value={nuevo.nombre}
        onChange={(e) =>
          setNuevo({ ...nuevo, nombre: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={nuevo.email}
        onChange={(e) =>
          setNuevo({ ...nuevo, email: e.target.value })
        }
      />

      <input
        placeholder="Password"
        value={nuevo.password}
        onChange={(e) =>
          setNuevo({ ...nuevo, password: e.target.value })
        }
      />

      <select
        value={nuevo.rol}
        onChange={(e) =>
          setNuevo({ ...nuevo, rol: e.target.value })
        }
      >
        <option value="cliente">Cliente</option>
        <option value="mecanico">Mecánico</option>
        <option value="admin">Administrador</option>
      </select>

      <button onClick={handleCrear}>Crear Usuario</button>
    </div>
  );
}

export default Admin;