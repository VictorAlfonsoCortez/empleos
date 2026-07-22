import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Form, Button, Alert } from 'react-bootstrap';
import { FaDownload, FaSave, FaCheckCircle, FaBriefcase } from 'react-icons/fa';
import { useCandidateProfile } from '../hooks/useCandidateProfile';
import { useApplications } from '../hooks/useApplications';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile, loading: loadingProfile, updateProfile, updating } = useCandidateProfile();
  const { applications, loading: loadingApps } = useApplications();

  // Estados para datos de CV
  const [resumen, setResumen] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [educacion, setEducacion] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setResumen(profile.resumen || '');
      setHabilidades(profile.habilidades || '');
      setExperiencia(profile.experiencia || '');
      setEducacion(profile.educacion || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        resumen,
        habilidades,
        experiencia,
        educacion
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
    }
  };

  const handleDownloadCV = (e) => {
    e.preventDefault();
    const cvContent = `==================================================
              CURRICULUM VITAE
==================================================

DATOS PERSONALES
--------------------------------------------------
Nombre:   ${profile?.nombre || ''}
Correo:   ${profile?.correo || ''}
Teléfono: ${profile?.telefono || ''}

RESUMEN PROFESIONAL
--------------------------------------------------
${resumen || 'No especificado.'}

HABILIDADES
--------------------------------------------------
${habilidades || 'No especificadas.'}

EXPERIENCIA LABORAL
--------------------------------------------------
${experiencia || 'No especificada.'}

EDUCACIÓN
--------------------------------------------------
${educacion || 'No especificada.'}

==================================================
Generado automáticamente en EmpleosNow.
`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${(profile?.nombre || 'Candidato').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Enviada': return <Badge bg="secondary">Enviada</Badge>;
      case 'En revisión': return <Badge bg="warning" text="dark">En revisión</Badge>;
      case 'Entrevista': return <Badge bg="info">Entrevista</Badge>;
      case 'Rechazada': return <Badge bg="danger">Rechazada</Badge>;
      case 'Aceptada': return <Badge bg="success">Aceptada</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loadingProfile || loadingApps) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Mi Perfil</h2>
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 text-center p-4 mb-4">
            <Card.Body>
              <img 
                src={profile?.fotoPerfil} 
                alt="Perfil" 
                className="rounded-circle mb-3" 
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
              <h4 className="fw-bold">{profile?.nombre}</h4>
              <p className="text-muted mb-1">{profile?.correo}</p>
              <p className="text-muted mb-4">{profile?.telefono}</p>
              
              <div className="text-start">
                <h6 className="fw-bold">CV Actual</h6>
                <div className="p-3 bg-light rounded text-break">
                  <a href={profile?.cvActual?.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                    {profile?.cvActual?.nombreArchivo}
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Generador y Guardado de CV */}
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Editar Perfil & Generador de CV</h5>
            {saveSuccess && (
              <Alert variant="success" className="d-flex align-items-center gap-2 py-2">
                <FaCheckCircle /> Cambios guardados con éxito
              </Alert>
            )}
            <Form onSubmit={handleSaveProfile}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Resumen Profesional</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Describe brevemente tu perfil..." 
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Habilidades</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ej: React, Node.js, Inglés avanzado..." 
                  value={habilidades}
                  onChange={(e) => setHabilidades(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Experiencia Laboral</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Ej: Desarrollador en TechNova (2024-Presente)..." 
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Educación</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2} 
                  placeholder="Ej: Lic. en Ciencias de la Computación (UNAM)" 
                  value={educacion}
                  onChange={(e) => setEducacion(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button 
                  type="submit"
                  variant="outline-primary" 
                  className="w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  disabled={updating}
                >
                  <FaSave /> {updating ? 'Guardando...' : 'Guardar'}
                </Button>

                <Button 
                  type="button" 
                  onClick={handleDownloadCV}
                  variant="primary" 
                  className="w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 btn-primary-custom"
                >
                  <FaDownload /> Descargar CV
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0">Mis Postulaciones</h4>
              <Badge bg="primary" className="rounded-pill fs-6 px-3">
                {applications.length} Postulaciones
              </Badge>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-5">
                <FaBriefcase className="fs-1 text-muted mb-3" />
                <h5>Aún no te has postulado a ninguna vacante</h5>
                <p className="text-muted">Explora las vacantes disponibles y postulate con un clic.</p>
                <Button as={Link} to="/empleos" variant="primary" className="rounded-pill mt-2">
                  Explorar Empleos
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Puesto / Vacante</th>
                      <th>Empresa</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Carta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>
                          <Link to={`/empleos/${app.vacanteId}`} className="fw-semibold text-decoration-none">
                            {app.vacanteTitulo}
                          </Link>
                        </td>
                        <td className="text-muted">{app.empresa}</td>
                        <td className="small">{new Date(app.fechaPostulacion).toLocaleDateString()}</td>
                        <td>{getStatusBadge(app.estatus)}</td>
                        <td>
                          {app.cartaPresentacion ? (
                            <span className="text-success small fw-semibold">Adjunta</span>
                          ) : (
                            <span className="text-muted small fst-italic">Sin carta</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
