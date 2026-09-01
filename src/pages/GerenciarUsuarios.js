// src/pages/GerenciarUsuarios.js
import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    accountType: "estudante",
    emailOrPhone: "",
  });
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Carregar usuários
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch(() => setError("Erro ao carregar usuários."));
  }, []);

  // 🔹 Cadastrar usuário
  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar usuário.");
      const novo = await res.json();
      setUsuarios([...usuarios, novo]);
      setSuccess("Usuário cadastrado com sucesso!");
      setFormData({ name: "", password: "", accountType: "estudante", emailOrPhone: "" });
    } catch {
      setError("Não foi possível cadastrar.");
    }
  };

  // 🔹 Atualizar usuário
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${updateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erro ao atualizar usuário.");
      const atualizado = await res.json();
      setUsuarios(usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)));
      setSuccess("Usuário atualizado com sucesso!");
      setUpdateId("");
      setFormData({ name: "", password: "", accountType: "estudante", emailOrPhone: "" });
    } catch {
      setError("Não foi possível atualizar.");
    }
  };

  // 🔹 Eliminar usuário
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao eliminar usuário.");
      setUsuarios(usuarios.filter((u) => u.id !== parseInt(deleteId)));
      setSuccess("Usuário eliminado com sucesso!");
      setDeleteId("");
    } catch {
      setError("Não foi possível eliminar.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "95%" }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Gerenciar Usuários</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Tabela de usuários */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email/Telefone</th>
                <th>Tipo de Conta</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.emailOrPhone}</td>
                  <td>{u.accountType}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Formulário de cadastro/atualização */}
          <Form className="mt-3 d-flex flex-wrap gap-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Form.Control
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Form.Select
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
            >
              <option value="estudante">Estudante</option>
              <option value="preparatorio">Preparatorio</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Email ou Telefone"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
            />
            <Button variant="success" onClick={handleCreate}>Cadastrar</Button>
            <Form.Control
              type="number"
              placeholder="ID para atualizar"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
            />
            <Button variant="primary" onClick={handleUpdate}>Atualizar</Button>
          </Form>

          {/* Campo para eliminar usuário */}
          <Form className="mt-3 d-flex gap-2">
            <Form.Control
              type="number"
              placeholder="Digite o ID do usuário"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
