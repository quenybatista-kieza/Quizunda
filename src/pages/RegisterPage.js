import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  // estados para os campos
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emailOrPhone, password, accountType }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError(null);

        // opcional: redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message);
        setMessage(null);
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setError("Erro no servidor.");
      setMessage(null);
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="h-100">
        {/* Coluna da imagem */}
        <Col md={6} className="register-image d-none d-md-block p-0">
          <img 
            src="/nene1.png" 
            alt="Imagem de registro" 
            className="img-fluid h-100 w-100 register-img" 
          />
        </Col>

        {/* Coluna do card com scrollbar vertical */}
        <Col md={6} className="register-card-col d-flex justify-content-center align-items-start">
          <Card className="register-card shadow-lg w-100">
            <Card.Body>
              <h2 className="text-center mb-4 register-title">Crie sua conta</h2>
              <p className="text-center mb-4 register-subtitle">
                Junte-se à comunidade KIEZA e prepare-se para o futuro!
              </p>

              {/* feedback */}
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Digite seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmailOrPhone">
                  <Form.Label>Email ou Telemóvel</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Digite seu email ou seu telemóvel" 
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Crie uma senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirme sua senha" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formAccountType">
                  <Form.Label>Tipo de Conta</Form.Label>
                  <Form.Select 
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="estudante">Estudante</option>
                    <option value="preparatorio">Preparatório</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 register-btn">
                  Registrar
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span>Já tem conta?</span>
                <Link to="/login" className="btn btn-outline-light ms-2">
                  Iniciar Sessão
                </Link>
              </div>

              <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary">
                  Voltar para Home
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
