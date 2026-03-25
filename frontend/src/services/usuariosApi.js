import { API_URLS } from "../config/apiUrls";

export const getUsuarios = async () => {
  const res = await fetch(`${API_URLS.usuarios}/usuarios`);
  return res.json();
};

export const crearUsuario = async (data) => {
  const res = await fetch(`${API_URLS.usuarios}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarUsuario = async (id_usuarios) => {
  const res = await fetch(`${API_URLS.usuarios}/usuarios/${id_usuarios}`, {
    method: "DELETE",
  });
  return res.json();
};