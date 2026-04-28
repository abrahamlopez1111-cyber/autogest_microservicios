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

  // 🔥 MAPA DE ROLES → RUTAS
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
      const res = await fetch("http://localhost:8002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // 🔍 DEBUG

      if (!data.usuario) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // 🔥 SOPORTE PARA id o id_usuarios
      const userId = data.usuario.id || data.usuario.id_usuarios;

      if (!userId) {
        console.error("Usuario sin ID:", data.usuario);
        setError("Error: el usuario no tiene ID válido");
        setLoading(false);
        return;
      }

      // 🔥 Normalizar rol
      const rol = (data.usuario.rol || "").toLowerCase();

      // 🔐 Guardar en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("rol", rol);
      localStorage.setItem("user_id", userId.toString());

      console.log("USER ID GUARDADO:", userId);

      // 🔥 Redirección segura
      const ruta = roleRoutes[rol] || "/";
      navigate(ruta);

    } catch (err) {
      console.error("ERROR LOGIN:", err);
      setError("Error de conexión con el servidor");
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
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p style={styles.footer}>
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#f97316", cursor: "pointer" }}
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
    height: "100vh",
    background: "linear-gradient(135deg, #1e3a8a, #f97316)",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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
    fontSize: "14px",
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#555",
  },
};

export default Login;