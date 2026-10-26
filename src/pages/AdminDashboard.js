import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/AdminLogin"; // redireciona para login
  };

   const navigate = useNavigate();

// para gerenciar curso
    const handleClick_g = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/GerenciarCurso");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_vc = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/ValidarCompra");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };


  const handleClick_sc = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/SenhaEsquecida");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_d = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/DestacarCurso");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_sp = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/ExamQuestions");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_ec = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/ExamClasses");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_aw = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/CourseContacts");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };



  //para gerenciar usuario

      const handleClick_gu = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/GerenciarUsuarios");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  const handleClick_b = () => {
    const savedAdmin = localStorage.getItem("adminUser");
    if (!savedAdmin) {
      alert("Você precisa estar logado como admin1!");
      return navigate("/AdminLogin");
    }

    try {
      const adminData = JSON.parse(savedAdmin);
      const decoded = jwtDecode(adminData.token);

      if (decoded.username === "admin1") {
        navigate("/AtualizarVersiculos");
      } else {
        alert("Acesso permitido apenas para admin1!");
        navigate("/unauthorized");
      }
    } catch (err) {
      alert("Token inválido ou expirado. Faça login novamente.");
      navigate("/AdminLogin");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "500px" }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Painel Administrativo</h2>
          <p className="text-center">
            Bem-vindo! Aqui você poderá gerenciar a plataforma.
          </p>

          <div className="d-flex flex-column gap-3 mt-4">
            {/* Botões antigos */}
            <Button variant="dark" className="w-100" onClick={handleClick_g}>
              Gerenciar Cursos
            </Button>
            <Button variant="secondary" className="w-100" onClick={handleClick_gu}>
              Gerenciar Usuários
            </Button>
             <Button variant="secondary" className="w-100" onClick={handleClick_sc}>
              Ver senhas esquecidas
            </Button>
            {/* Novos botões */}
            <Button variant="success" className="w-100" onClick={handleClick_b}>
              Atualizar Versículos e Notícias
            </Button>
            <Button variant="warning" className="w-100 text-dark" onClick={handleClick_d}>
              Destacar Cursos
            </Button>
            <Button variant="danger" className="w-100 text-dark" onClick={handleClick_sp}>
              Perguntas e Salas
            </Button>
            <Button variant="warning" className="w-100 text-dark" onClick={handleClick_aw}>
              Atualizar WhatsApp
            </Button>
            <Button variant="success" className="w-100 text-dark" onClick={handleClick_ec}>
              Salas de Exame
            </Button>
            <Button variant="outline-success" className="w-100" onClick={handleClick_vc}>
              Validar Compra
            </Button>

            {/* Logout */}
            <Button variant="danger" className="w-100" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
