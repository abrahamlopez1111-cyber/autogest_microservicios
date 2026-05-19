import { API_URLS } from "../config/apiUrls";

const API_URL = API_URLS.gateway;

// =========================
// 🔧 FUNCIÓN BASE
// =========================
const fetchAPI = async (
  url,
  options = {}
) => {
  try {
    const res =
      await fetch(
        url,
        {
          headers:
            {
              "Content-Type":
                "application/json",

              ...(options.headers ||
                {}),
            },

          ...options,
        }
      );

    // Algunas respuestas DELETE pueden venir vacías
    let data = null;

    try {
      data =
        await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(
        data?.detail ||
          "Error en la petición"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "API ERROR:",
      error.message
    );

    throw error;
  }
};

// =========================
// 📅 CITAS
// =========================
export const getCitas =
  () => {
    return fetchAPI(
      `${API_URL}/citas`
    );
  };

export const getCitaById =
  (id) => {
    return fetchAPI(
      `${API_URL}/citas/${id}`
    );
  };

export const crearCita =
  (data) => {
    return fetchAPI(
      `${API_URL}/citas`,
      {
        method:
          "POST",

        body: JSON.stringify(
          data
        ),
      }
    );
  };

export const actualizarCita =
  (id, data) => {
    return fetchAPI(
      `${API_URL}/citas/${id}`,
      {
        method:
          "PUT",

        body: JSON.stringify(
          data
        ),
      }
    );
  };

export const cancelarCita =
  (id) => {
    return fetchAPI(
      `${API_URL}/citas/${id}`,
      {
        method:
          "DELETE",
      }
    );
  };

export const getDisponibilidad =
  (
    mecanico_id,
    fecha
  ) => {
    return fetchAPI(
      `${API_URL}/citas/disponibilidad/${mecanico_id}/${fecha}`
    );
  };

// =========================
// 🏢 SUCURSALES
// =========================
export const getSucursales =
  () => {
    return fetchAPI(
      `${API_URL}/sucursales`
    );
  };

export const crearSucursal =
  (data) => {
    return fetchAPI(
      `${API_URL}/sucursales`,
      {
        method:
          "POST",

        body: JSON.stringify(
          data
        ),
      }
    );
  };

// (opcional, pero útil)
export const eliminarSucursal =
  (id) => {
    return fetchAPI(
      `${API_URL}/sucursales/${id}`,
      {
        method:
          "DELETE",
      }
    );
  };

// =========================
// 🔧 MECÁNICOS
// =========================
export const getMecanicos =
  () => {
    return fetchAPI(
      `${API_URL}/mecanicos`
    );
  };

export const crearMecanico =
  (data) => {
    return fetchAPI(
      `${API_URL}/mecanicos`,
      {
        method:
          "POST",

        body: JSON.stringify(
          data
        ),
      }
    );
  };

// 🔥 ESTO ERA LO QUE FALTABA
export const eliminarMecanico =
  (id) => {
    return fetchAPI(
      `${API_URL}/mecanicos/${id}`,
      {
        method:
          "DELETE",
      }
    );
  };

// =========================
// 📊 EXTRAS
// =========================
export const getCitasPorMecanico =
  (id) => {
    return fetchAPI(
      `${API_URL}/citas/mecanico/${id}`
    );
  };

export const getAgendaHoy =
  () => {
    return fetchAPI(
      `${API_URL}/agenda/hoy`
    );
  };

// =========================
// CITAS HOY
// =========================
export const getCitasHoyMecanico = (mecanico_id) => {
  return fetchAPI(`${API_URL}/citas/mecanico/${mecanico_id}/hoy`);
};

export const getCitasHoySucursal = (sucursal_id) => {
  return fetchAPI(`${API_URL}/citas/sucursal/${sucursal_id}/hoy`);
};

export const getCitasPorSucursal = (sucursal_id) => {
  return fetchAPI(`${API_URL}/citas/sucursal/${sucursal_id}`);
};

// =========================
// RECIBIR Y ESTADO
// =========================
export const recibirCita = (id, data) => {
  return fetchAPI(`${API_URL}/citas/${id}/recibir`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const cambiarEstadoCita = (id, estado) => {
  return fetchAPI(`${API_URL}/citas/${id}/estado/${estado}`, {
    method: "PUT",
  });
};

export const getRecepcionCita = (id) => {
  return fetchAPI(`${API_URL}/citas/${id}/recepcion`);
};

// =========================
// RECEPCIONISTAS
// =========================
export const getRecepcionistas = () => {
  return fetchAPI(`${API_URL}/recepcionistas`);
};

export const crearRecepcionista = (data) => {
  return fetchAPI(`${API_URL}/recepcionistas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const eliminarRecepcionista = (id) => {
  return fetchAPI(`${API_URL}/recepcionistas/${id}`, {
    method: "DELETE",
  });
};