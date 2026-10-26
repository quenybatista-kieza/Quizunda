
import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';

function ExamQuestions() {
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [aGuardar, setAGuardar] = useState(false);
  const [aEliminar, setAEliminar] = useState(null);

  const formularioInicial = {
    roomId: '',
    question: '',
    correctAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: '',
    wrongAnswer4: '',
    ownerId: '',
    tema: '',
    disciplina: ''
  };

  const [form, setForm] = useState(formularioInicial);

  async function carregarPerguntas() {
    try {
      setErro('');

      const response = await fetch(
        'http://localhost:5000/api/perguntas'
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar perguntas.');
      }

      const data = await response.json();
      setPerguntas(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPerguntas();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function adicionarPergunta(e) {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setAGuardar(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/perguntas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...form,
            roomId: Number(form.roomId),
            ownerId: Number(form.ownerId)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível adicionar a pergunta.'
        );
      }

      setMensagem(data.message);
      setForm(formularioInicial);

      await carregarPerguntas();
    } catch (error) {
      setErro(error.message);
    } finally {
      setAGuardar(false);
    }
  }

  async function eliminarPergunta(id) {
    const confirmar = window.confirm(
      `Tens a certeza de que queres eliminar a pergunta com ID ${id}?`
    );

    if (!confirmar) return;

    setErro('');
    setMensagem('');
    setAEliminar(id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/perguntas/${id}`,
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível eliminar a pergunta.'
        );
      }

      setMensagem(data.message);
      await carregarPerguntas();
    } catch (error) {
      setErro(error.message);
    } finally {
      setAEliminar(null);
    }
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>A carregar perguntas...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Gestão de Perguntas</h2>

      {erro && (
        <Alert variant="danger" dismissible onClose={() => setErro('')}>
          {erro}
        </Alert>
      )}

      {mensagem && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setMensagem('')}
        >
          {mensagem}
        </Alert>
      )}

      <h4 className="mb-3">Adicionar pergunta a uma sala</h4>

      <Form onSubmit={adicionarPergunta} className="mb-5">
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>ID da sala (roomId)</Form.Label>
              <Form.Control
                type="number"
                name="roomId"
                min="1"
                value={form.roomId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>ID do proprietário (ownerId)</Form.Label>
              <Form.Control
                type="number"
                name="ownerId"
                min="1"
                value={form.ownerId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Tema</Form.Label>
              <Form.Control
                name="tema"
                value={form.tema}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Disciplina</Form.Label>
              <Form.Control
                name="disciplina"
                value={form.disciplina}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Pergunta</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="question"
            value={form.question}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Resposta correta</Form.Label>
          <Form.Control
            name="correctAnswer"
            value={form.correctAnswer}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          {[1, 2, 3, 4].map((numero) => (
            <Col md={6} key={numero}>
              <Form.Group className="mb-3">
                <Form.Label>Resposta errada {numero}</Form.Label>
                <Form.Control
                  name={`wrongAnswer${numero}`}
                  value={form[`wrongAnswer${numero}`]}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Button type="submit" variant="primary" disabled={aGuardar}>
          {aGuardar ? 'A guardar...' : 'Adicionar pergunta'}
        </Button>
      </Form>

      <h4 className="mb-3">Lista de perguntas</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room ID</th>
            <th>Pergunta</th>
            <th>Resposta correta</th>
            <th>Respostas erradas</th>
            <th>Tema</th>
            <th>Disciplina</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {perguntas.map((pergunta) => (
            <tr key={pergunta.id}>
              <td>{pergunta.id}</td>
              <td>{pergunta.roomId}</td>
              <td>{pergunta.question}</td>
              <td>{pergunta.correctAnswer}</td>

              <td>
                <ul className="mb-0">
                  {[
                    pergunta.wrongAnswer1,
                    pergunta.wrongAnswer2,
                    pergunta.wrongAnswer3,
                    pergunta.wrongAnswer4
                  ]
                    .filter(Boolean)
                    .map((resposta, index) => (
                      <li key={index}>{resposta}</li>
                    ))}
                </ul>
              </td>

              <td>{pergunta.tema}</td>
              <td>{pergunta.disciplina}</td>

              <td>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={aEliminar !== null}
                  onClick={() => eliminarPergunta(pergunta.id)}
                >
                  {aEliminar === pergunta.id
                    ? 'A eliminar...'
                    : 'Eliminar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {perguntas.length === 0 && (
        <Alert variant="info">
          Nenhuma pergunta encontrada.
        </Alert>
      )}
    </Container>
  );
}

export default ExamQuestions;
