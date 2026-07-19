import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Form, Button } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { api } from '../services/mockApi';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for CV Data
  const [resumen, setResumen] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [educacion, setEducacion] = useState('');

  useEffect(() => {
    Promise.all([
      api.getCandidato(),
      api.getPostulaciones()
    ]).then(([candRes, postRes]) => {
      setProfile(candRes.data);
      setApplications(postRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

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
Generado automáticamente en EmpleosTest.
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

  if (loading) {
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
                  <a href={profile?.cvActual?.url} className="text-decoration-none">
                    {profile?.cvActual?.nombreArchivo}
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Section to add CV Data and download */}
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Generador de CV</h5>
            <Form onSubmit={handleDownloadCV}>
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

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
              >
                <FaDownload /> Descargar CV (.txt)
              </Button>
            </Form>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-4">Mis Postulaciones</h4>
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>ID Vacante</th>
                    <th>Estado</th>
                    <th>Carta de Presentación</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td>{new Date(app.fechaPostulacion).toLocaleDateString()}</td>
                      <td>
                        <a href={`/empleos/${app.vacanteId}`} className="text-decoration-none">
                          {app.vacanteId}
                        </a>
                      </td>
                      <td>{getStatusBadge(app.estatus)}</td>
                      <td>
                        {app.cartaPresentacion ? (
                          <span className="text-muted small">Adjunta</span>
                        ) : (
                          <span className="text-muted small fst-italic">Sin carta</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
