// ClienteForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function ClienteForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    cliente_desde: '',
    situacao: 'Ativo',
    bom_pagador: true,
    cpf: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, bom_pagador: e.target.checked });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/clientes', form);
      toast.success("Cliente cadastrado com sucesso!");
      setForm({
        nome: '',
        telefone: '',
        endereco: '',
        cliente_desde: '',
        situacao: 'Ativo',
        bom_pagador: true,
        cpf: '',
        email: ''
      });
      onSuccess();
    } catch (error) {
      toast.error("Erro ao cadastrar cliente.");
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="mb-3">Cadastrar Cliente</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome completo" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control name="telefone" value={form.telefone} onChange={handleChange} placeholder="(65) 99999-9999" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, bairro" />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente Desde</Form.Label>
                <Form.Control name="cliente_desde" value={form.cliente_desde} onChange={handleChange} placeholder="Ano" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>CPF</Form.Label>
                <Form.Control name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@email.com" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Bom pagador" checked={form.bom_pagador} onChange={handleCheckbox} />
          </Form.Group>

          <Button variant="primary" type="submit">Cadastrar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
