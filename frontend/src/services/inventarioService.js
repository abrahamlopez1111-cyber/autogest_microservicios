const GATEWAY = "https://autogest-gateway.onrender.com";

// =========================
// REPUESTOS
// =========================
export const obtenerRepuestos = async () => {
  const res = await fetch(`${GATEWAY}/inventario/repuestos`);
  if (!res.ok) throw new Error("Error al obtener repuestos");
  return res.json();
};

export const crearRepuesto = async (data) => {
  const res = await fetch(`${GATEWAY}/inventario/repuestos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear repuesto");
  return res.json();
};

// =========================
// INVENTARIO COMPLETO
// =========================
export const obtenerInventarioCompleto = async () => {
  const res = await fetch(`${GATEWAY}/inventario/repuestos/inventario-completo`);
  if (!res.ok) throw new Error("Error al cargar inventario");
  return res.json();
};

// =========================
// STOCK
// =========================
export const crearStock = async (data) => {
  const res = await fetch(`${GATEWAY}/inventario/repuestos/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear stock");
  return res.json();
};

export const obtenerRepuestoPorId = async (id) => {
  const res = await fetch(`${GATEWAY}/inventario/repuestos/${id}`);
  if (!res.ok) throw new Error("Error al obtener repuesto");
  return res.json();
};