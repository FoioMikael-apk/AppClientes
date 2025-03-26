// OrcamentoEdit.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrcamentoForm from './OrcamentoForm';
import { Spinner, Container } from 'react-bootstrap';

export default function OrcamentoEdit() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/orcamentos/${id}`)
      .then(res => setOrcamento(res.data))
      .catch(() => navigate('/orcamentos'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  if (!orcamento) return null;

  return <OrcamentoForm orcamentoEdit={orcamento} />;
}
