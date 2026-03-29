import { API_URLS } from "../config/apiUrls";

// 🔹 Obtener usuarios
export const getUsuarios = async () => {
  try {
    const res = await fetch(`${API_URLS.usuarios}/usuarios`);

    if (!res.ok) {
      throw new Error("Error al obtener usuarios");
    }

    return await res.json();
  } catch (error) {
    console.error("getUsuarios:", error);
    return [];
  }
};


// 🔹 Crear usuario
export const crearUsuario = async (data) => {
  try {
    const res = await fetch(`${API_URLS.usuarios}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Error al crear usuario");
    }

    return await res.json();
  } catch (error) {
    console.error("crearUsuario:", error);
    throw error;
  }
};


// 🔹 Eliminar usuario
export const eliminarUsuario = async (id) => {
  try {
    const res = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error al eliminar usuario");
    }

    return await res.json();
  } catch (error) {
    console.error("eliminarUsuario:", error);
    throw error;
  }
};