// src/pages/GerenciarCursos.js
import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";

export default function GerenciarCurso() {
  const [cursos, setCursos] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Carregar cursos
  useEffect(() => {
    fetch("http://localhost:5000/api/courses_1")
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch(() => setError("Erro ao carregar cursos."));
  }, []);

  // 🔹 Eliminar curso por ID
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses_1/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao eliminar curso.");

      setCursos(cursos.filter((c) => c.id !== parseInt(deleteId)));
      setSuccess("Curso eliminado com sucesso!");
      setDeleteId("");
    } catch (err) {
      setError("Não foi possível eliminar o curso.");
    }
  };

 


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "95%" }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Gerenciar Cursos</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Tabela com todas as colunas (sem thumbnail) */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Dono</th>
                <th>Criado em</th>
                <th>Duração</th>
                <th>País</th>
                <th>Curso</th>
                <th>Conta</th>
                <th>IBAN</th>
                <th>Express</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.id}</td>
                  <td>{curso.title}</td>
                  <td>{curso.description}</td>
                  <td>{curso.price}</td>
                  <td>{curso.ownerId}</td>
                  <td>{curso.createdAt}</td>
                  <td>{curso.duration}</td>
                  <td>{curso.country}</td>
                  <td>{curso.course}</td>
                  <td>{curso.account}</td>
                  <td>{curso.iban}</td>
                  <td>{curso.express_number}</td>
                  <td>{curso.details}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Campo para eliminar curso */}
          <Form className="mt-3 d-flex gap-2">
            <Form.Control
              type="number"
              placeholder="Digite o ID do curso"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
            
          </Form>


        </Card.Body>
      </Card>
    </div>
  );
}
