import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError(null);

        // salva token separado
        localStorage.setItem("token", data.token);

        if (data.user) {
          // junta role + dados do usuário
          const userData = {
            ...data.user,
            role: data.role,   // adiciona o role vindo do backend
            token: data.token  // opcional: guardar token junto
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.message);
        setMessage(null);
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      setError("Erro no servidor.");
      setMessage(null);
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="h-100">
        <Col md={6} className="login-image d-none d-md-block p-0">
          <img 
            src="/nene1.png" 
            alt="Imagem de login" 
            className="img-fluid h-100 w-100 login-img" 
          />
        </Col>

        <Col md={6} className="d-flex justify-content-center align-items-center">
          <Card className="login-card shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4 login-title">Bem-vindo de volta!</h2>
              <p className="text-center mb-4">Faça login para continuar sua preparação.</p>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
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
                    placeholder="Digite sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 login-btn">
                  Iniciar Sessão
                </Button>
              </Form>

              <div className="text-center mt-3">
                <a href="/RecuperarSenha" className="login-link">Esqueceu sua senha?</a>
              </div>

              <div className="text-center mt-4">
                <span>Não tem conta?</span>
                <Link to="/RegisterPage" className="btn btn-success ms-2">
                  Criar Conta
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

export default LoginPage;
