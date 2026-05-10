import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://autogest-gateway.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista: "/recepcionista",
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 15000);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let data = {};

      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        console.warn("Respuesta no JSON:", text);

        data = {
          detail: "El servidor respondió con un formato inválido",
        };
      }

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setError(
          data.detail ||
            "Correo o contraseña incorrectos"
        );
        return;
      }

      const usuario = data?.usuario;

      if (!usuario) {
        setError("No se recibió información del usuario");
        return;
      }

      const userId = usuario.id_usuarios;
      const rol = usuario.rol?.toLowerCase();

      if (!userId || !rol) {
        setError("Datos del usuario incompletos");
        return;
      }

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      localStorage.setItem(
        "user_id",
        String(userId)
      );

      localStorage.setItem(
        "rol",
        rol
      );

      navigate(roleRoutes[rol] || "/");

    } catch (err) {
      console.error("ERROR LOGIN:", err);

      if (err.name === "AbortError") {
        setError(
          "El servidor tardó demasiado en responder"
        );
      } else {
        setError(
          "No fue posible conectar con el servidor"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) =>
            handleChange(
              "email",
              e.target.value
            )
          }
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            handleChange(
              "password",
              e.target.value
            )
          }
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>

        <p style={styles.footer}>
          ¿No tienes cuenta?{" "}
          <span
            onClick={() =>
              navigate("/register")
            }
            style={styles.link}
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
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#1e3a8a,#f97316)",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
  },

  title: {
    color: "#1e3a8a",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "#f97316",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },

  footer: {
    marginTop: "15px",
  },

  link: {
    color: "#f97316",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;