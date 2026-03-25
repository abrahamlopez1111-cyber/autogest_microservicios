import { useState } from "react";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:8002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.usuario) {
        // 🔥 Guardar usuario en sesión
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // 🔥 Redirección según rol
        if (data.usuario.rol === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/citas";
        }
      } else {
        setError("Credenciales incorrectas");
      }

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Iniciar Sesión</h2>

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

        <button onClick={handleLogin} style={styles.button}>
          Entrar
        </button>

        <p style={styles.footer}>
          ¿No tienes cuenta?{" "}
          <span style={{ color: "#f97316", cursor: "pointer" }}>
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