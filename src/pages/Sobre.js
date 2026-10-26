import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
} from "react-bootstrap";
import {
  FaStethoscope,
  FaLaptopCode,
  FaBullseye,
  FaEye,
  FaHeart,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";




export default function SobreNos() {

  const pessoas = [
  {
    foto: "/QJ.jpeg",
    nome: "Queny João",
    cargo: "Fundador e Desenvolvedor",
    descricao:
      "Estudante do 2º ano de Medicina e desenvolvedor de software. Criador da Plataforma Kieza, com foco em educação digital, inovação tecnológica e preparação académica de qualidade.",
  },
  {
    foto: "/pessoa2.jpg",
    nome: "Equipa Académica",
    cargo: "Apoio Pedagógico",
    descricao:
      "Uma equipa dedicada à produção de conteúdos educativos, materiais complementares e recursos que ajudam os estudantes a alcançarem os seus objetivos académicos.",
  },
  {
    foto: "/pessoa3.jpg",
    nome: "Comunidade Kieza",
    cargo: "Estudantes",
    descricao:
      "A força da plataforma está na sua comunidade. Estudantes de várias áreas utilizam os recursos da Kieza para melhorar o desempenho e aumentar as suas oportunidades de sucesso.",
  },
];

const [activeIndex, setActiveIndex] = React.useState(0);

React.useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % pessoas.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

const pessoa = pessoas[activeIndex];

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >

    <div
  style={{
    background: "linear-gradient(135deg, #0f172a, #2563eb)",
    color: "white",
    padding: "60px 20px",
    borderRadius: "0 0 30px 30px",
  }}
>
  <Container>
    <Row className="align-items-center">
      <Col md={4} className="text-center">
        <img
          key={pessoa.foto}
          src={pessoa.foto}
          alt={pessoa.nome}
          style={{
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "top",
            border: "6px solid white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            transition: "all 0.8s ease-in-out",
          }}
        />
      </Col>

      <Col md={8}>
        <h1
          style={{
            fontWeight: "800",
            marginBottom: "20px",
          }}
        >
          Sobre a Plataforma Kieza
        </h1>

        <h3 style={{ color: "#93c5fd" }}>
          {pessoa.nome}
        </h3>

        <h5
          style={{
            color: "#dbeafe",
            marginBottom: "20px",
          }}
        >
          {pessoa.cargo}
        </h5>

        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: "1.8",
            minHeight: "120px",
          }}
        >
          {pessoa.descricao}
        </p>

        {/* Indicadores */}
        <div className="d-flex gap-2 mt-3 mb-4">
          {pessoas.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background:
                  activeIndex === index
                    ? "#22c55e"
                    : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "0.3s",
              }}
            />
          ))}
        </div>

        <Button
          href="/"
          size="lg"
          style={{
            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
          }}
        >
          Voltar à Página Inicial
        </Button>
      </Col>
    </Row>
  </Container>
</div>
     
      <Container className="mt-5">

        {/* HISTÓRIA */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-lg">
              <Card.Body className="p-5">
                <h2
                  className="text-center mb-4"
                  style={{ fontWeight: "700" }}
                >
                  A Nossa História
                </h2>

                <p
                  style={{
                    lineHeight: "2",
                    fontSize: "1.05rem",
                    color: "#444",
                  }}
                >
                  A Kieza surgiu da necessidade de oferecer aos estudantes
                  uma plataforma moderna de apoio académico. O projecto
                  combina tecnologia e educação para disponibilizar
                  materiais complementares, videoaulas, exames simulados e
                  ferramentas de aprendizagem acessíveis a qualquer momento.

                  O objectivo principal é ajudar jovens a alcançarem os seus
                  sonhos académicos através de uma preparação eficiente,
                  organizada e acessível.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* MISSÃO VISÃO VALORES */}
        <Row className="mt-5 g-4">

          <Col md={4}>
            <Card className="h-100 border-0 shadow">
              <Card.Body className="text-center p-4">
                <FaBullseye
                  size={50}
                  color="#2563eb"
                  className="mb-3"
                />

                <h4>Missão</h4>

                <p>
                  Democratizar o acesso ao conhecimento através da
                  tecnologia e de conteúdos educativos de qualidade.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow">
              <Card.Body className="text-center p-4">
                <FaEye
                  size={50}
                  color="#22c55e"
                  className="mb-3"
                />

                <h4>Visão</h4>

                <p>
                  Tornar-se uma referência nacional em preparação
                  académica digital para estudantes angolanos.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow">
              <Card.Body className="text-center p-4">
                <FaHeart
                  size={50}
                  color="#ef4444"
                  className="mb-3"
                />

                <h4>Valores</h4>

                <p>
                  Ética, compromisso, inovação, acessibilidade e foco
                  permanente no sucesso dos estudantes.
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* PERFIL */}
        <Row className="mt-5">
          <Col md={6}>
            <Card className="border-0 shadow h-100">
              <Card.Body className="text-center p-4">
                <FaStethoscope
                  size={55}
                  color="#16a34a"
                  className="mb-3"
                />

                <h4>Área Académica</h4>

                <p>
                  Estudante do 2º ano de Medicina com paixão pela
                  aprendizagem contínua e desenvolvimento pessoal.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow h-100">
              <Card.Body className="text-center p-4">
                <FaLaptopCode
                  size={55}
                  color="#2563eb"
                  className="mb-3"
                />

                <h4>Desenvolvimento de Software</h4>

                <p>
                  Programador focado em soluções web modernas para
                  educação, gestão académica e transformação digital.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ESTATÍSTICAS */}
        <Row className="mt-5 text-center g-4">

          <Col md={4}>
            <Card className="border-0 shadow p-4">
              <FaBookOpen size={45} color="#f59e0b" />
              <h2 className="mt-3">+100</h2>
              <p>Materiais Educativos</p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow p-4">
              <FaUsers size={45} color="#2563eb" />
              <h2 className="mt-3">+500</h2>
              <p>Estudantes Impactados</p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow p-4">
              <FaBullseye size={45} color="#22c55e" />
              <h2 className="mt-3">100%</h2>
              <p>Foco na Qualidade</p>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
}