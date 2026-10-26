import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MaterialCard.css";

export default function MTcomplementarPage() {
  const [materials, setMaterials] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/materials",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Materiais recebidos:", data);

      if (response.ok) {
        setMaterials(Array.isArray(data) ? data : []);
      } else {
        console.error("Erro da API:", data);
        setMaterials([]);
      }
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
      setMaterials([]);
    }
  };

  fetchMaterials();
}, []);

  const handleShow = (material) => {
    setSelectedMaterial(material);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedMaterial(null);
  };

  return (
    <Container style={{ padding: "20px" }}>
      {/* Header com imagem à esquerda e botão à direita */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <img
            src="/chapeu.png"
            alt="Logo"
            width="80"
            height="80"
            style={{ objectFit: "contain" }}
          />
        </Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={() => navigate("/")}>
            ← Voltar para Home
          </Button>
        </Col>
      </Row>

      <h2 className="mb-4">Materiais Complementares</h2>

      <Row>
        {materials.length > 0 ? (
          materials.map((material) => (
            <Col key={material.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="material-card h-100">
                <Card.Body>
                <i className="bi bi-book text-warning icon-custom"></i>

                  <Card.Title className="material-title">{material.tema}</Card.Title>
                  <Card.Text className="material-text">
                    <strong>Disciplina:</strong> {material.disciplina}
                  </Card.Text>
                  <Button
                    variant="warning"
                    onClick={() => handleShow(material)}
                    className="material-btn"
                  >
                    Visualizar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Nenhum material disponível.</p>
        )}
      </Row>

      {/* Modal para visualizar PDF */}
      {selectedMaterial && (
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedMaterial.tema}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: "80vh" }}>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedMaterial.materials)}&embedded=true`}
              title={selectedMaterial.tema}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}
