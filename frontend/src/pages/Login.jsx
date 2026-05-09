import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleLogin = async () => {
    setError("");

    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://autogest-gateway.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      // leer como texto primero
      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      console.log("LOGIN:", data);

      if (!res.ok) {
        setError(
          data.detail || "Correo o contraseña incorrectos"
        );
        return;
      }

      const usuario = data.usuario;

      if (!usuario) {
        setError("Respuesta inválida del servidor");
        return;
      }

      const userId = usuario.id_usuarios;
      const rol = usuario.rol?.toLowerCase();

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      localStorage.setItem(
        "user_id",
        userId.toString()
      );

      localStorage.setItem(
        "rol",
        rol
      );

      navigate(roleRoutes[rol] || "/");

    } catch (error) {
      console.error(error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          style={styles.input}
        />

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Entrando..." : "Entrar"}
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
  },

  error: {
    color: "red",
    marginTop: "10px",
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