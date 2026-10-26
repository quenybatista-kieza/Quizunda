import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Carousel, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import ImpactSection from "./ImpactSection";
import { FaInfoCircle } from "react-icons/fa";

import { Card, Row, Col, Button, Alert, Modal } from "react-bootstrap";


function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [destaques, setDestaques] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [versiculos, setVersiculos] = useState([]);
  const [error, setError] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  // 🔹 Funções para abrir/fechar modal
  const handleClose = () => setShowModal(false);
  const handleShow = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/destacar_curso/${id}`);
      const data = await res.json();
      setCursoSelecionado(data);
      setShowModal(true);
    } catch (err) {
      console.error("Erro ao buscar curso:", err);
    }
  };

  // Carregar usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Carregar cursos em destaque
  useEffect(() => {
    fetch("http://localhost:5000/api/destacar_curso")
      .then((res) => res.json())
      .then((data) => setDestaques(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar cursos em destaque."));
  }, []);

  useEffect(() => {
    // Fetch notícias
    fetch("http://localhost:5000/api/notice")
      .then((res) => res.json())
      .then((data) => setNoticias(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar notícias."));

    // Fetch versículos
    fetch("http://localhost:5000/api/bible")
      .then((res) => res.json())
      .then((data) => setVersiculos(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar versículos."));
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); 
  };

  return (
    <>
 {/* Navbar superior com bandeira e login/logout dinâmico */}
<Navbar 
  expand="lg" 
  className="shadow-lg" 
  style={{ backgroundColor: "#dcdcdc" }} // cinza claro suave
>
  <Container>
    <Navbar.Brand href="/">
      <img
        src="/chapeu.png"
        alt="Bandeira de Angola"
        width="80"
        height="80"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Nav className="ms-auto align-items-center">
      {!user ? (
        <Nav.Link 
          href="/login" 
          style={{ backgroundColor: "#daa520", color: "white", padding: "8px 16px", borderRadius: "4px" }}
        >
          Iniciar Sessão
        </Nav.Link>
      ) : (
        <>
          <span className="navbar-text me-3 text-dark fw-semibold">
            {user.role === "estudante" ? "Estudante" : "Preparatório"}: {user.name}
          </span>
          <Nav.Link onClick={handleLogout} className="text-dark fw-bold">
            <i className="bi bi-box-arrow-right"></i> Terminar Sessão
          </Nav.Link>
        </>
      )}
    </Nav>
  </Container>
</Navbar>



      {/* Navbar logo abaixo com INAGBE Cursos e Menu */}
      <Navbar bg="light" expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/" className="brand-text">
            KIEZA Cursos Preparatórios
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Menu" id="basic-nav-dropdown">
                <NavDropdown.Item href="/CoursesPage">Cursos</NavDropdown.Item>
                
                <NavDropdown.Item href="/contato">Cotacto</NavDropdown.Item>
                
                <NavDropdown.Item href="/sobre">Sobre Nós</NavDropdown.Item>
                
                
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Carrossel */}
      <Carousel>
        <Carousel.Item className="carousel-item-relative">
          <img
            className="d-block w-100"
            src="/negra1.jpg"
            alt="Banner 1"
            style={{ height: '500px', objectFit: 'cover' }}
          />
          <div className="carousel-darken" />
          <Carousel.Caption className="caption-up">
            <h3>Portal de Cursos</h3>
            <p>Formações para universidades e escolas técnicas.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item className="carousel-item-relative">
          <img
            className="d-block w-100"
            src="/nene1.png"
            alt="Banner 2"
            style={{ height: '500px', objectFit: 'cover' }}
          />
          <div className="carousel-darken" />
          <Carousel.Caption className="caption-up">
            <h3>Videoaulas</h3>
            <p>Aprenda com conteúdos digitais e interativos.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item className="carousel-item-relative">
          <img
            className="d-block w-100"
            src="/nene.png"
            alt="Banner 3"
            style={{ height: '500px', objectFit: 'cover' }}
          />
          <div className="carousel-darken" />
          <Carousel.Caption className="caption-up">
            <h3>Inscreva-se</h3>
            <p>Garanta sua vaga nos cursos preparatórios.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Seções adicionais da homepage */}
      <Container className="menu-card-section mt-5">
        <div className="menu-card-grid">
          <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
            <i className="bi bi-mortarboard-fill icon"></i>
            <h4>Inscrição</h4>
            <p>Submeta a sua inscrição para os cursos disponíveis na KIEZA.</p>
            <a href="/CoursesPage" className="card-link">Acessar Cursos →</a>
          </div>
          <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
            <i className="bi bi-building icon"></i>
            <h4>Portal do Estudante</h4>
            <p>Consulte o seu perfil e acompanhe as suas inscrições submetidas.</p>
            <a href="/PortalPage" className="card-link">Acessar Portal →</a>
          </div>
          <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
            <i className="bi bi-book icon"></i>
            <h4>Material Complementar</h4>
            <p>Material complementar disponibilizado todos dias para sua melhor preparação.</p>
            <a href="/MTcomplementarPage" className="card-link">Acessar Matéria →</a>
          </div>
        </div>
      </Container>

      {/* ... resto do conteúdo da homepage (ranking, notícias, universidades, footer) igual ao que você já tem ... */}
       <Container className="mt-4">
      <h2>Destaques</h2>
      <p>Veja os cursos preparatórios mais procurados e inscreva-se.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {destaques.length > 0 ? (
          destaques.map((curso) => (
            <Col md="auto" key={curso.id} className="mb-3">
              <Card className="shadow-sm border-1" style={{ width: "100%" }}>
                <Card.Body className="d-flex flex-column">

                  {/* Botão de informação */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    <Button
                      variant="light"
                      style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      }}
                      onClick={() => handleShow(curso.id)}
                    >
                      <FaInfoCircle />
                    </Button>
                  </div>

                  {/* Thumbnail */}
                  {curso.thumbnail && (
                    <div style={{ marginBottom: "10px" }}>
                      <Card.Img
                        src={`http://localhost:5000${curso.thumbnail}`}
                        alt={curso.title}
                        style={{
                          borderRadius: "8px",
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  )}

                  {/* Estrelas */}
                  <div style={{ fontSize: "1.4rem", color: "#FFD700", marginBottom: "10px" }}>
                    ★ ★ ★ ★ ★
                  </div>

                  {/* Conteúdo */}
                  <Card.Title style={{ fontWeight: "bold", fontSize: "1rem" }}>
                    {curso.title}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {curso.category}
                  </Card.Subtitle>
                  <Card.Text style={{ fontSize: "0.9rem" }}>
                    <strong>País:</strong> {curso.country} <br />
                    <strong>Duração:</strong> {curso.duration} <br />
                    <strong>Preço:</strong> {curso.price} Kz
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Nenhum curso em destaque no momento.</p>
        )}
      </Row>

      {/* 🔹 Modal de informações */}
      <Modal show={showModal} onHide={handleClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Informações do Curso</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {cursoSelecionado ? (
      <p>{cursoSelecionado.details}</p>
    ) : (
      <p>Carregando informações...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Fechar
    </Button>
  </Modal.Footer>
</Modal>
    </Container>


      <Container className="mt-4">
      <h2>Notícias</h2>
      <p>Veja as novidades da nossa plataforma.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {/* Renderizar cards de notícias */}
        

        {/* Renderizar cards de versículos */}
        {versiculos.map((v) => (
          <Col md={6} key={v.id} className="mb-3">
  <Card
    className="h-100 shadow-sm"
    style={{ backgroundColor: "#d2b48c" }} // castanho claro (tan)
  >
    <Card.Body>
      <Card.Title>Versículo</Card.Title>
      <Card.Text
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif", // fonte clássica para textos bíblicos
          fontStyle: "italic", // deixa mais estilizado
          fontSize: "1.4rem", // levemente maior para destaque
          lineHeight: "1.6", // espaçamento confortável
          color: "#3e2723" // tom castanho escuro para contraste
        }}
      >
        {v.versos}
      </Card.Text>
    </Card.Body>
  </Card>
</Col>
        ))}

        {noticias.map((n) => (
          <Col md={6} key={n.id} className="mb-3" >
            <Card className="h-100 shadow-sm" style={{ backgroundColor: "#d1ecf1" , fontSize: "1.2rem"}}>
              <Card.Body>
                <Card.Title>Notícia</Card.Title>
                <Card.Text>{n.notice}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
      {/* Área Universidades */}
<Container className="mt-5 text-center">
  <h2 className="section-title">
    O teu futuro começa aqui!
  </h2>
  <p>
    Algumas das instituições de ensino superior que recebem nossos estudantes.
  </p>

  {/* Grid de logos das universidades */}
<div className="university-grid mt-4">
  <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
    <img src="/urnm.png" alt="Universidade 1" className="university-logo" />
    <p className="university-name">Universidade Rainha Njinga Mbande (URNM)</p>
  </div>
  <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
    <img src="/mandume.png" alt="Universidade 2" className="university-logo" />
    <p className="university-name">Universidade Mandume Ya Ndemufayo(UMYN)</p>
  </div>
  <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
    <img src="/unikiv.png" alt="Universidade 3" className="university-logo" />
    <p className="university-name">Universidade Kimpa Vita (UNIKIV)</p>
  </div>
  <div className="menu-card" style={{ backgroundColor: "#dcdcdc" }}>
    <img src="/uan.png" alt="Universidade 4" className="university-logo" />
    <p className="university-name">Universidade Agostinho Neto (UAN)</p>
  </div>
</div>

</Container>


<Container className="user-impact-section mt-5 mb-5 text-center">
  <ImpactSection />
</Container>
<Container className="cta-section text-center mt-5 mb-5">
  <h2>Pronto para começar sua jornada?</h2>
  <p>Inscreva-se agora e tenha acesso imediato aos melhores cursos preparatórios.</p>
  <a href="/login" className="btn btn-primary">Inscreva-se Já</a>
</Container>

  <footer className="footer-section">
  <Container>
    <div className="footer-grid">
      {/* Suporte */}
      <div className="footer-column">
        <h5>Suporte</h5>
        <ul>
          
          <li><a href="/contato">Contactos</a></li>
          <li><a href="/sobre">Metas e Objetivos</a></li>
          
        </ul>
      </div>

      {/* Navegação */}
      <div className="footer-column">
        <h5>Navegação</h5>
        <ul>
          <li><a href="/CoursesPage">Cursos</a></li>
          <li><a href="/MTcomplementarPage">Matérias</a></li>
          
        </ul>
      </div>

      {/* Newsletter */}
      <div className="footer-column">
        <h5>Newsletter</h5>
        <p>Mantenha-se actualizado sobre as nossas publicações, ofertas de descontos e notícias da KIEZA.</p>
        <button className="newsletter-btn">
          <i className="bi bi-envelope-fill"></i> Inscreva-se
        </button>
      </div>
    </div>

    <div className="footer-bottom">
      <img src="/nene.png" alt="INAGBE Logo" className="footer-logo" />
      <p>Plataforma de Preparação Acadêmica, para Ingresso em Universidades</p>
      <p>© Todos Direitos Reservados - KIEZA 2026</p>
    </div>
  </Container>
</footer>
    </>
  );
}

export default HomePage;
