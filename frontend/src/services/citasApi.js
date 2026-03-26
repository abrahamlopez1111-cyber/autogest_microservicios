import { API_URLS } from "../config/apiUrls";

const API_URL = API_URLS.citas; // 🔥 ESTA LÍNEA FALTABA

// =========================
// 📅 CITAS
// =========================
export const getCitas = async () => {
  const res = await fetch(`${API_URL}/citas`);
  if (!res.ok) throw new Error("Error obteniendo citas");
  return res.json();
};

export const crearCita = async (data) => {
  const res = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error creando cita");
  }

  return res.json();
};

// =========================
// 🏢 SUCURSALES
// =========================
export const crearSucursal = async (data) => {
  const res = await fetch(`${API_URL}/sucursales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error creando sucursal");
  }

  return res.json();
};

export const getSucursales = async () => {
  const res = await fetch(`${API_URL}/sucursales`);
  if (!res.ok) throw new Error("Error obteniendo sucursales");
  return res.json();
};

// =========================
// 🔧 MECÁNICOS
// =========================
export const crearMecanico = async (data) => {
  const res = await fetch(`${API_URL}/mecanicos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error creando mecánico");
  }

  return res.json();
};

export const getMecanicos = async () => {
  const res = await fetch(`${API_URL}/mecanicos`);
  if (!res.ok) throw new Error("Error obteniendo mecánicos");
  return res.json();
};