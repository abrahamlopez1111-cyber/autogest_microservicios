import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://autogest-gateway.onrender.com";

function Login() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // DASHBOARD POR ROL
  // =========================
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista:
      "/recepcionista",
  };

  // =========================
  // INPUTS
  // =========================
  const handleChange = (
    field,
    value
  ) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin =
    async () => {

    setError("");

    const email =
      form.email.trim();

    const password =
      form.password;

    if (
      !email ||
      !password
    ) {

      setError(
        "Todos los campos son obligatorios"
      );

      return;
    }

    setLoading(
      true
    );

    try {

      // LOGIN
      const loginRes =
        await fetch(
          `${API_URL}/login`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email,
                password,
              }),
          }
        );

      const loginData =
        await loginRes.json();

      // Error credenciales
      if (
        !loginRes.ok
      ) {

        setError(
          loginData.detail ||
            "Credenciales incorrectas"
        );

        return;
      }

      // Usuario
      const usuario =
        loginData.usuario;

      if (
        !usuario
      ) {

        setError(
          "No se recibió información del usuario"
        );

        return;
      }

      const userId =
        usuario.id_usuarios;

      const rol =
        usuario.rol?.toLowerCase();

      if (
        !userId ||
        !rol
      ) {

        setError(
          "Datos del usuario inválidos"
        );

        return;
      }

      // =========================
      // GUARDAR SESIÓN
      // =========================
      localStorage.setItem(
        "usuario",
        JSON.stringify(
          usuario
        )
      );

      localStorage.setItem(
        "rol",
        rol
      );

      localStorage.setItem(
        "user_id",
        String(
          userId
        )
      );

      // =========================
      // VALIDAR PERFIL
      // =========================
      const perfilRes =
        await fetch(
          `${API_URL}/perfil/${userId}`
        );

      // NO TIENE PERFIL
      if (
        perfilRes.status ===
        404
      ) {

        navigate(
          "/perfil"
        );

        return;
      }

      // SÍ TIENE PERFIL
      if (
        perfilRes.status ===
        200
      ) {

        navigate(
          roleRoutes[
            rol
          ] || "/"
        );

        return;
      }

      // Respuesta inesperada
      setError(
        "No se pudo validar el perfil"
      );

    } catch (error) {

      console.error(
        "Error login:",
        error
      );

      setError(
        "Error de conexión con el servidor"
      );

    } finally {

      setLoading(
        false
      );
    }
  };

  // =========================
  // ENTER
  // =========================
  const handleKeyPress =
    (e) => {

    if (
      e.key ===
      "Enter"
    ) {

      handleLogin();
    }
  };

  return (

    <div
      style={
        styles.container
      }
    >

      <div
        style={
          styles.card
        }
      >

        <h2
          style={
            styles.title
          }
        >
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          value={
            form.email
          }
          onChange={(
            e
          ) =>
            handleChange(
              "email",
              e.target
                .value
            )
          }
          onKeyDown={
            handleKeyPress
          }
          style={
            styles.input
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={
            form.password
          }
          onChange={(
            e
          ) =>
            handleChange(
              "password",
              e.target
                .value
            )
          }
          onKeyDown={
            handleKeyPress
          }
          style={
            styles.input
          }
        />

        {error && (

          <p
            style={
              styles.error
            }
          >
            {error}
          </p>

        )}

        <button
          onClick={
            handleLogin
          }
          disabled={
            loading
          }
          style={
            styles.button
          }
        >

          {loading
            ? "Entrando..."
            : "Entrar"}

        </button>

        <p
          style={
            styles.footer
          }
        >

          ¿No tienes cuenta?{" "}

          <span
            onClick={() =>
              navigate(
                "/register"
              )
            }
            style={
              styles.link
            }
          >
            Crear usuario
          </span>

        </p>

      </div>

    </div>
  );
}

const styles = {

  container: {
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    minHeight:
      "100vh",
    background:
      "linear-gradient(135deg,#1e3a8a,#f97316)",
  },

  card: {
    background:
      "white",
    padding:
      "40px",
    borderRadius:
      "15px",
    width:
      "320px",
    textAlign:
      "center",
  },

  title: {
    color:
      "#1e3a8a",
  },

  input: {
    width:
      "100%",
    padding:
      "12px",
    marginTop:
      "10px",
    boxSizing:
      "border-box",
  },

  button: {
    width:
      "100%",
    marginTop:
      "20px",
    padding:
      "12px",
    background:
      "#f97316",
    color:
      "white",
    border:
      "none",
    cursor:
      "pointer",
  },

  error: {
    color:
      "red",
    marginTop:
      "10px",
  },

  footer: {
    marginTop:
      "15px",
  },

  link: {
    color:
      "#f97316",
    cursor:
      "pointer",
    fontWeight:
      "bold",
  },

};

export default Login;