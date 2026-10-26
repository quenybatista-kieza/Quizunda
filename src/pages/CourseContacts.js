
import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

const API_URL = "http://localhost:5000/api/course-contacts";

const initialForm = {
  course_id: '',
  support_whatsapp: '',
  payment_whatsapp: '',
};

export default function CourseContacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar todos os contactos
  async function loadContacts() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Não foi possível carregar os contactos.');
      }

      const data = await response.json();
      setContacts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  // Selecionar um registo para edição
  async function editContact(id) {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error('Contacto não encontrado.');
      }

      const contact = await response.json();

      setSelectedId(contact.id);
      setForm({
        course_id: String(contact.course_id ?? ''),
        support_whatsapp: contact.support_whatsapp ?? '',
        payment_whatsapp: contact.payment_whatsapp ?? '',
      });
    } catch (err) {
      setError(err.message);
    }
  }

  // Atualizar um registo pelo ID
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedId) {
      setError('Seleciona um contacto antes de atualizar.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: Number(form.course_id),
          support_whatsapp: form.support_whatsapp.trim(),
          payment_whatsapp: form.payment_whatsapp.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || 'Erro ao atualizar o contacto.'
        );
      }

      setSuccess('Contacto atualizado com sucesso!');
      await loadContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    const id = Number(searchId);

    if (!Number.isInteger(id) || id <= 0) {
      setError('Introduz um ID válido.');
      return;
    }

    editContact(id);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setSelectedId(null);
    setForm(initialForm);
    setError('');
    setSuccess('');
  }

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold mb-1">Contactos dos Cursos</h2>
          <p className="text-muted mb-0">
            Consulta e atualiza os números de WhatsApp dos cursos.
          </p>
        </Col>

        <Col xs="auto">
          <Badge bg="primary" className="p-2">
            {contacts.length} registos
          </Badge>
        </Col>
      </Row>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* Pesquisa por ID */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="mb-3">Pesquisar contacto</h5>

          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col md={9}>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="Introduz o ID do contacto"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                />
              </Col>

              <Col md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                >
                  Pesquisar por ID
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Formulário de edição */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              {selectedId
                ? `Editar contacto #${selectedId}`
                : 'Dados do contacto'}
            </h5>

            {selectedId && (
              <Badge bg="warning" text="dark">
                Em edição
              </Badge>
            )}
          </div>

          {!selectedId && (
            <Alert variant="info">
              Pesquisa um ID ou seleciona um registo na tabela
              para editar os seus dados.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>ID do curso</Form.Label>
                  <Form.Control
                    type="number"
                    name="course_id"
                    min="1"
                    value={form.course_id}
                    onChange={handleChange}
                    required
                    disabled={!selectedId}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>WhatsApp de suporte</Form.Label>
                  <Form.Control
                    type="tel"
                    name="support_whatsapp"
                    maxLength={20}
                    placeholder="Ex.: 244923000000"
                    value={form.support_whatsapp}
                    onChange={handleChange}
                    required
                    disabled={!selectedId}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>WhatsApp de pagamento</Form.Label>
                  <Form.Control
                    type="tel"
                    name="payment_whatsapp"
                    maxLength={20}
                    placeholder="Ex.: 244923000001"
                    value={form.payment_whatsapp}
                    onChange={handleChange}
                    required
                    disabled={!selectedId}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button
                type="submit"
                variant="success"
                disabled={!selectedId || saving}
              >
                {saving ? (
                  <>
                    <Spinner
                      size="sm"
                      animation="border"
                      className="me-2"
                    />
                    A atualizar...
                  </>
                ) : (
                  'Guardar alterações'
                )}
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={resetForm}
              >
                Limpar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Tabela de contactos */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Lista de contactos</h5>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={loadContacts}
              disabled={loading}
            >
              {loading ? 'A carregar...' : 'Atualizar lista'}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">
                A carregar os contactos...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover striped bordered className="align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>ID do curso</th>
                    <th>WhatsApp suporte</th>
                    <th>WhatsApp pagamento</th>
                    <th>Última atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact.id}</td>
                        <td>{contact.course_id}</td>
                        <td>{contact.support_whatsapp}</td>
                        <td>{contact.payment_whatsapp}</td>
                        <td>
                          {contact.updated_at
                            ? new Date(
                                contact.updated_at
                              ).toLocaleString('pt-PT')
                            : '-'}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => editContact(contact.id)}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        Nenhum contacto encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
