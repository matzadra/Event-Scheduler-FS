import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import RSVPPage from "./pages/RSVP";

const App = () => {
  return (
    <BrowserRouter>
      <AppNavbar />
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
