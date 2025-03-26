// src/components/DashboardResumo.tsx
import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardResumo() {
  const [resumo, setResumo] = useState({ totalClientes: 0, ativos: 0, inativos: 0, orcamentos: 0 });

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const [clientesRes, orcamentosRes] = await Promise.all([
          axios.get('http://localhost:3001/clientes'),
          axios.get('http://localhost:3001/orcamentos'),
        ]);

        const clientes = clientesRes.data;
        const ativos = clientes.filter((c: any) => c.situacao === 'Ativo').length;
        const inativos = clientes.filter((c: any) => c.situacao === 'Inativo').length;

        setResumo({
          totalClientes: clientes.length,
          ativos,
          inativos,
          orcamentos: orcamentosRes.data.length,
        });
      } catch {
        toast.error('Erro ao carregar o resumo');
      }
    };

    fetchResumo();
  }, []);

  const chartData = {
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        data: [resumo.ativos, resumo.inativos],
        backgroundColor: ['#198754', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Row className="mb-4 text-center">
        <Col md={3}><Card><Card.Body><h5>Total Clientes</h5><h3>{resumo.totalClientes}</h3></Card.Body></Card></Col>
        <Col md={3}><Card><Card.Body><h5>Clientes Ativos</h5><h3>{resumo.ativos}</h3></Card.Body></Card></Col>
        <Col md={3}><Card><Card.Body><h5>Clientes Inativos</h5><h3>{resumo.inativos}</h3></Card.Body></Card></Col>
        <Col md={3}><Card><Card.Body><h5>Orçamentos Emitidos</h5><h3>{resumo.orcamentos}</h3></Card.Body></Card></Col>
      </Row>

      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="text-center">Distribuição de Clientes</h5>
              <Pie data={chartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
