import { API_URLS } from "../config/apiUrls";

export const crearCita = async (data) => {
  const res = await fetch(`${API_CITAS}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCitas = async () => {
  const res = await fetch(`${API_CITAS}/citas`);
  return res.json();
};