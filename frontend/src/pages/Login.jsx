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

  // 🔥 Rutas según rol
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista: "/recepcionista",
  };

  const handleLogin = async () => {
    setError("");

    // Validación
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

      // 🔥 Evita errores si backend responde vacío o texto
      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      console.log("LOGIN RESPONSE:", data);

      // Si backend devuelve error
      if (!res.ok) {
        setError(
          data.detail ||
          data.mensaje ||
          "Correo o contraseña incorrectos"
        );
        return;
      }

      // 🔥 Acepta ambos formatos:
      // { usuario: {...} } o directamente {...}
      const usuario = data.usuario || data;

      if (!usuario) {
        setError("Usuario inválido");
        return;
      }

      // Obtener ID
      const userId =
        usuario.id ||
        usuario.id_usuarios;

      if (!userId) {
        setError("Usuario sin ID válido");
        return;
      }

      // Obtener rol
      const rol =
        (usuario.rol || "").toLowerCase();

      if (!rol) {
        setError("Usuario sin rol válido");
        return;
      }

      // Guardar sesión
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      localStorage.setItem(
        "rol",
        rol
      );

      localStorage.setItem(
        "user_id",
        userId.toString()
      );

      console.log("LOGIN EXITOSO");
      console.log("USER ID:", userId);
      console.log("ROL:", rol);

      // Redirigir
      navigate(
        roleRoutes[rol] || "/"
      );

    } catch (error) {
      console.error(
        "ERROR LOGIN:",
        error
      );

      setError(
        "Error de conexión con el servidor"
      );

    } finally {
      setLoading(false);
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
          placeholder="Correo electrónico"
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
            ? "Ingresando..."
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
      "linear-gradient(135deg, #1e3a8a, #f97316)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#1e3a8a",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },

  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },

  link: {
    color: "#f97316",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;