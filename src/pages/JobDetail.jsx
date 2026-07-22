import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useJobDetail } from '../hooks/useJobDetail';

const JobDetail = () => {
  const { id } = useParams();
  const { job, loading, error, hasApplied, apply } = useJobDetail(id);

  const [showModal, setShowModal] = useState(false);
  const [cartaPresentacion, setCartaPresentacion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSubmitError(null);
  };

  const handlePostular = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apply({ cartaPresentacion });
      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Error al procesar la postulación.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container className="py-5 text-center">
        <h5>{error || 'Vacante no encontrada'}</h5>
        <Button as={Link} to="/empleos" variant="primary" className="rounded-pill mt-3">
          Regresar a empleos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/empleos" className="text-decoration-none text-muted d-inline-flex align-items-center mb-4">
        <FaArrowLeft className="me-2" /> Volver al listado de vacantes
      </Link>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 mb-4">
                <img src={job.logoEmpresa} alt={job.empresa} style={{ width: 80, height: 80, borderRadius: 12, border: '1px solid #eee', objectFit: 'cover' }} />
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
                {job.salario?.mostrar && (
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

              {job.requisitos && job.requisitos.length > 0 && (
                <>
                  <h4 className="fw-bold mb-3 mt-5">Requisitos</h4>
                  <ul className="mb-4" style={{ lineHeight: 1.8 }}>
                    {job.requisitos.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </>
              )}

              {job.responsabilidades && job.responsabilidades.length > 0 && (
                <>
                  <h4 className="fw-bold mb-3 mt-5">Responsabilidades</h4>
                  <ul style={{ lineHeight: 1.8 }}>
                    {job.responsabilidades.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Resumen de la empresa</h5>
              <p className="text-muted small mb-4">{job.empresa} es una de las empresas líderes en el sector de {job.categoria}.</p>

              {hasApplied ? (
                <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-3">
                  <FaCheckCircle className="fs-5" /> Ya te has postulado a esta vacante
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="btn-primary-custom w-100 rounded-pill mb-3"
                  onClick={handleOpenModal}
                >
                  Postularme Ahora
                </Button>
              )}

              <Button variant="outline-secondary" size="lg" className="w-100 rounded-pill">
                Guardar Vacante
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Postulación */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="rounded-4">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Postularme a {job.titulo}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePostular}>
          <Modal.Body className="py-0">
            {submitSuccess ? (
              <Alert variant="success" className="d-flex align-items-center gap-2">
                <FaCheckCircle className="fs-4" /> ¡Tu postulación ha sido enviada con éxito!
              </Alert>
            ) : (
              <>
                {submitError && <Alert variant="danger">{submitError}</Alert>}
                <p className="text-muted small">
                  Empresa: <strong>{job.empresa}</strong> | Ubicación: <strong>{job.ubicacion}</strong>
                </p>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Carta de Presentación (Opcional)</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4}
                    placeholder="Escribe un mensaje para el reclutador destacando tu experiencia..."
                    value={cartaPresentacion}
                    onChange={(e) => setCartaPresentacion(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          {!submitSuccess && (
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleCloseModal} className="rounded-pill">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="btn-primary-custom rounded-pill"
                disabled={submitting}
              >
                {submitting ? <Spinner animation="border" size="sm" /> : 'Confirmar y Enviar'}
              </Button>
            </Modal.Footer>
          )}
        </Form>
      </Modal>
    </Container>
  );
};

export default JobDetail;
