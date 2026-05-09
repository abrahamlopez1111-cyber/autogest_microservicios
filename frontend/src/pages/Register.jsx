import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // Validación
    if (!form.nombre || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://autogest-gateway.onrender.com/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            rol: "cliente",
          }),
        }
      );

      // 🔥 Evita error si backend responde vacío o texto
      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      console.log("REGISTER RESPONSE:", data);

      // Manejar errores del backend
      if (!res.ok) {
        throw new Error(
          data.detail || data.mensaje || "Error al registrar"
        );
      }

      // Registro exitoso
      setSuccess("Usuario creado correctamente 🎉");

      // Limpiar formulario
      setForm({
        nombre: "",
        email: "",
        password: "",
      });

      // Redirigir al login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.message || "Error de conexión con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({
              ...form,
              nombre: e.target.value,
            })
          }
          style={styles.input}
        />

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

        {success && (
          <p style={styles.success}>
            {success}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Creando..." : "Crear Cuenta"}
        </button>

        <p style={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            style={styles.link}
          >
            Iniciar sesión
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

  success: {
    color: "green",
    marginTop: "10px",
    fontSize: "14px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },

  link: {
    color: "#1e3a8a",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;