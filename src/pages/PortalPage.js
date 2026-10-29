import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Navbar, Nav, Button, Row, Col, Dropdown, Card } from "react-bootstrap";
import { FaGraduationCap, FaBook, FaFolderOpen, FaChartBar, FaVideo, FaHistory } from "react-icons/fa";
import ExamVerticalHistogram from "../components/ExamChart";
import { FaWhatsapp } from "react-icons/fa";
import { saveVideoOffline, getVideoOffline, getAllOfflineVideos,deleteVideoOffline } from "../components/indexedDB";


export default function PortalPage() {

  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  
  const [cursos, setCursos] = useState([]);
  const [supportWhatsapp, setSupportWhatsapp] = useState("");
  
  const [courses, setCourses] = useState([]);
  const [offlineVideos, setOfflineVideos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dadosCurso, setDadosCurso] = useState({
              videoLessonsArray: [],
              supportMaterials: []
            });

  const disciplinasBase = [
    { nome: "Matemática", respondidas: 0, naoRespondidas: 0 },
    { nome: "Física", respondidas: 0, naoRespondidas: 0 },
    { nome: "Química", respondidas: 0, naoRespondidas: 0 },
    { nome: "Biologia", respondidas: 0, naoRespondidas: 0 },
    { nome: "Língua Portuguesa", respondidas: 0, naoRespondidas: 0 }
  ];

  const [examHistory, setExamHistory] = useState([
    { data: null, disciplinas: disciplinasBase }
  ]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user){
            alert ("Usuario nao autenticado");
            return;
          }

          const res = await fetch("http://localhost:5000/api/compras",{
            headers: {
              "Authorization":`Bearer ${user.token}`
            }
          });
          if (!res.ok){
            throw new Error("Erro ao buscar cursos:" +res.status);
          }

          const data = await res.json();
          setCursos(data);
          console.log(data)

      }

      catch (err){
        console.error(err);
        alert("Erro ao carregar cursos comprados");
      }
    }
    fetchCursos();
  }, []);


  

  async function loadOfflineVideos() {
    const keys = await getAllOfflineVideos();
    setOfflineVideos(keys);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); 
  };

    useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const res = await fetch("http://localhost:5000/api/estatisticas", {
          headers: { "Authorization": `Bearer ${user.token}` }
        });

        const data = await res.json();

        // Copia a base
        const disciplinasAtualizadas = [...disciplinasBase];

        // Atualiza cada disciplina com os dados vindos do backend
        data.forEach(item => {
          const idx = disciplinasAtualizadas.findIndex(d => d.nome === item.disciplina);
          if (idx !== -1) {
            disciplinasAtualizadas[idx].respondidas = item.acertos;
            disciplinasAtualizadas[idx].naoRespondidas = item.errados;


          }
        });

        setExamHistory([{ data: new Date().toISOString().split("T")[0], disciplinas: disciplinasAtualizadas }]);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchEstatisticas();
  }, []);



  

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="mb-4 px-3 shadow-sm">
        <Navbar.Brand href="#" className="me-4">
          <img src="/chapeu.png" alt="Logo" height="80" style={{ marginRight: "15px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            
            <Dropdown>
              <Dropdown.Toggle variant="light">Perfil</Dropdown.Toggle>
              <Dropdown.Menu>
                
                <Dropdown.Item href="/">Home</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => handleLogout(navigate)}>
                  Terminar Sessão
                </Dropdown.Item> 
                      <Dropdown.Item
                    onClick={() => {

                      if (!supportWhatsapp) {
                        alert("Selecione primeiro um curso.");
                        return;
                      }

                      const mensagem = encodeURIComponent(
                        "Olá! Preciso de ajuda com o curso."
                      );

                      window.open(
                        `https://wa.me/${supportWhatsapp}?text=${mensagem}`,
                        "_blank"
                      );
                    }}
                  >
                    <FaWhatsapp
                      style={{
                        color: "#25D366",
                        marginRight: "8px"
                      }}
                    />

                    Suporte a Dúvidas
                  </Dropdown.Item>
                
               
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Button variant="warning" className="ms-3" onClick={()=> navigate("/ChangePage")}>
            <FaGraduationCap style={{ marginRight: "8px" }} />
            Acessar Sala de Exame
          </Button>
        </Navbar.Collapse>
      </Navbar>

      {/* Cursos Comprados: tinha um i nos cursos */}
<section className="mb-4">
  <h4><FaBook style={{ marginRight: "8px", color: "#27ae60" }}  /> Cursos Comprados</h4>
  <Row>
    {cursos.map((curso) => (
      <Col md={4} key={curso.id} className="mb-3">
        <Button
          variant="light"
          className="w-100 shadow-sm border-0 text-start p-3"
          onClick={async() => {

            try{
              const user = JSON.parse(localStorage.getItem("user"));
              if (!user){
                  alert ("Usuario nao autenticado");
                  return;
                }
              const res = await fetch(`http://localhost:5000/api/detalhes_c/${curso.id}`,{
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${user.token}`,
                  "Content-Type":"application/json"
                }
              });

              if (!res.ok){
                throw new Error("Erro na requisiçao:" + res.status);
              }

              const data = await res.json();
              setDadosCurso({
                videoLessonsArray: data.video_lessons || [],
                supportMaterials: data.support_materials || []
              });
              setSupportWhatsapp(data.support_whatsapp || "");
              console.log(data.support_materials)
            }catch (err){
              console.error("Erro ao buscar curso:", err)
            }
          }}
        >
          <div className="d-flex flex-column">
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {curso.title}
            </span>
            <small className="text-muted">{curso.description}</small>
          </div>
        </Button>
      </Col>
    ))}
  </Row>
</section>


      {/* Materiais + Gráfico */}
      <section className="mb-4">
        <Row>
          <Col md={6}>
            <h4>
              <FaFolderOpen style={{ marginRight: "8px", color: "#2980b9" }} /> Materiais de Apoio
            </h4>
            <ul>
              {dadosCurso.supportMaterials && dadosCurso.supportMaterials.length > 0 ? (
                dadosCurso.supportMaterials.map((material, idx) => (
                  <li key={idx}>
                    <a href={material.materialUrl} download>
                      {material.discipline}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-muted">Nenhum material disponível</li>
              )}
            </ul>
          </Col>

          <Col md={6}>
            <h4><FaChartBar  style={{ marginRight: "8px", color: "#8e44ad" }} /> Desempenho por Disciplina</h4>
            <ExamVerticalHistogram data={examHistory} />
          </Col>
        </Row>
      </section>

      {/* Vídeo Aulas + Histórico */}
      <section className="mb-4">
        <Row>
          {/* Vídeo Aulas no lado esquerdo */}
          <Col md={6}>
      <h4>
        <FaVideo style={{ marginRight: "8px", color: "#e67e22" }} /> Vídeo Aulas
      </h4>

      {/* Agrupando dinamicamente por disciplina */}
{Array.from(new Set(dadosCurso.videoLessonsArray.map(aula => aula.disciplina)))

  .map((disciplina, idx) => (

    <Dropdown key={idx} className="mb-2">
      <Dropdown.Toggle variant="secondary" className="w-100">
        {disciplina}
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100">
        {dadosCurso.videoLessonsArray
          .filter(aula => aula.disciplina === disciplina)
          .map((aula) => (
            <Dropdown.Item
              key={aula.id}
              onClick={() => setSelectedVideo(aula)}
            >
              {aula.title} – {aula.tema}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  ))}

{selectedVideo && (
  <div className="mt-3">
    <h5>{selectedVideo.title}</h5>
    <p className="text-muted">{selectedVideo.tema}</p>

    {/* 🔹 Player YouTube (online) */}
    <div className="ratio ratio-16x9 mb-3">
      <iframe
        src={selectedVideo.url}   // link do YouTube
        title={selectedVideo.title}
        allowFullScreen
      ></iframe>
    </div>





  </div>
)}

    </Col>
          <Col md={6} style={{ backgroundColor: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
  <h4 style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
    <FaHistory style={{ marginRight: "8px", color: "#f1c40f" }} /> Histórico de Exames
  </h4>
  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
    {examHistory.map((exame, i) => (
      <li 
        key={i} 
        style={{ 
          marginBottom: "15px", 
          padding: "12px", 
          backgroundColor: "#fff", 
          border: "1px solid #ddd", 
          borderRadius: "6px" 
        }}
      >
        <strong>Exame {i + 1}</strong><br />
        <small style={{ color: "#7f8c8d" }}>Data: {exame.data}</small>
        <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
          {exame.disciplinas.map((d, j) => (
            <li key={j} style={{ marginBottom: "4px" }}>
              <strong>{d.nome}</strong>: {d.respondidas} respondidas, {d.naoRespondidas} não respondidas
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
</Col>


        </Row>
      </section>
      


    </div>
  );
}
