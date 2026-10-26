import React, { useEffect, useState } from "react";
import { Navbar, Container, NavDropdown, Button} from "react-bootstrap";

export default function AppNavbar({ onFilterByCountry }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pais");
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error("Erro ao buscar países:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-3">
      <Container>
        {/* Logo à esquerda */}
        <Navbar.Brand href="/">
          <img
            src="/chapeu.png"
            width="80"
            height="80"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        {/* Botão hamburguer para mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Conteúdo colapsável */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {/* Botão Voltar */}
          <Button
            variant="warning"
            className="me-3"
            href="/"
            style={{ fontWeight: "bold" }}
          >
            Voltar
          </Button>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
