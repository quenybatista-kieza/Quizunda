import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function RecuperarSenha() {
  const [nome, setNome] = useState("");
  const [numeroouemail, setNumeroOuEmail] = useState("");
  const [sugerirNovaSenha, setSugerirNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/recuperar_senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, numeroouemail, sugerir_nova_senha: sugerirNovaSenha }),
      });
      const data = await res.json();
      setMensagem("Dados enviados com sucesso!");
    } catch (err) {
      setMensagem("Erro ao enviar dados.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Recuperar Senha</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Número ou Email</Form.Label>
          <Form.Control
            type="text"
            value={numeroouemail}
            onChange={(e) => setNumeroOuEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sugerir Nova Senha</Form.Label>
          <Form.Control
            type="password"
            value={sugerirNovaSenha}
            onChange={(e) => setSugerirNovaSenha(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Enviar
        </Button>
      </Form>

      {mensagem && <Alert className="mt-3">{mensagem}</Alert>}
    </Container>
  );
}
