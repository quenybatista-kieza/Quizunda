// src/pages/DestacarCurso.js
import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";

export default function DestacarCurso() {
  const [cursos, setCursos] = useState([]); // sempre começa como array
  const [cursoId, setCursoId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Carregar cursos (id e title)
  useEffect(() => {
    fetch("http://localhost:5000/api/courses_0")
      .then((res) => res.json())
      .then((data) => {
        console.log("Cursos recebidos:", data); // debug
        // 🔹 Garante que cursos seja array
        if (Array.isArray(data)) {
          setCursos(data);
        } else {
          setCursos([]); // evita erro
          setError("Formato inválido de cursos recebido do backend.");
        }
      })
      .catch(() => setError("Erro ao carregar cursos."));
  }, []);

  // 🔹 Adicionar destaque
  const handleAddDestaque = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/destacar_curso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_do_curso: cursoId }),
      });
      if (res.ok) {
        setSuccess("Curso destacado com sucesso!");
      }
    } catch {
      setError("Erro ao destacar curso.");
    }
  };

  // 🔹 Remover destaque
  const handleRemoveDestaque = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/destacar_curso/${cursoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess("Curso removido dos destaques!");
      }
    } catch {
      setError("Erro ao remover destaque.");
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Destacar Curso</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <h5>Cursos disponíveis</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cursos) && cursos.length > 0 ? (
                cursos.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.title}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Nenhum curso encontrado.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Form.Group className="mt-3">
            <Form.Label>Digite o ID do curso</Form.Label>
            <Form.Control
              type="text"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              placeholder="Ex: 3"
            />
          </Form.Group>

          <div className="mt-3 d-flex gap-2">
            <Button variant="success" onClick={handleAddDestaque}>
              Adicionar Destaque
            </Button>
            <Button variant="danger" onClick={handleRemoveDestaque}>
              Remover Destaque
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
