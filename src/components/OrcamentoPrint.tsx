// src/OrcamentoPrint.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrcamentoPrint.css';

export default function OrcamentoPrint() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/orcamentos/${id}`)
      .then(res => setOrcamento(res.data))
      .catch(err => console.error('Erro ao buscar orçamento:', err));
  }, [id]);

  if (!orcamento) return <div>Carregando orçamento...</div>;

  return (
    <div className="orcamento-print">
      <div className="orcamento-container">
        <div className="orcamento-header">
          <img src="/image.png" alt="Logo" />
          <table>
            <tbody>
              <tr><td>NOME EMPRESARIAL:</td><td>{orcamento.empresa_nome}</td></tr>
              <tr><td>CNPJ:</td><td>{orcamento.empresa_cnpj}</td></tr>
              <tr><td>ENDEREÇO:</td><td>{orcamento.empresa_endereco}</td><td>TELEFONE:</td><td>{orcamento.empresa_telefone}</td></tr>
            </tbody>
          </table>
        </div>

        <table className="orcamento-cliente">
          <tbody>
            <tr><td>CLIENTE:</td><td>{orcamento.cliente_nome}</td></tr>
            <tr><td>ENDEREÇO:</td><td>{orcamento.cliente_endereco}</td></tr>
            <tr><td>CNPJ/CPF:</td><td>{orcamento.cliente_documento}</td></tr>
            <tr><td>E-MAIL:</td><td>{orcamento.cliente_email}</td></tr>
          </tbody>
        </table>

        <table className="orcamento-info">
          <tbody>
            <tr><td>TÉCNICO:</td><td>{orcamento.tecnico}</td></tr>
            <tr>
              <td>ORÇAMENTO ID:</td><td><strong>{String(orcamento.id).padStart(5, '0')}</strong></td>
              <td>EMISSÃO:</td><td>{orcamento.data_emissao}</td>
              <td>VÁLIDO ATÉ:</td><td>{orcamento.validade}</td>
              <td>TOTAL:</td><td><strong>R$ {orcamento.total}</strong></td>
            </tr>
          </tbody>
        </table>

        <h5>DESCRIÇÃO DOS COMPONENTES DE HARDWARE E PERIFÉRICOS</h5>
        <table className="orcamento-tabela">
          <thead><tr><th>QTDE</th><th>PRODUTO</th><th>VALOR (R$)</th></tr></thead>
          <tbody>
            {orcamento.produtos.map((p: any, i: number) => (
              <tr key={i}><td>{p.qtde}</td><td>{p.descricao}</td><td>{p.valor}</td></tr>
            ))}
          </tbody>
        </table>

        <h5>DESCRIÇÃO DOS SERVIÇOS</h5>
        <table className="orcamento-tabela">
          <thead><tr><th>QTDE</th><th>SERVIÇO</th><th>VALOR (R$)</th></tr></thead>
          <tbody>
            {orcamento.servicos.map((s: any, i: number) => (
              <tr key={i}><td>{s.qtde}</td><td>{s.descricao}</td><td>{s.valor}</td></tr>
            ))}
          </tbody>
        </table>

        <p className="rodape">SPEED+ INFORMÁTICA | A opção de quem escolhe com confiança!</p>
        <p className="data-direita">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="nao-imprimir">
        <button onClick={() => window.print()}>Imprimir</button>
      </div>
    </div>
  );
}
