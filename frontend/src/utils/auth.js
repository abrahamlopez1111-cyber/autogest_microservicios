export const getUsuario = () => {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const getRol = () => {
  const user = getUsuario();
  return user?.rol;
};

export const logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "/login";
};