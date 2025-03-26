import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Navbar, Container, Nav, Card, Row, Col } from 'react-bootstrap';
import { People, FileEarmarkArrowDown, PersonPlus, FileText } from 'react-bootstrap-icons';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import ClienteForm from './components/ClienteForm';
import ClienteList from './components/ClienteList';
import OrcamentoForm from './components/OrcamentoForm';
import OrcamentoList from './components/OrcamentoList';
import OrcamentoPrint from './components/OrcamentoPrint';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Cliente {
  id: number;
  nome: string;
  situacao: 'Ativo' | 'Inativo';
}

function Home() {
  const [resumo, setResumo] = useState({
    totalClientes: 0,
    ativos: 0,
    inativos: 0,
    orcamentos: 0,
  });

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const [clientesRes, orcamentosRes] = await Promise.all([
          axios.get<Cliente[]>('http://localhost:3001/clientes'),
          axios.get('http://localhost:3001/orcamentos'),
        ]);

        const clientes = clientesRes.data;
        const orcamentos = orcamentosRes.data;

        const ativos = clientes.filter(c => c.situacao === 'Ativo').length;
        const inativos = clientes.filter(c => c.situacao === 'Inativo').length;

        setResumo({
          totalClientes: clientes.length,
          ativos,
          inativos,
          orcamentos: orcamentos.length,
        });
      } catch {
        toast.error('Erro ao carregar o resumo');
      }
    };

    fetchResumo();
  }, []);

  const chartData = {
    labels: ['Clientes Ativos', 'Clientes Inativos'],
    datasets: [
      {
        label: 'Clientes',
        data: [resumo.ativos, resumo.inativos],
        backgroundColor: ['#198754', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="home-bg">
      <Container className="mt-4">
       
<Row className="g-4 justify-content-center mb-5">
          <Col xs={12} sm={6} md={3}>
            <Card as={Link} to="/clientes" className="text-center h-100 text-decoration-none card-hover">
              <Card.Body>
                <People size={48} className="mb-2" />
                <Card.Title>Lista de Clientes</Card.Title>
                <Card.Text>Visualizar e exportar clientes.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card as={Link} to="/cadastro" className="text-center h-100 text-decoration-none card-hover">
              <Card.Body>
                <PersonPlus size={48} className="mb-2" />
                <Card.Title>Cadastro</Card.Title>
                <Card.Text>Adicionar novo cliente.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card as={Link} to="/exportar" className="text-center h-100 text-decoration-none card-hover">
              <Card.Body>
                <FileEarmarkArrowDown size={48} className="mb-2" />
                <Card.Title>Exportar</Card.Title>
                <Card.Text>Exportar dados do sistema.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card as={Link} to="/orcamentos" className="text-center h-100 text-decoration-none card-hover">
              <Card.Body>
                <FileText size={48} className="mb-2" />
                <Card.Title>Orçamentos</Card.Title>
                <Card.Text>Gerenciar orçamentos.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4 text-center mb-5">
          <Col md={3}>
            <Card bg="primary" text="white" className="shadow">
              <Card.Body>
                <Card.Title>Total de Clientes</Card.Title>
                <Card.Text className="fs-3">{resumo.totalClientes}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="shadow">
              <Card.Body>
                <Card.Title>Clientes Ativos</Card.Title>
                <Card.Text className="fs-3">{resumo.ativos}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="danger" text="white" className="shadow">
              <Card.Body>
                <Card.Title>Clientes Inativos</Card.Title>
                <Card.Text className="fs-3">{resumo.inativos}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="shadow">
              <Card.Body>
                <Card.Title>Orçamentos Emitidos</Card.Title>
                <Card.Text className="fs-3">{resumo.orcamentos}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        

        <Row className="justify-content-center">
          <Col md={3}>
            <Card className="p-3 shadow">
              <Card.Title className="text-center mb-3">Distribuição de Clientes</Card.Title>
              <Pie data={chartData} />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/image.png"
              alt="Logo"
              width="30"
              height="30"
              
              className="d-inline-block align-top me-2"
            />
            ClientesApp
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/clientes">Lista de Clientes</Nav.Link>
            <Nav.Link as={Link} to="/cadastro">Cadastro</Nav.Link>
            
            <Nav.Link as={Link} to="/orcamentos">Orçamentos</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/cadastro" element={<ClienteForm onSuccess={() => {}} />} />
          <Route path="/exportar" element={<ClienteList />} />
          <Route path="/orcamentos" element={<OrcamentoList />} />
          <Route path="/orcamentos/:id" element={<OrcamentoForm />} />
          <Route path="/imprimir-orcamento/:id" element={<OrcamentoPrint />} />
        </Routes>
      </Container>

      <footer className="text-center text-muted py-4">
        <small>&copy; {new Date().getFullYear()} SPEED+ Informática | Desenvolvido por FoioMikael</small>
      </footer>

      <ToastContainer />
    </Router>
  );
}

export default App;
