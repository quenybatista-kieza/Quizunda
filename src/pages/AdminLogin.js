// src/pages/AdminLogin.js
import React, { useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AuthContext1"; // importa o contexto de admin

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext); // pega função login do contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 usa o login do contexto
      await login(username, password);

      // 🔹 redireciona para o painel admin
      navigate("/AdminDashboard");
    } catch (err) {
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-4">Login Admin</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuário</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="dark" className="w-100">
              Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
