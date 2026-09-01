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
            src="/urnm.png"
            width="50"
            height="50"
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
            variant="secondary"
            className="me-3"
            href="/"
            style={{ fontWeight: "bold" }}
          >
            Voltar
          </Button>
          <NavDropdown
            title="Filtrar Cursos"
            id="courses-filter-dropdown"
            align="end"
          >
            {countries.length > 0 ? (
              countries.map((country) => (
                <NavDropdown.Item
                  key={country.id}
                  onClick={() => onFilterByCountry(country.country)}
                >
                  {country.country}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item disabled>
                Nenhum país disponível
              </NavDropdown.Item>
            )}
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
