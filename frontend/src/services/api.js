const API_CLIENTES = "http://localhost:8001";
const API_CITAS = "http://localhost:8000";

export const getClientes = async () => {
  const res = await fetch(`${API_CLIENTES}/clientes`);
  return res.json();
};

export const crearCita = async (data) => {
  const res = await fetch(`${API_CITAS}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};