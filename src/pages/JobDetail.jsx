import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { api } from '../services/mockApi';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVacanteById(id)
      .then(res => {
        setJob(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!job) {
    return <Container className="py-5 text-center"><h5>Vacante no encontrada</h5></Container>;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 mb-4">
                <img src={job.logoEmpresa} alt={job.empresa} style={{ width: 80, height: 80, borderRadius: 12, border: '1px solid #eee' }} />
                <div>
                  <h2 className="fw-bold mb-1">{job.titulo}</h2>
                  <h5 className="text-muted mb-2">{job.empresa}</h5>
                  <Badge bg="primary">{job.categoria}</Badge>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 text-muted mb-5 pb-4 border-bottom">
                <span className="d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" /> {job.ubicacion} ({job.modalidad})
                </span>
                <span className="d-flex align-items-center gap-2">
                  <FaClock className="text-primary" /> {job.tipoContrato}
                </span>
                {job.salario.mostrar && (
                  <span className="d-flex align-items-center gap-2">
                    <FaMoneyBillWave className="text-primary" /> {job.salario.min} - {job.salario.max} {job.salario.moneda}
                  </span>
                )}
                <span className="d-flex align-items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> Publicado: {new Date(job.fechaPublicacion).toLocaleDateString()}
                </span>
              </div>

              <h4 className="fw-bold mb-3">Descripción del Puesto</h4>
              <p className="mb-4" style={{ lineHeight: 1.8 }}>{job.descripcion}</p>

              <h4 className="fw-bold mb-3 mt-5">Requisitos</h4>
              <ul className="mb-4" style={{ lineHeight: 1.8 }}>
                {job.requisitos.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>

              <h4 className="fw-bold mb-3 mt-5">Responsabilidades</h4>
              <ul style={{ lineHeight: 1.8 }}>
                {job.responsabilidades.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Resumen de la empresa</h5>
              <p className="text-muted small mb-4">{job.empresa} es una de las empresas líderes en el sector de {job.categoria}.</p>

              <Button variant="primary" size="lg" className="btn-primary-custom w-100 rounded-pill mb-3">
                Postularme Ahora
              </Button>
              <Button variant="outline-secondary" size="lg" className="w-100 rounded-pill">
                Guardar Vacante
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JobDetail;
