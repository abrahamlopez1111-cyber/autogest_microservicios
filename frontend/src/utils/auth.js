export const getUsuario = () => {
  try {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};

export const getRol = () => {
  const user = getUsuario();
  return user?.rol || null;
};

export const logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "/login";
};