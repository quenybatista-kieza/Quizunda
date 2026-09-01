import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaClipboardList } from "react-icons/fa"; // Ícone de exame/teste

function SalasDeExame({ cursoId }) {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarSalas() {
      try {
        const response = await fetch("http://localhost:5000/api/salas");
        const data = await response.json();
        setSalas(data);
      } catch (error) {
        console.error("Erro ao carregar salas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarSalas();
  }, [cursoId]);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Salas de Exame</h1>

      {/* Botão para voltar à Home */}
      <div className="text-center mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #64748b, #1e293b)",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          }}
        >
          ← Voltar para Home
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Carregando salas...</p>
        </div>
      ) : (
        <Row>
          {salas.map((sala) => (
            <Col key={sala.id} md={4} className="mb-4">
              <Card
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease-in-out",
                }}
                className="h-100"
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Card.Body>
                  {/* Ícone centralizado */}
                  <div style={{ textAlign: "center", marginBottom: "15px" }}>
                    <FaClipboardList size={60} color="#2563eb" />
                  </div>

                  <Card.Title
                    style={{
                      fontWeight: "700",
                      fontSize: "18px",
                      color: "#1e293b",
                    }}
                  >
                    {sala.roomName}
                  </Card.Title>
                  <Card.Text style={{ fontSize: "14px", color: "#475569" }}>
                    <strong>Preparatório:</strong> {sala.courseName} <br />
                    <strong>Local:</strong> Kieza
                  </Card.Text>

                  {/* Botão Iniciar Exame (mantido igual) */}
                  <Button
                    onClick={async () => {
                      navigate("/ExamPage");
                      await fetch(
                        `http://localhost:5000/api/exams/${sala.examRoomId}/questions`
                      );
                    }}
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #2563eb)",
                      border: "none",
                      padding: "15px",
                      borderRadius: "14px",
                      fontWeight: "700",
                      fontSize: "15px",
                      boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
                    }}
                  >
                    Iniciar Exame →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SalasDeExame;
