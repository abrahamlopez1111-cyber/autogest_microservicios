import { API_URLS } from "../config/apiUrls";

export const getRepuestos = async () => {
  const res = await fetch(`${API_URLS.inventario}/repuestos`);
  return res.json();
};

export const crearRepuesto = async (data) => {
  const res = await fetch(`${API_URLS.inventario}/repuestos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// 🔴 ELIMINAR
export const eliminarRepuesto = async (id) => {
  await fetch(`${API_URLS.inventario}/repuestos/${id}`, {
    method: "DELETE",
  });
};

// 🟡 ACTUALIZAR
export const actualizarRepuesto = async (id, data) => {
  const res = await fetch(`${API_URLS.inventario}/repuestos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};