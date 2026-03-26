import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario } from "../services/usuariosApi";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  });

  //  cargar usuarios
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  //  crear usuario
  const handleCrear = async () => {
    try {
      await crearUsuario(nuevo);

      // limpiar formulario
      setNuevo({
        nombre: "",
        email: "",
        password: "",
        rol: "",
      });

      // recargar lista
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1> Gestión de Usuarios</h1>

      {/* FORMULARIO */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          value={nuevo.nombre}
          placeholder="Nombre"
          onChange={(e) =>
            setNuevo({ ...nuevo, nombre: e.target.value })
          }
        />

        <input
          value={nuevo.email}
          placeholder="Email"
          onChange={(e) =>
            setNuevo({ ...nuevo, email: e.target.value })
          }
        />

        <input
          value={nuevo.password}
          placeholder="Password"
          onChange={(e) =>
            setNuevo({ ...nuevo, password: e.target.value })
          }
        />

        <input
          value={nuevo.rol}
          placeholder="Rol"
          onChange={(e) =>
            setNuevo({ ...nuevo, rol: e.target.value })
          }
        />

        <button onClick={handleCrear}>Crear</button>
      </div>

      {/* LISTA */}
      <h2 style={{ marginTop: "20px" }}>Lista de Usuarios</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4">No hay usuarios</td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id_usuarios}>
                <td>{u.id_usuarios}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;