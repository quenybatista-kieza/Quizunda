
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaBookOpen,
  FaArrowRight,
} from "react-icons/fa";

const pessoas = [
  {
    foto: "/QJ.jpeg",
    nome: "Batista Do Rosário Da Silva Quizunda",
    cargo: "Fundador e Desenvolvedor",
    descricao:
      "Estudante do 2.º ano da Faculdade de Medicina da Universidade Rainha Njinga Mbande e desenvolvedor de software. Criador da Plataforma Kieza, com foco na educação digital, inovação tecnológica e preparação académica de qualidade.",
  },
  {
    foto: "/gel.jpg",
    nome: "Gelson Teodoro Pedro Quindua",
    cargo: "Desenvolvedor de Software e Game Dev",
    descricao:
      "Contribui para o desenvolvimento tecnológico da Kieza, partilhando conhecimentos e competências para promover a inovação e melhorar a preparação académica dos estudantes.",
  },
  {
    foto: "/Logótipo Baoba CTI_ Árvore Tecnológica.png",
    nome: "Baoba C.T.I",
    cargo: "Empresa Apoiadora",
    descricao:
      "Startup dedicada à Ciência, Tecnologia e Inovação, que se identificou com o propósito da Kieza e assumiu o papel de principal empresa apoiadora da plataforma.",
  },
];

const cards = [
  {
    numero: "01",
    titulo: "A Nossa História",
    subtitulo: "Como tudo começou",
    icon: FaBookOpen,
    cor: "#2563eb",
    fundo: "#eff6ff",
    destaque: true,
    descricao:
      "A Kieza nasceu da necessidade de tornar a preparação académica mais acessível, organizada e eficiente para os estudantes. Idealizada por Batista do Rosário da Silva Quizunda, a plataforma surgiu da união entre a experiência académica e a paixão pela tecnologia, com o propósito de ajudar jovens a superar desafios e alcançar os seus objetivos. Através de materiais educativos, videoaulas e exames simulados, trabalhamos para transformar a forma como os estudantes aprendem e se preparam para o futuro.",
  },
  {
    numero: "02",
    titulo: "Missão",
    subtitulo: "O que nos move",
    icon: FaBullseye,
    cor: "#059669",
    fundo: "#ecfdf5",
    destaque: false,
    descricao:
      "Democratizar o acesso ao conhecimento através da tecnologia, disponibilizando recursos educativos de qualidade que apoiem a aprendizagem e a preparação académica dos estudantes.",
  },
  {
    numero: "03",
    titulo: "Visão",
    subtitulo: "Onde queremos chegar",
    icon: FaEye,
    cor: "#7c3aed",
    fundo: "#f5f3ff",
    destaque: false,
    descricao:
      "Tornar a Kieza uma referência nacional em educação digital e preparação académica, contribuindo para um futuro em que cada estudante tenha melhores oportunidades de aprendizagem.",
  },
  {
    numero: "04",
    titulo: "Os Nossos Valores",
    subtitulo: "Aquilo em que acreditamos",
    icon: FaHeart,
    cor: "#e11d48",
    fundo: "#fff1f2",
    destaque: false,
    descricao:
      "Guiamo-nos pela ética, inovação, compromisso, acessibilidade e qualidade. Acreditamos que a tecnologia deve servir as pessoas e que cada estudante merece ferramentas que incentivem o seu crescimento e sucesso.",
  },
];

