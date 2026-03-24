import { API_URLS } from "../config/apiUrls";

export const getUsuarios = async () => {
  const res = await fetch(`${API_URLS.USUARIOS}/usuarios`);
  return res.json();
};

export const crearUsuario = async (data) => {
  const res = await fetch(`${API_URLS.USUARIOS}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};