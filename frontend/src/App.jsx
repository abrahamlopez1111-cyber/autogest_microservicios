import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Usuarios from "./pages/usuarios";
import Citas from "./pages/citas";
import Inventario from "./pages/inventario";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>🚗 AutoGest</h1>

        {/* 🔥 NAVBAR */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Usuarios</Link>
          <Link to="/citas" style={{ marginRight: "10px" }}>Citas</Link>
          <Link to="/inventario">Inventario</Link>
        </nav>

        {/* 🔥 RUTAS */}
        <Routes>
          <Route path="/" element={<Usuarios />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/inventario" element={<Inventario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;