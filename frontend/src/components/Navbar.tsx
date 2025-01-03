import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-neon">
          Event Scheduler
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/events" className="text-neon">
                  Events
                </Nav.Link>
                <Nav.Link as={Link} to="/rsvp" className="text-neon">
                  RSVP
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="text-neon">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-neon">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-neon">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
