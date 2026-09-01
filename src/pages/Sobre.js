import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function SobreNos() {
  return (
    <Container className="mt-5 text-center">
      <img
        src="/QJ.jpeg" // substitui pela tua imagem real
        alt="Desenvolvedor da Plataforma"
        style={{
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "top",
          marginBottom: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
      />

      {/* Informações principais */}
      <h2 style={{ fontWeight: "bold", color: "#006400" }}>
        Estudante do 2º ano de Medicina
      </h2>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Desenvolvedor de Softwares
      </p>

      {/* Botão Voltar */}
      <Button
        variant="success"
        href="/"
        style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "40px",
          padding: "10px 20px"
        }}
      >
        Voltar
      </Button>

      {/* Metas e Objetivos */}
      <Row className="mt-5">
        <Col md={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body>
              <h4 style={{ color: "#006400", fontWeight: "bold" }}>Metas e Objetivos</h4>
              <p style={{ fontSize: "1rem", color: "#333" }}>
                Oferecer uma preparação sólida e acessível para estudantes que desejam
                ingressar na universidade, com foco em qualidade e inovação.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Missão */}
        <Col md={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body>
              <h4 style={{ color: "#006400", fontWeight: "bold" }}>Missão</h4>
              <p style={{ fontSize: "1rem", color: "#333" }}>
                Democratizar o acesso ao conhecimento, ajudando jovens a conquistar
                seus sonhos acadêmicos através de tecnologia e ensino moderno.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Valores */}
        <Col md={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body>
              <h4 style={{ color: "#006400", fontWeight: "bold" }}>Valores</h4>
              <p style={{ fontSize: "1rem", color: "#333" }}>
                Compromisso com a educação, acessibilidade financeira, ética e
                dedicação ao sucesso dos estudantes.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
