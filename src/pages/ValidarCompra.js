// src/pages/ValidarCompra.js
import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";

export default function ValidarCompra() {
  const [compras, setCompras] = useState([]);
  const [compraId, setCompraId] = useState("");
  const [novoCurso, setNovoCurso] = useState("");
  const [userId, setUserId] = useState(""); // 🔹 novo campo
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Carregar compras
  useEffect(() => {
    fetch("http://localhost:5000/api/compras_1")
      .then((res) => res.json())
      .then((data) => setCompras(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar compras."));
  }, []);

  // 🔹 Adicionar compra
  const handleAddCompra = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/compras_3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curso_id: novoCurso, user_id: userId }),
      });
      if (res.ok) {
        setSuccess("Compra adicionada com sucesso!");
      }
    } catch {
      setError("Erro ao adicionar compra.");
    }
  };

  // 🔹 Atualizar compra
  const handleUpdateCompra = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/compras_2/${compraId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curso_id: novoCurso, user_id: userId }),
      });
      if (res.ok) {
        setSuccess("Compra atualizada com sucesso!");
      }
    } catch {
      setError("Erro ao atualizar compra.");
    }
  };

  // 🔹 Remover compra
  const handleRemoveCompra = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/compras_0/${compraId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess("Compra removida com sucesso!");
      }
    } catch {
      setError("Erro ao remover compra.");
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Validar Compra</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <h5>Compras registradas</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID do Curso</th>
                <th>User ID</th> {/* 🔹 nova coluna */}
              </tr>
            </thead>
            <tbody>
              {compras.length > 0 ? (
                compras.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.curso_id}</td>
                    <td>{c.user_id}</td> {/* 🔹 mostra o user_id */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Nenhuma compra encontrada.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Form.Group className="mt-3">
            <Form.Label>ID da Compra</Form.Label>
            <Form.Control
              type="text"
              value={compraId}
              onChange={(e) => setCompraId(e.target.value)}
              placeholder="Ex: 5"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>ID do Curso</Form.Label>
            <Form.Control
              type="text"
              value={novoCurso}
              onChange={(e) => setNovoCurso(e.target.value)}
              placeholder="Ex: 3"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ex: 10"
            />
          </Form.Group>

          <div className="mt-3 d-flex gap-2">
            <Button variant="success" onClick={handleAddCompra}>
              Adicionar Compra
            </Button>
            <Button variant="primary" onClick={handleUpdateCompra}>
              Atualizar Compra
            </Button>
            <Button variant="danger" onClick={handleRemoveCompra}>
              Remover Compra
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
