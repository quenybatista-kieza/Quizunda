import { useState, useEffect } from 'react';
import { Navbar, Container, Button, ButtonGroup, Dropdown, Card, ProgressBar } from 'react-bootstrap';
import {useNavigate} from "react-router-dom"


function Exame() {
  const [perguntas, setPerguntas] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [indexAtual, setIndexAtual] = useState(0); //perguntaAtual
  const [tempo, setTempo] = useState(3 * 60 * 60); // 3 horas em segundos
  const [rodando, setRodando] = useState(false);
  const [qtdPerguntas, setQtdPerguntas] = useState(10);
  const [bloqueado, setBloqueado] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [respostaClicada, setRespostaClicada] = useState(null); // resposta selecionada

  const pergunta = perguntas[indexAtual];
  const navigate = useNavigate();

  // Carregar perguntas do backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/perguntas?limit=${qtdPerguntas}`)
     .then(res => res.json())
     .then(data => setPerguntas(data));
  }, [qtdPerguntas]);

  //verificar resposta

      function verificarResposta(letra){
      if (bloqueado) return;

      const pergunta = perguntas[indexAtual];
      setRespostaClicada(letra);
      setBloqueado(true);

      const disciplina = pergunta.disciplina_0;

      setEstatisticas(prev => {
        const atual = prev[disciplina] || { acertos: 0, erros: 0, disciplina };
        if (letra === pergunta.correctAnswer) {
          return { 
            ...prev, 
            [disciplina]: { 
              disciplina, 
              acertos: atual.acertos + 1, 
              erros: atual.erros 
            }
          };
        } else {
          return { 
            ...prev, 
            [disciplina]: { 
              disciplina, 
              acertos: atual.acertos, 
              erros: atual.erros + 1 
            }
          };
        }
      });

      if(letra === pergunta.correctAnswer){
        setAcertos(acertos + 1);
        setTimeout(()=>proximaPergunta(),1000);
      }else{
        setErros(erros + 1);
        setTimeout(()=>proximaPergunta(),5000);
      }
    }

    const finalizarExame = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      fetch("http://localhost:5000/api/estatisticas", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          estatisticas,
          userId: user.id   // 🔹 adiciona o id do usuário
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Estatísticas salvas:", data);
          navigate("/PortalPage");
        })
        .catch(err => console.error("Erro ao salvar estatísticas:", err));
    };



  function proximaPergunta(){
    setRespostaClicada(null);
    setBloqueado(false);
    setIndexAtual(indexAtual + 1);
  }

  function getCorBotao(letra){
    if(!respostaClicada) return '';

    if (letra === pergunta.correctAnswer) return 'verde';

    if (letra === respostaClicada && letra!== pergunta.correctAnswer) return 'vermelho';

    return '';
  }

  // Cronômetro
  useEffect(() => {
    let timer;
    if (rodando && tempo > 0) {
      timer = setInterval(() => setTempo(t => t - 1), 1000);
    }
    if (tempo === 0) setRodando(false);
    return () => clearInterval(timer);
  }, [rodando, tempo]);

  const formatarTempo = (seg) => {
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const responder = (letra) => {
    if (bloqueado) return;
    setBloqueado(true);
    setRespostaClicada(letra);

   

    setTimeout(() => {
      proximaPergunta();
    }, 1500); // 1.5s pra mostrar verde/vermelho
  };


  const iniciarExame = () => {
    setRodando(true);
    setIndexAtual(0);
    setAcertos(0);
    setErros(0);
    setTempo(3 * 60 * 60);
  };

  

 
  return (
    <div>
          {/* NAVBAR */}
    <Navbar bg="light" variant="light" expand="md" className="mb-4 shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <img src="/urnm.png" alt="Kieza" width="60" height="60" />
          <span className="fw-bold text-dark">Kieza Exame</span>
        </Navbar.Brand>

        {/* Toggle para telas pequenas */}
        <Navbar.Toggle aria-controls="navbar-responsivo" />

        {/* Conteúdo colapsável */}
        <Navbar.Collapse id="navbar-responsivo" className="justify-content-end">
          {/* Tempo formatado */}
          <Navbar.Text className="text-secondary fs-5 fw-semibold me-3">
            {formatarTempo(tempo)}
          </Navbar.Text>

          {/* Botões */}
          <div className="d-flex flex-wrap gap-2">
            {/* Botão Finalizar Exame */}
            <Button variant="secondary" onClick={finalizarExame}>
              Finalizar Exame
            </Button>

            {/* Dropdown Perguntas */}
            <Dropdown as={ButtonGroup}>
              <Button variant="outline-dark">Perguntas: {qtdPerguntas}</Button>
              <Dropdown.Toggle split variant="outline-dark" />
              <Dropdown.Menu>
                {[50, 100].map(n => (
                  <Dropdown.Item key={n} onClick={() => setQtdPerguntas(n)}>
                    {n} Perguntas
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Botão Iniciar Exame */}
            <Button variant="success" onClick={iniciarExame} disabled={rodando}>
              Iniciar Exame
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>



      {/* PAINEL DA PERGUNTA */}
      {/* Barra de progresso só aparece se exame estiver rodando */}
{rodando && (
  <ProgressBar 
    now={((indexAtual + 1) / perguntas.length) * 100} 
    className="mb-4" 
    variant="info" 
    animated 
  />
)}

{/* Painel da pergunta só aparece se exame estiver rodando */}
{rodando && pergunta && (
  <Card className="shadow-lg border-0">
    <Card.Body>
      <Card.Title className="fw-bold fs-4 text-primary mb-3">
        Questão {indexAtual + 1} de {perguntas.length}
      </Card.Title>

        {/* Tema da questão */}
      <Card.Title className="fs-6 text-primary fw-bold mb-2">
        Tema: {pergunta.tema_0}
      </Card.Title>

      <Card.Text className="fs-5 mb-4 text-dark">
        {pergunta.question}
      </Card.Text>

      {pergunta.options.map((opcao, index) => {
        const letra = ['A','B','C','D','E'][index];
        const cor = getCorBotao(letra);

        return (
          <Button
            key={index}
            onClick={() => verificarResposta(letra)}
            className="w-100 mb-2 text-start rounded-pill shadow-sm"
            disabled={!rodando || bloqueado} // 🔹 só habilita se exame rodando
            style={{
              backgroundColor: cor === 'verde' ? '#4CAF50' 
                              : cor === 'vermelho' ? '#f44336' 
                              : '#f8f9fa',
              color: cor ? '#fff' : '#000',
              border: cor ? 'none' : '1px solid #dee2e6'
            }}
          >
            <strong>{letra})</strong> {opcao}
          </Button>
        );
      })}

      <Button 
        variant="secondary" 
        className="mt-4 w-100 rounded-pill" 
        onClick={proximaPergunta} 
        disabled={!rodando}
      >
        ➡️ Pular / Próxima
      </Button>
    </Card.Body>
  </Card>
)}

{/* Rodapé com placar só aparece se exame estiver rodando */}
{rodando && (
  <div className="mt-4 text-center fs-5">
    <span className="text-success fw-bold">✔ Acertos: {acertos}</span> |{" "}
    <span className="text-danger fw-bold">✘ Erros: {erros}</span>
  </div>
)}


    </div>
  );
}

export default Exame;