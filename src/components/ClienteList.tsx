import { useEffect, useState } from 'react';
import axios from 'axios';
import HistoricoFinanceiro from './HistoricoFinanceiro';
import ClienteEditModal from './ClienteEditModal';
import {
  Container, Row, Col, Button, Card, Modal,
  Pagination, Form, Badge
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FileEarmarkPdf, FileEarmarkExcel, Pencil, ClockHistory } from 'react-bootstrap-icons';

const CLIENTES_POR_PAGINA = 6;

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  cliente_desde: string;
  situacao: string;
  bom_pagador: boolean;
  cpf?: string;
  email?: string;
};

export default function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('Todos');
  const [selecionados, setSelecionados] = useState<number[]>([]);

  const fetchClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/clientes');
      setClientes(res.data);
    } catch {
      toast.error('Erro ao buscar clientes.');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const exportPDF = () => {
    const query = selecionados.length ? `?ids=${selecionados.join(',')}` : '';
    toast.info('Exportando PDF...');
    window.open(`http://localhost:3001/clientes/export/pdf${query}`, '_blank');
  };

  const exportExcel = () => {
    const query = selecionados.length ? `?ids=${selecionados.join(',')}` : '';
    toast.info('Exportando Excel...');
    window.open(`http://localhost:3001/clientes/export/excel${query}`, '_blank');
  };

  const abrirHistorico = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setMostrarHistorico(true);
  };

  const abrirEdicao = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setMostrarEdicao(true);
  };

  const toggleSelecionado = (id: number) => {
    setSelecionados(prev => prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
    );
  };

  const clientesFiltrados = clientes.filter(c => {
    const correspondeBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca);
    const correspondeSituacao = filtroSituacao === 'Todos' || c.situacao === filtroSituacao;
    return correspondeBusca && correspondeSituacao;
  });

  const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaAtual - 1) * CLIENTES_POR_PAGINA,
    paginaAtual * CLIENTES_POR_PAGINA
  );

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col><h2 className="fw-bold">Clientes</h2></Col>
        <Col className="text-end">
          <Button variant="outline-danger" className="me-2" onClick={exportPDF}>
            <FileEarmarkPdf className="me-1" /> PDF
          </Button>
          <Button variant="outline-success" onClick={exportExcel}>
            <FileEarmarkExcel className="me-1" /> Excel
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nome ou telefone"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={filtroSituacao} onChange={e => setFiltroSituacao(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </Form.Select>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={2} className="g-4">
        {clientesPaginados.map(c => (
          <Col key={c.id}>
            <Card className={`shadow-sm border-0 ${selecionados.includes(c.id) ? 'border-primary' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <Form.Check
                    checked={selecionados.includes(c.id)}
                    onChange={() => toggleSelecionado(c.id)}
                  />
                  <div className="ms-2 w-100">
                    <Card.Title className="text-primary fw-semibold d-flex justify-content-between">
                      {c.nome}
                      <Badge bg={c.situacao === 'Ativo' ? 'success' : 'secondary'}>{c.situacao}</Badge>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">{c.telefone}</Card.Subtitle>
                    <Card.Text className="mb-2 small">
                      <strong>Endereço:</strong> {c.endereco || 'N/A'}<br />
                      <strong>Cliente desde:</strong> {c.cliente_desde}<br />
                      <strong>CPF:</strong> {c.cpf || 'N/A'}<br />
                      <strong>Email:</strong> {c.email || 'N/A'}<br />
                      <strong>Bom Pagador:</strong> {c.bom_pagador ? 'Sim' : 'Não'}
                    </Card.Text>
                    <div className="text-end">
                      <Button variant="outline-primary" size="sm" onClick={() => abrirHistorico(c)} className="me-2">
                        <ClockHistory /> Histórico
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => abrirEdicao(c)}>
                        <Pencil /> Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {[...Array(totalPaginas)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === paginaAtual}
              onClick={() => setPaginaAtual(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* Modal Histórico */}
      <Modal size="xl" show={mostrarHistorico} onHide={() => setMostrarHistorico(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Histórico Financeiro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteSelecionado && <HistoricoFinanceiro clienteId={clienteSelecionado.id} />}
        </Modal.Body>
      </Modal>

      {/* Modal Edição */}
      <ClienteEditModal
        show={mostrarEdicao}
        onHide={() => setMostrarEdicao(false)}
        cliente={clienteSelecionado}
        onUpdated={() => {
          fetchClientes();
          toast.success('Cliente atualizado com sucesso!');
        }}
      />
    </Container>
  );
}
