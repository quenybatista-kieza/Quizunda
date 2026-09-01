import React, { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import CoursesSearchBar from "../components/CoursesSearchBar";
import { Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import "./CoursesPage.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cursos");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (query) => setSearchQuery(query);
  const handleFilterByCountry = (country) => setCountryFilter(country);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter ? course.country === countryFilter : true;
    return matchesSearch && matchesCountry;
  });

  const predefinedAreas = [
    "Ciências da Saúde",
    "Ciências Sociais e Humanas",
    "Ciências das Engenharias"
  ];

  const normalizeText = (text) => {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const groupedCourses = predefinedAreas.reduce((groups, area) => {
    groups[area] = filteredCourses.filter(
      (course) =>
        normalizeText(course.area).toLowerCase() ===
        normalizeText(area).toLowerCase()
    );
    return groups;
  }, {});

  const areaColors = {
    "Ciências da Saúde": "success",
    "Ciências Sociais": "primary",
    "Ciências Agronômicas": "warning",
    "Ciências das Engenharias": "info"
  };

  // Função para abrir modal e buscar apenas "details"
  const handleShowInfo = async (courseId) => {
    setLoadingCourse(true);
    setShowModal(true);
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Erro ao buscar detalhes do curso");
      const data = await res.json();
      setCourseDetails(data.details || "Sem detalhes disponíveis.");
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
      setCourseDetails("Não foi possível carregar detalhes.");
    } finally {
      setLoadingCourse(false);
    }
  };

  return (
    <div>
      <AppNavbar onFilterByCountry={handleFilterByCountry} />
      <CoursesSearchBar onSearch={handleSearch} />

      <div style={{ padding: "20px" }}>
        {predefinedAreas.map((area) => (
          <div key={area} style={{ marginBottom: "40px", display: "flex" }}>
            <div
              style={{
                width: "6px",
                backgroundColor: areaColors[area],
                borderRadius: "3px",
                marginRight: "15px"
              }}
            ></div>

            <div style={{ marginBottom: "40px" }}>
              <div
                style={{
                  marginBottom: "20px",
                  paddingBottom: "8px",
                  borderBottom: `4px solid ${areaColors[area]}`,
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: "gray",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                {area}
              </div>

              <Row>
                {groupedCourses[area].length > 0 ? (
                  groupedCourses[area].map((course) => (
                    <Col key={course.id} md="auto" className="mb-3">
                      <Card className="h-100 shadow-sm border-1">
                        <Card.Body className="d-flex flex-column">
                          {/* Botão de informação */}
                          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px" }}>
                            <Button
                              variant="light"
                              style={{
                                backgroundColor: "#fff",
                                color: "#000",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                              }}
                              onClick={() => handleShowInfo(course.id)}
                            >
                              <FaInfoCircle />
                            </Button>
                          </div>

                          {/* Thumbnail */}
                          <div style={{ marginBottom: "15px" }}>
                            <img
                              src={`http://localhost:5000${course.thumbnail}`}
                              alt={course.title}
                              className="img-fluid"
                              style={{
                                borderRadius: "8px",
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                              }}
                            />
                          </div>

                          <Card.Title style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                            {course.title}
                          </Card.Title>
                          <Card.Text style={{ flexGrow: 1 }}>
                            {course.descrição}
                          </Card.Text>
                          <Card.Text>
                            <strong>País:</strong> {course.country} <br />
                            <strong>Duração:</strong> {course.duration} <br />
                            <strong>Preço:</strong> {course.price} Kz
                          </Card.Text>

                          {/* Botão Comprar */}
<Button
  variant="dark"
  className="mt-auto w-100"
  onClick={() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Você precisa estar logado para acessar a área Banco.");
      return;
    }

    if (user.role !== "estudante") {
      alert("Apenas estudantes podem acessar a área Banco.");
      return;
    }

    // 🔹 Se passou nas verificações, navega para a tela Banco
    window.location.href = "/banco";
  }}
>
  <FaShoppingCart style={{ marginRight: "8px" }} />
  Comprar
</Button>


                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p style={{ color: "#777" }}>Nenhum curso disponível nesta área.</p>
                )}
              </Row>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de informações (apenas details) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingCourse ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Carregando detalhes...</p>
            </div>
          ) : (
            <p>{courseDetails}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
