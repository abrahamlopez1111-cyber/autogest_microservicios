import { API_URLS } from "../config/apiUrls";

<<<<<<< HEAD
// 🔹 LISTAR
export const getCitas = async () => {
  const res = await fetch(`${API_URLS.citas}/citas`);
  return res.json();
};

// 🔹 CREAR
export const crearCita = async (data) => {
  const res = await fetch(`${API_URLS.citas}/citas`, {
=======
export const crearCita = async (data) => {
  const res = await fetch(`${API_CITAS}/citas`, {
>>>>>>> 693fb39 (Microservicios con historial de vehiculos y clientes con 8 endpoints)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

<<<<<<< HEAD
// 🔹 ELIMINAR
export const eliminarCita = async (id) => {
  await fetch(`${API_URLS.citas}/citas/${id}`, {
    method: "DELETE",
  });
};

// 🔹 ACTUALIZAR
export const actualizarCita = async (id, data) => {
  const res = await fetch(`${API_URLS.citas}/citas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// 🔹 FILTRAR POR MECÁNICO
export const citasPorMecanico = async (id) => {
  const res = await fetch(`${API_URLS.citas}/citas/mecanico/${id}`);
  return res.json();
};

// 🔹 AGENDA DE HOY
export const agendaHoy = async () => {
  const res = await fetch(`${API_URLS.citas}/agenda/hoy`);
=======
export const getCitas = async () => {
  const res = await fetch(`${API_CITAS}/citas`);
>>>>>>> 693fb39 (Microservicios con historial de vehiculos y clientes con 8 endpoints)
  return res.json();
};