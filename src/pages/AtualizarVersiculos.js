// src/pages/AtualizarVersiculos.js
import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 🔹 Import para navegação

export default function AtualizarVersiculos() {
  const [versiculos, setVersiculos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // 🔹 Hook para navegação

  // 🔹 Carregar dados das tabelas
  useEffect(() => {
    fetch("http://localhost:5000/api/bible")
      .then((res) => res.json())
      .then((data) => setVersiculos(data))
      .catch(() => setError("Erro ao carregar versículos."));

    fetch("http://localhost:5000/api/notice")
      .then((res) => res.json())
      .then((data) => setNoticias(data))
      .catch(() => setError("Erro ao carregar notícias."));
  }, []);

  // 🔹 Atualizar versos
  const handleUpdateVerso = async (id, novoVerso) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bible/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versos: novoVerso }),
      });
      if (res.ok) {
        setSuccess("Verso atualizado com sucesso!");
      }
    } catch {
      setError("Erro ao atualizar verso.");
    }
  };

  // 🔹 Atualizar notícia
  const handleUpdateNotice = async (id, novaNotice) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notice/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: novaNotice }),
      });
      if (res.ok) {
        setSuccess("Notícia atualizada com sucesso!");
      }
    } catch {
      setError("Erro ao atualizar notícia.");
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Atualizar Versículos</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <h5>Versículos</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Verso</th>
                <th>Atualizar</th>
              </tr>
            </thead>
            <tbody>
              {versiculos.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.versos}</td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Novo verso"
                      onBlur={(e) => handleUpdateVerso(v.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5>Notícias</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Notice</th>
                <th>Atualizar</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.notice}</td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Nova notícia"
                      onBlur={(e) => handleUpdateNotice(n.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 🔹 Botão Voltar */}
          <div className="mt-3">
            <Button variant="secondary" onClick={() => navigate("/admin/login")}>
              Voltar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
