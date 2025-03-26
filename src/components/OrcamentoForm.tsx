import { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Table, Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrcamentoForm.css';

interface Props {
  orcamentoEdit?: any;
}

export default function OrcamentoForm({ orcamentoEdit }: Props) {
  const [orcamentoId] = useState(uuidv4().slice(0, 5).toUpperCase());
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [validade, setValidade] = useState('');
  const [tecnico, setTecnico] = useState('JOÃO FERNANDO CARVALHO SILVA');
  const [cliente, setCliente] = useState({ nome: '', endereco: '', cpf_cnpj: '', email: '' });
  const [produtos, setProdutos] = useState([{ qtde: '', descricao: '', valor: '' }]);
  const [servicos, setServicos] = useState([{ qtde: '', descricao: '', valor: '' }]);

  useEffect(() => {
    if (orcamentoEdit) {
      setDataEmissao(orcamentoEdit.data_emissao);
      setValidade(orcamentoEdit.validade);
      setTecnico(orcamentoEdit.tecnico);
      setCliente({
        nome: orcamentoEdit.cliente_nome,
        endereco: orcamentoEdit.cliente_endereco,
        cpf_cnpj: orcamentoEdit.cliente_documento,
        email: orcamentoEdit.cliente_email,
      });
      setProdutos(orcamentoEdit.produtos);
      setServicos(orcamentoEdit.servicos);
    }
  }, [orcamentoEdit]);

  const handleAddLinha = (tipo: 'produto' | 'servico') => {
    const novaLinha = { qtde: '', descricao: '', valor: '' };
    tipo === 'produto' ? setProdutos([...produtos, novaLinha]) : setServicos([...servicos, novaLinha]);
  };

  const handleChange = (tipo: 'produto' | 'servico', index: number, field: string, value: string) => {
    const atual = tipo === 'produto' ? [...produtos] : [...servicos];
    atual[index][field as keyof typeof atual[0]] = value;
    tipo === 'produto' ? setProdutos(atual) : setServicos(atual);
  };

  const calcularTotal = () => {
    const soma = (arr: typeof produtos) =>
      arr.reduce((total, item) => total + (parseFloat(item.valor.replace(',', '.')) || 0), 0);
    return (soma(produtos) + soma(servicos)).toFixed(2).replace('.', ',');
  };

  const handleSalvar = async () => {
    try {
      if (!validade || isNaN(Date.parse(validade))) {
        toast.error('Data de validade inválida!');
        return;
      }

      const produtosValidos = produtos.filter(p => p.qtde && p.descricao && p.valor);
      const servicosValidos = servicos.filter(s => s.qtde && s.descricao && s.valor);

      const total = (
        produtosValidos.reduce((acc, p) => acc + parseFloat(p.valor.replace(',', '.')), 0) +
        servicosValidos.reduce((acc, s) => acc + parseFloat(s.valor.replace(',', '.')), 0)
      ).toFixed(2);

      const payload = {
        empresa_nome: '59.020.579 JOAO FERNANDO CARVALHO SILVA',
        empresa_cnpj: '59.020.579/0001-05',
        empresa_endereco: 'R DOMINGOS GERMANO DE SOUZA, 1313-W, PARQUE TANGARÁ, TANGARÁ DA SERRA/MT',
        empresa_telefone: '(65) 98411-3135',
        cliente_nome: cliente.nome,
        cliente_endereco: cliente.endereco,
        cliente_documento: cliente.cpf_cnpj,
        cliente_email: cliente.email,
        tecnico,
        data_emissao: dataEmissao,
        validade,
        total,
        produtos: produtosValidos,
        servicos: servicosValidos,
      };

      if (orcamentoEdit) {
        await axios.put(`http://localhost:3001/orcamentos/${orcamentoEdit.id}`, payload);
        toast.success('Orçamento atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:3001/orcamentos', payload);
        toast.success('Orçamento salvo com sucesso!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar orçamento.');
    }
  };

  return (
    <Container className="orcamento-form">
      <h3 className="titulo-formulario">{orcamentoEdit ? 'Editar Orçamento' : 'Cadastro de Orçamento'}</h3>
      <div className="bloco">
        <h5 className="info" >Informações da Empresa</h5>
        <Row>
          <Col md={6}><Form.Group><Form.Label>Nome Empresarial</Form.Label><Form.Control value="59.020.579 JOAO FERNANDO CARVALHO SILVA" disabled /></Form.Group></Col>
          <Col md={3}><Form.Group><Form.Label>CNPJ</Form.Label><Form.Control value="59.020.579/0001-05" disabled /></Form.Group></Col>
          <Col md={3}><Form.Group><Form.Label>Telefone</Form.Label><Form.Control value="(65) 98411-3135" disabled /></Form.Group></Col>
          <Col md={12}><Form.Group><Form.Label>Endereço</Form.Label><Form.Control value="R DOMINGOS GERMANO DE SOUZA, 1313-W, PARQUE TANGARÁ, TANGARÁ DA SERRA/MT" disabled /></Form.Group></Col>
        </Row>
      </div>

      <div className="bloco">
        <h5>Dados do Cliente</h5>
        <Row>
          <Col md={6}><Form.Group><Form.Label>Nome</Form.Label><Form.Control value={cliente.nome} onChange={e => setCliente({ ...cliente, nome: e.target.value })} /></Form.Group></Col>
          <Col md={6}><Form.Group><Form.Label>Endereço</Form.Label><Form.Control value={cliente.endereco} onChange={e => setCliente({ ...cliente, endereco: e.target.value })} /></Form.Group></Col>
          <Col md={6}><Form.Group><Form.Label>CPF/CNPJ</Form.Label><Form.Control value={cliente.cpf_cnpj} onChange={e => setCliente({ ...cliente, cpf_cnpj: e.target.value })} /></Form.Group></Col>
          <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={cliente.email} onChange={e => setCliente({ ...cliente, email: e.target.value })} /></Form.Group></Col>
        </Row>
      </div>

      <div className="bloco">
        <h5>Informações do Orçamento</h5>
        <Row>
          <Col md={4}><Form.Group><Form.Label>ID</Form.Label><Form.Control value={orcamentoEdit ? orcamentoEdit.id : orcamentoId} disabled /></Form.Group></Col>
          <Col md={4}><Form.Group><Form.Label>Emissão</Form.Label><Form.Control type="date" value={dataEmissao} disabled /></Form.Group></Col>
          <Col md={4}><Form.Group><Form.Label>Validade</Form.Label><Form.Control type="date" value={validade} onChange={e => setValidade(e.target.value)} /></Form.Group></Col>
        </Row>
        <Form.Group className="mt-2"><Form.Label>Técnico</Form.Label><Form.Control value={tecnico} onChange={e => setTecnico(e.target.value)} /></Form.Group>
      </div>

      <div className="bloco">
        <h5>Produtos</h5>
        <Table bordered size="sm">
          <thead><tr><th>Qtde</th><th>Produto</th><th>Valor (R$)</th></tr></thead>
          <tbody>
            {produtos.map((p, i) => (
              <tr key={i}>
                <td><Form.Control value={p.qtde} onChange={e => handleChange('produto', i, 'qtde', e.target.value)} /></td>
                <td><Form.Control value={p.descricao} onChange={e => handleChange('produto', i, 'descricao', e.target.value)} /></td>
                <td><Form.Control value={p.valor} onChange={e => handleChange('produto', i, 'valor', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button size="sm" variant="outline-light" onClick={() => handleAddLinha('produto')}>+ Adicionar Produto</Button>
      </div>

      <div className="bloco">
        <h5>Serviços</h5>
        <Table bordered size="sm">
          <thead><tr><th>Qtde</th><th>Serviço</th><th>Valor (R$)</th></tr></thead>
          <tbody>
            {servicos.map((s, i) => (
              <tr key={i}>
                <td><Form.Control value={s.qtde} onChange={e => handleChange('servico', i, 'qtde', e.target.value)} /></td>
                <td><Form.Control value={s.descricao} onChange={e => handleChange('servico', i, 'descricao', e.target.value)} /></td>
                <td><Form.Control value={s.valor} onChange={e => handleChange('servico', i, 'valor', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button size="sm" variant="outline-light" onClick={() => handleAddLinha('servico')}>+ Adicionar Serviço</Button>
      </div>

      <h4 className="text-end mt-4 ">TOTAL: R$ {calcularTotal()}</h4>
      <div className="text-end mt-3">
        <Button variant="success" onClick={handleSalvar}>{orcamentoEdit ? 'Salvar Alterações' : 'Salvar Orçamento'}</Button>
      </div>

      <div className="text-center mt-5 text-muted">
        <p>SPEED+ INFORMÁTICA | A opção de quem escolhe com confiança!</p>
      </div>
    </Container>
  );
}