export default function SobreNos() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const pessoa = pessoas[activeIndex];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pessoas.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Apresentação */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #172554 55%, #1e3a8a 100%)",
          color: "#fff",

        }}
      >
        <Container>
          <Row className="align-items-center g-5">
            <Col md={4} className="text-center">
              <div
                className="mx-auto rounded-4 overflow-hidden shadow-lg"
                style={{
                  maxWidth: "320px",
                  border: "3px solid rgba(147,197,253,.5)",
                  background: "#fff",
                }}
              >
                
              <img
                key={pessoa.foto}
                src={pessoa.foto}
                alt={pessoa.nome}
                className="img-fluid w-100"
                style={{
                  height: "320px",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  display: "block",
                }}
              />

              </div>

              <div className="d-flex justify-content-center gap-2 mt-4">
                {pessoas.map((item, index) => (
                  <Button
                    key={item.nome}
                    type="button"
                    variant="light"
                    onClick={() => setActiveIndex(index)}
                    aria-label={"Ver perfil de " + item.nome}
                    aria-pressed={activeIndex === index}
                    className="rounded-pill p-0 border-0"
                    style={{
                      width: activeIndex === index ? "32px" : "10px",
                      height: "10px",
                      background:
                        activeIndex === index
                          ? "#60a5fa"
                          : "rgba(255,255,255,.4)",
                      transition: "width .3s ease",
                    }}
                  />
                ))}
              </div>
            </Col>

            <Col md={8}>
              <span
                className="text-uppercase fw-bold"
                style={{
                  color: "#93c5fd",
                  fontSize: ".8rem",
                  letterSpacing: "2px",
                }}
              >
                Educação · Tecnologia · Futuro
              </span>

              <h1 className="display-5 fw-bold mt-3 mb-4">
                Sobre a Plataforma Kieza
              </h1>

              <h2
                className="h4 fw-bold mb-2"
                style={{ color: "#bfdbfe" }}
              >
                {pessoa.nome}
              </h2>

              <p
                className="fw-semibold mb-3"
                style={{ color: "#93c5fd" }}
              >
                {pessoa.cargo}
              </p>

              <p
                className="mb-4"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1rem",
                  lineHeight: 1.9,
                }}
              >
                {pessoa.descricao}
              </p>

              <Button
                href="/"
                variant="primary"
                size="lg"
                className="rounded-pill px-4 py-2 fw-semibold"
              >
                Voltar à página inicial
                <FaArrowRight className="ms-2" size={13} />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* História, missão, visão e valores */}
      <Container className="py-5">
        <div className="text-center mb-5 mx-auto" style={{ maxWidth: "750px" }}>
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "#dbeafe",
              color: "#1d4ed8",
              letterSpacing: "1px",
            }}
          >
            QUEM SOMOS
          </span>

          <h2 className="display-6 fw-bold mb-3">
            Conheça a essência da Kieza
          </h2>

          <p className="text-secondary fs-5">
            Mais do que uma plataforma, somos um projeto que une educação e
            tecnologia para criar melhores oportunidades de aprendizagem.
          </p>
        </div>

        <Row className="g-4">
          {cards.map((item) => {
            const Icone = item.icon;

            return (
              <Col
                xs={12}
                md={item.destaque ? 12 : 4}
                key={item.numero}
              >
                <Card
                  className="h-100 rounded-4 overflow-hidden"
                  style={{
                    border: item.destaque
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",
                    borderTop: "4px solid " + item.cor,
                    boxShadow: item.destaque
                      ? "0 12px 35px rgba(37,99,235,.10)"
                      : "0 6px 22px rgba(15,23,42,.06)",
                    transition: "transform .2s ease, box-shadow .2s ease",
                  }}
                >
                  <Card.Body className={item.destaque ? "p-4 p-md-5" : "p-4"}>
                    <Row className="align-items-start g-3">
                      <Col xs="auto">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-4"
                          style={{
                            background: item.fundo,
                            color: item.cor,
                            width: item.destaque ? "68px" : "58px",
                            height: item.destaque ? "68px" : "58px",
                          }}
                        >
                          <Icone size={item.destaque ? 29 : 24} />
                        </div>
                      </Col>

                      <Col>
                        <div className="small fw-bold text-secondary mb-2">
                          {item.numero} / 04
                        </div>

                        <h3 className={item.destaque ? "h3 fw-bold mb-2" : "h5 fw-bold mb-2"}>
                          {item.titulo}
                        </h3>

                        <p
                          className="small fw-bold mb-3"
                          style={{ color: item.cor }}
                        >
                          {item.subtitulo}
                        </p>

                        <Card.Text
                          className="text-secondary mb-0"
                          style={{ lineHeight: 1.85 }}
                        >
                          {item.descricao}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Chamada final */}
        <div
          className="text-center rounded-4 p-4 p-md-5 mt-5"
          style={{
            background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
            border: "1px solid #dbeafe",
          }}
        >
          <h3 className="h3 fw-bold mb-3">
            O teu futuro começa com conhecimento.
          </h3>

          <p
            className="text-secondary mx-auto mb-4"
            style={{ maxWidth: "600px", lineHeight: 1.8 }}
          >
            Descobre os recursos da Kieza e dá o próximo passo na tua
            preparação académica.
          </p>

          <Button
            href="/"
            variant="primary"
            size="lg"
            className="rounded-pill px-4 fw-semibold"
          >
            Explorar a Kieza
            <FaArrowRight className="ms-2" size={13} />
          </Button>
        </div>
      </Container>
    </>
  );
}
