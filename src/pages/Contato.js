import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaEnvelope, FaFacebook, FaWhatsapp, FaPhone, FaGithub } from "react-icons/fa";

export default function Contato() {
  return (
    <Container className="mt-5">
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "#006400",
        }}
      >
        Contato
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#555",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Fale conosco através dos canais abaixo
      </p>

      {/* Botão Voltar */}
      <div className="text-center mb-4">
        <Button
          variant="success"
          href="/"
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "10px 20px"
          }}
        >
          Voltar
        </Button>
      </div>

      <Row className="justify-content-center">
        {/* Gmail */}
        <Col md={3} className="mb-4">
          <Card className="shadow-lg border-0 h-100 text-center">
            <Card.Body>
              <FaEnvelope size={40} style={{ color: "#D44638", marginBottom: "15px" }} />
              <Card.Title style={{ fontWeight: "bold" }}>Gmail</Card.Title>
              <Card.Text>quenybatista@gmail.com</Card.Text>
              <Button variant="danger" href="mailto:quenybatista@gmail.com" className="mt-2">
                Enviar Email
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Facebook */}
        <Col md={3} className="mb-4">
          <Card className="shadow-lg border-0 h-100 text-center">
            <Card.Body>
              <FaFacebook size={40} style={{ color: "#1877F2", marginBottom: "15px" }} />
              <Card.Title style={{ fontWeight: "bold" }}>Facebook</Card.Title>
              <Card.Text>Queny Junior QJ</Card.Text>
              <Button
                variant="primary"
                href="https://web.facebook.com/quenyfelix.daluz/"
                target="_blank"
                className="mt-2"
              >
                Visitar Perfil
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* WhatsApp */}
        <Col md={3} className="mb-4">
          <Card className="shadow-lg border-0 h-100 text-center">
            <Card.Body>
              <FaWhatsapp size={40} style={{ color: "#25D366", marginBottom: "15px" }} />
              <Card.Title style={{ fontWeight: "bold" }}>WhatsApp</Card.Title>
              <Card.Text>+244 932134493</Card.Text>
              <Button
                variant="success"
                href="https://wa.me/244932134493?text=Olá,%20preciso%20de%20apoio..."
                target="_blank"
                className="mt-2"
              >
                Enviar Mensagem
              </Button>
            </Card.Body>
          </Card>
        </Col>

        
      </Row>

      {/* Apoio ao Cliente */}
      <Row className="mt-5">
        <Col md={12} className="text-center">
          <FaPhone size={35} style={{ color: "#006400", marginBottom: "10px" }} />
          <h4 style={{ fontWeight: "bold" }}>Fale Conosco</h4>
          <p style={{ fontSize: "1.2rem", color: "#333" }}>
            Deixe seu SMS para apoio ao cliente: <strong>941908927</strong>
          </p>
        </Col>
      </Row>

      {/* Disponibilidade para trabalhos */}
      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h4 style={{ fontWeight: "bold", color: "#006400" }}>Disponível para Trabalhos</h4>
          <p style={{ fontSize: "1.2rem", color: "#333", maxWidth: "700px", margin: "0 auto" }}>
            🚀 Desenvolvo plataformas modernas e funcionais com foco em qualidade e preços acessíveis.  
            💻 React, Node.js e SQL são minhas ferramentas para transformar ideias em soluções reais.  
            🤝 Estou pronto para colaborar em projetos e entregar resultados profissionais.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
