
import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';

function ExamClasses() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/salas_e')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar salas.');
        }

        return response.json();
      })
      .then((data) => {
        setSalas(data);
      })
      .catch((error) => {
        setErro(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>A carregar salas...</p>
      </Container>
    );
  }

  if (erro) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{erro}</Alert>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Lista de Salas</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID do Curso</th>
            <th>Nome da Sala</th>
            <th>ID do Proprietário</th>
            <th>Data de Criação</th>
          </tr>
        </thead>

        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.id}</td>
              <td>{sala.courseId}</td>
              <td>{sala.roomName}</td>
              <td>{sala.ownerId}</td>
              <td>
                {sala.createdAt
                  ? new Date(sala.createdAt).toLocaleString('pt-PT')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {salas.length === 0 && (
        <Alert variant="info">
          Nenhuma sala encontrada.
        </Alert>
      )}
    </Container>
  );
}

export default ExamClasses;
