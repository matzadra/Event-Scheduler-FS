import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand text-success" to="/">
          Event Scheduler
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <AuthenticatedLinks onLogout={handleLogout} />
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-success" to="/login">
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// sub-component to add authenticated links
const AuthenticatedLinks: React.FC<{ onLogout: () => void }> = ({
  onLogout,
}) => (
  <>
    <li className="nav-item">
      <Link className="nav-link text-success" to="/events">
        Events
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link text-success" to="/rsvp">
        RSVPs
      </Link>
    </li>
    <li className="nav-item">
      <span
        className="nav-link text-danger"
        style={{ cursor: "pointer" }}
        onClick={onLogout}
      >
        Logout
      </span>
    </li>
  </>
);

export default Navbar;
