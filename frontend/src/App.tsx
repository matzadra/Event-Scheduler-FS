import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Register from "./pages/Register";
import RSVPPage from "./pages/RSVP";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/rsvp" element={<RSVPPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
