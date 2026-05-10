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

  // DEBUG
  console.log(
    "USUARIO LOCAL:",
    usuario
  );

  console.log(
    "ROL LOCAL:",
    rol
  );

  console.log(
    "USER ID:",
    usuarioId
  );

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

        console.log(
          "Validando perfil:",
          usuarioId
        );

        const res =
          await fetch(
            `${API_URL}/perfil/${usuarioId}`
          );

        console.log(
          "STATUS PERFIL:",
          res.status
        );

        if (
          res.status === 200
        ) {

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

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p style={{ color: "white" }}>
        Cargando perfil...
      </p>
    );
  }

  // DEBUG
  console.log(
    "TIENE PERFIL:",
    tienePerfil
  );

  // =========================
  // NO TIENE PERFIL
  // =========================
  if (!tienePerfil) {

    console.log(
      "MOSTRANDO PERFIL"
    );

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
  // TIENE PERFIL
  // =========================
  console.log(
    "ENTRANDO DASHBOARD"
  );

  return children;
}

export default PerfilGuard;