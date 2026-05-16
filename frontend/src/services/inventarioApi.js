import axios from "axios";

const API_URL = "https://autogest-gateway.onrender.com";

export const obtenerRepuestos = () => {
  return axios.get(`${API_URL}/repuestos`);
};

export const crearRepuesto = (data) => {
  return axios.post(`${API_URL}/repuestos`, data);
};