import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { api } from '../services/mockApi';
import { Link } from 'react-router-dom';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.getVacantes()
      .then(res => setJobs(res.data.slice(0, 3))) // Show only 3 latest
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div className="hero-section">
        <Container>
          <h1 className="hero-title">Encuentra el trabajo de tus sueños</h1>
          <p className="hero-subtitle">Miles de vacantes en las mejores empresas de tecnología y más.</p>

          <div className="search-bar d-flex align-items-center">
            <FaSearch className="text-muted ms-3" />
            <Form.Control type="text" placeholder="Cargo, palabras clave o empresa" className="border-0 shadow-none" />
            <div className="border-start mx-3" style={{ height: '24px' }}></div>
            <FaMapMarkerAlt className="text-muted" />
            <Form.Control type="text" placeholder="Ciudad o país" className="border-0 shadow-none" />
            <Button variant="primary" className="btn-primary-custom ms-2 rounded-pill px-4 py-2">
              Buscar
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Vacantes Destacadas</h2>
          <Button as={Link} to="/empleos" variant="outline-primary" className="rounded-pill">
            Ver todas
          </Button>
        </div>

        <Row>
          {jobs.map(job => (
            <Col md={4} key={job.id} className="mb-4 d-flex">
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
