import { API_URLS } from "../config/apiUrls";

const API_URL = API_URLS.citas;

// =========================
// 🔧 FUNCIÓN BASE (REUTILIZABLE)
// =========================
const fetchAPI = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // 🔥 Manejo seguro de respuesta
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.detail || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
};

// =========================
// 📅 CITAS
// =========================
export const getCitas = () => {
  return fetchAPI(`${API_URL}/citas`);
};

export const getCitaById = (id) => {
  return fetchAPI(`${API_URL}/citas/${id}`);
};

export const crearCita = (data) => {
  return fetchAPI(`${API_URL}/citas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const actualizarCita = (id, data) => {
  return fetchAPI(`${API_URL}/citas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const cancelarCita = (id) => {
  return fetchAPI(`${API_URL}/citas/${id}`, {
    method: "DELETE",
  });
};

// 🔥 NUEVO (IMPORTANTE PARA TU AGENDA)
export const getDisponibilidad = (mecanico_id, fecha) => {
  return fetchAPI(
    `${API_URL}/citas/disponibilidad/${mecanico_id}/${fecha}`
  );
};

// =========================
// 🏢 SUCURSALES
// =========================
export const getSucursales = () => {
  return fetchAPI(`${API_URL}/sucursales`);
};

export const crearSucursal = (data) => {
  return fetchAPI(`${API_URL}/sucursales`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// =========================
// 🔧 MECÁNICOS
// =========================
export const getMecanicos = () => {
  return fetchAPI(`${API_URL}/mecanicos`);
};

export const crearMecanico = (data) => {
  return fetchAPI(`${API_URL}/mecanicos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// =========================
// 🔥 EXTRA (ÚTILES)
// =========================

// citas por mecánico
export const getCitasPorMecanico = (id) => {
  return fetchAPI(`${API_URL}/citas/mecanico/${id}`);
};

// agenda de hoy
export const getAgendaHoy = () => {
  return fetchAPI(`${API_URL}/agenda/hoy`);
};