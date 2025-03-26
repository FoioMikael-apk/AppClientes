// ClienteEditModal.tsx atualizado com fix do TypeScript para handleChange
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

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

type Props = {
  show: boolean;
  onHide: () => void;
  cliente: Cliente | null;
  onUpdated: () => void;
};

export default function ClienteEditModal({ show, onHide, cliente, onUpdated }: Props) {
  const [form, setForm] = useState<Cliente | null>(null);

  useEffect(() => {
    if (cliente) setForm(cliente);
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (form) setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (form) setForm({ ...form, bom_pagador: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      await axios.put(`http://localhost:3001/clientes/${form.id}`, form);
      toast.success('Cliente atualizado com sucesso!');
      onUpdated();
      onHide();
    } catch {
      toast.error('Erro ao atualizar cliente.');
    }
  };

  if (!form) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}><Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="nome" value={form.nome} onChange={handleChange} required />
            </Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control name="telefone" value={form.telefone} onChange={handleChange} />
            </Form.Group></Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control name="endereco" value={form.endereco} onChange={handleChange} />
          </Form.Group>

          <Row>
            <Col md={4}><Form.Group className="mb-3">
              <Form.Label>Cliente Desde</Form.Label>
              <Form.Control name="cliente_desde" value={form.cliente_desde} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control name="cpf" value={form.cpf} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={form.email} onChange={handleChange} type="email" /></Form.Group></Col>
          </Row>

          <Row>
            <Col md={4}><Form.Group className="mb-3">
              <Form.Label>Situação</Form.Label>
              <Form.Select name="situacao" value={form.situacao} onChange={handleChange}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </Form.Select>
            </Form.Group></Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check label="Bom Pagador" checked={form.bom_pagador} onChange={handleCheckbox} />
          </Form.Group>

          <Button variant="primary" type="submit">Salvar Alterações</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}