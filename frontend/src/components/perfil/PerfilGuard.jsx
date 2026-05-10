import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilUsuario from "./PerfilUsuario";

const API_URL =
  "https://autogest-gateway.onrender.com";

function PerfilGuard({ children }) {

  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  const usuarioId =
    usuario?.id ||
    usuario?.id_usuarios;

  const rol = (
    localStorage.getItem("rol") ||
    usuario?.rol ||
    ""
  ).toLowerCase();

  const [loading, setLoading] =
    useState(true);

  const [tienePerfil, setTienePerfil] =
    useState(false);

  // =========================
  // RUTAS POR ROL
  // =========================
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista:
      "/recepcionista",
  };

  const irDashboard = () => {
    const ruta =
      roleRoutes[rol] || "/";
    navigate(ruta);
  };

  // =========================
  // VALIDAR PERFIL
  // =========================
  useEffect(() => {

    const verificarPerfil =
      async () => {

      if (!usuarioId) {
        navigate("/login");
        return;
      }

      try {

        const res =
          await fetch(
            `${API_URL}/perfil/${usuarioId}`
          );

        if (res.ok) {
          setTienePerfil(
            true
          );

        } else {
          setTienePerfil(
            false
          );
        }

      } catch (error) {

        console.error(
          "Error validando perfil:",
          error
        );

        setTienePerfil(
          false
        );

      } finally {

        setLoading(
          false
        );
      }
    };

    verificarPerfil();

  }, [usuarioId, navigate]);

  if (loading) {

    return (
      <p style={{ color: "white" }}>
        Cargando perfil...
      </p>
    );
  }

  // =========================
  // SI NO TIENE PERFIL
  // =========================
  if (!tienePerfil) {

    return (
      <div
        style={{
          padding: "20px",
          color: "white",
        }}
      >

        <h2>
          ⚠️ Completa tu perfil
          antes de continuar
        </h2>

        <PerfilUsuario
          volver={irDashboard}
        />

      </div>
    );
  }

  // =========================
  // SI YA TIENE PERFIL
  // =========================
  return children;
}

export default PerfilGuard;