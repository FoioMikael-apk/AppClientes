// src/components/OrcamentoList.tsx atualizado com botão de novo orçamento e layout melhorado
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import"./OrcamentoList.css";

type Orcamento = {
  id: number;
  cliente_nome: string;
  tecnico: string;
  data_emissao: string;
  validade: string;
  total: string;
};

export default function OrcamentoList() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [filtro, setFiltro] = useState({ cliente: '', tecnico: '', data: '', valorMin: '', valorMax: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/orcamentos').then((res) => setOrcamentos(res.data));
  }, []);

  const exportarPDF = (id: number) => {
    window.open(`http://localhost:3001/orcamentos/${id}/pdf`, '_blank');
  };

  const imprimir = (id: number) => {
    window.open(`/imprimir-orcamento/${id}`, '_blank');
  };

  const filtrar = (o: Orcamento) => {
    const dentroCliente = o.cliente_nome.toLowerCase().includes(filtro.cliente.toLowerCase());
    const dentroTecnico = o.tecnico.toLowerCase().includes(filtro.tecnico.toLowerCase());
    const dentroData = !filtro.data || o.data_emissao === filtro.data;
    const dentroValorMin = !filtro.valorMin || parseFloat(o.total) >= parseFloat(filtro.valorMin);
    const dentroValorMax = !filtro.valorMax || parseFloat(o.total) <= parseFloat(filtro.valorMax);
    return dentroCliente && dentroTecnico && dentroData && dentroValorMin && dentroValorMax;
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Orçamentos Emitidos</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form className="flex-grow-1 me-3">
          <Row className="g-2">
            <Col md={3}><Form.Control placeholder="Filtrar por cliente" value={filtro.cliente} onChange={e => setFiltro({ ...filtro, cliente: e.target.value })} /></Col>
            <Col md={3}><Form.Control placeholder="Filtrar por técnico" value={filtro.tecnico} onChange={e => setFiltro({ ...filtro, tecnico: e.target.value })} /></Col>
            <Col md={2}><Form.Control type="date" value={filtro.data} onChange={e => setFiltro({ ...filtro, data: e.target.value })} /></Col>
            <Col md={2}><Form.Control placeholder="Valor mín" value={filtro.valorMin} onChange={e => setFiltro({ ...filtro, valorMin: e.target.value })} /></Col>
            <Col md={2}><Form.Control placeholder="Valor máx" value={filtro.valorMax} onChange={e => setFiltro({ ...filtro, valorMax: e.target.value })} /></Col>
          </Row>
        </Form>
        <Button variant="success" onClick={() => navigate('/orcamentos/novo')}>+ Novo Orçamento</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Técnico</th>
            <th>Emissão</th>
            <th>Validade</th>
            <th>Total (R$)</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.filter(filtrar).map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.cliente_nome}</td>
              <td>{o.tecnico}</td>
              <td>{o.data_emissao}</td>
              <td>{o.validade}</td>
              <td>{parseFloat(o.total).toFixed(2).replace('.', ',')}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <Button size="sm" variant="info" onClick={() => navigate(`/orcamentos/${o.id}`)}>Editar</Button>
                  <Button size="sm" variant="danger" className="me-1" onClick={() => exportarPDF(o.id)}>PDF</Button>
                  <Button size="sm" variant="secondary" onClick={() => imprimir(o.id)}>Imprimir</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
