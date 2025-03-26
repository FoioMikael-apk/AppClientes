// HistoricoFinanceiro.tsx estilizado com Bootstrap
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

type Historico = {
  id?: number;
  cliente_id: number;
  mes: string;
  ano: string;
  valor_pago: number;
  bom_pagador: boolean;
};

type Props = {
  clienteId: number;
};

export default function HistoricoFinanceiro({ clienteId }: Props) {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [form, setForm] = useState<Historico>({
    cliente_id: clienteId,
    mes: '',
    ano: '',
    valor_pago: 0,
    bom_pagador: false,
  });

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await axios.get(`http://localhost:3001/clientes/${clienteId}/historico`);
        setHistorico(res.data);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      }
    }
    fetchHistorico();
  }, [clienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, bom_pagador: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/clientes/${clienteId}/historico`, form);
      toast.success('Histórico adicionado com sucesso');
      setForm({ cliente_id: clienteId, mes: '', ano: '', valor_pago: 0, bom_pagador: false });
      const res = await axios.get(`http://localhost:3001/clientes/${clienteId}/historico`);
      setHistorico(res.data);
    } catch {
      toast.error('Erro ao adicionar histórico');
    }
  };

  const excluir = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir este registro?')) return;
    try {
      await axios.delete(`http://localhost:3001/historico/${id}`);
      toast.success('Registro excluído');
      const res = await axios.get(`http://localhost:3001/clientes/${clienteId}/historico`);
      setHistorico(res.data);
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5 className="mb-4">Adicionar Histórico Financeiro</h5>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Row className="g-2">
            <Col md={3}><Form.Control name="mes" placeholder="Mês" value={form.mes} onChange={handleChange} required /></Col>
            <Col md={2}><Form.Control name="ano" placeholder="Ano" value={form.ano} onChange={handleChange} required /></Col>
            <Col md={3}><Form.Control name="valor_pago" type="number" placeholder="Valor Pago" value={form.valor_pago} onChange={handleChange} required /></Col>
            <Col md={2} className="d-flex align-items-center">
              <Form.Check label="Bom Pagador" checked={form.bom_pagador} onChange={handleCheckbox} />
            </Col>
            <Col md={2}><Button type="submit" variant="success">Adicionar</Button></Col>
          </Row>
        </Form>

        <h5>Registros</h5>
        <Table bordered hover responsive size="sm">
          <thead className="table-light">
            <tr>
              <th>Mês</th>
              <th>Ano</th>
              <th>Valor Pago</th>
              <th>Bom Pagador</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((h) => (
              <tr key={h.id}>
                <td>{h.mes}</td>
                <td>{h.ano}</td>
                <td>R$ {parseFloat(h.valor_pago.toString()).toFixed(2).replace('.', ',')}</td>
                <td>{h.bom_pagador ? 'Sim' : 'Não'}</td>
                <td>
                  <Button variant="outline-danger" size="sm" onClick={() => excluir(h.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
