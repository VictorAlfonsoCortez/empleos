import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { useJobs } from '../hooks/useJobs';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const { jobs, loading } = useJobs();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (locationTerm) params.append('ubicacion', locationTerm);
    navigate(`/empleos?${params.toString()}`);
  };

  const featuredJobs = jobs.slice(0, 3);

  return (
    <>
      <div className="hero-section">
        <Container>
          <h1 className="hero-title">Encuentra el trabajo de tus sueños</h1>
          <p className="hero-subtitle">Miles de vacantes en las mejores empresas de tecnología y más.</p>

          <Form onSubmit={handleSearchSubmit} className="search-bar d-flex align-items-center">
            <FaSearch className="text-muted ms-3" />
            <Form.Control 
              type="text" 
              placeholder="Cargo, palabras clave o empresa" 
              className="border-0 shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="border-start mx-3" style={{ height: '24px' }}></div>
            <FaMapMarkerAlt className="text-muted" />
            <Form.Control 
              type="text" 
              placeholder="Ciudad o país" 
              className="border-0 shadow-none" 
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
            <Button type="submit" variant="primary" className="btn-primary-custom ms-2 rounded-pill px-4 py-2">
              Buscar
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Vacantes Destacadas</h2>
          <Button as={Link} to="/empleos" variant="outline-primary" className="rounded-pill">
            Ver todas
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            {featuredJobs.map(job => (
              <Col md={4} key={job.id} className="mb-4 d-flex">
                <JobCard job={job} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;
