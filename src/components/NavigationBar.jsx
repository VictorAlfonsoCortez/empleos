import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaBriefcase, FaUserCircle } from 'react-icons/fa';

const NavigationBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="white" expand="lg" className="navbar-custom sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaBriefcase className="me-2" />
          EmpleosNow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/empleos" active={location.pathname === '/empleos'}>Buscar Empleos</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center">
              <FaUserCircle className="me-2 fs-5" />
              Mi Perfil
            </Nav.Link>
            <Button variant="primary" className="btn-primary-custom ms-lg-3 mt-2 mt-lg-0">
              Publicar Vacante
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
