import { useEffect, useState } from "react";
import PerfilUsuario from "./PerfilUsuario";

function PerfilGuard({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const usuarioId = usuario?.id || usuario?.id_usuarios;

  const [loading, setLoading] = useState(true);
  const [tienePerfil, setTienePerfil] = useState(false);

  useEffect(() => {
    const verificarPerfil = async () => {
      try {
        const res = await fetch(
          `http://localhost:8002/perfil/${usuarioId}`
        );

        if (res.ok) {
          setTienePerfil(true);
        } else {
          setTienePerfil(false);
        }

      } catch (error) {
        console.error(error);
        setTienePerfil(false);
      } finally {
        setLoading(false);
      }
    };

    if (usuarioId) verificarPerfil();
  }, [usuarioId]);

  if (loading) return <p>Cargando...</p>;

  // 🔥 SI NO TIENE PERFIL → BLOQUEA TODO
  if (!tienePerfil) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>⚠️ Completa tu perfil antes de continuar</h2>
        <PerfilUsuario volver={() => {}} />
      </div>
    );
  }

  // ✅ SI TIENE PERFIL → deja pasar
  return children;
}

export default PerfilGuard;