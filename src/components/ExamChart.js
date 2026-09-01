import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

export default function ExamVerticalHistogram() {
  const [disciplinas, setDisciplinas] = useState([]);

  // 🔹 Paleta de cores para cada disciplina
  const colors = ["#f6c23e", "#36b9cc", "#e74a3b", "#4e73df", "#1cc88a"];

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const res = await fetch("http://localhost:5000/api/estatisticas", {
          headers: { "Authorization": `Bearer ${user.token}` }
        });

        if (!res.ok) throw new Error("Erro ao buscar estatísticas");

        const data = await res.json();

        // 🔹 Ajusta para pegar disciplina + percentual
        const disciplinasAtualizadas = data.map(item => ({
          nome: item.disciplina,
          percentual: item.percentual || 0
        }));

        setDisciplinas(disciplinasAtualizadas);
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      }
    };

    fetchEstatisticas();
  }, []);

  return (
    <div
      style={{
        border: "2px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#fafafa"
      }}
    >
      <Row className="justify-content-center align-items-end" style={{ height: "250px" }}>
        {disciplinas.map((item, i) => (
          <Col
            key={i}
            xs={2}
            className="text-center"
            style={{ padding: "0 5px" }}
          >
            {/* Percentual + nome acima da barra */}
            <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {item.nome} <br /> {Math.round(item.percentual)}%
            </div>

            {/* Barra vertical */}
            <div
              style={{
                backgroundColor: colors[i % colors.length],
                height: `${item.percentual * 2}px`, // escala para altura
                width: "100%",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto"
              }}
            ></div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
