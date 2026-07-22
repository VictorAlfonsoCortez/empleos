import React, { useMemo } from 'react';
import { Container, Row, Col, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { useJobs } from '../hooks/useJobs';

const JobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extraer filtros desde los parámetros de la URL
  const filters = useMemo(() => {
    const q = searchParams.get('q') || '';
    const ubicacion = searchParams.get('ubicacion') || '';
    const categoria = searchParams.getAll('categoria');
    const modalidad = searchParams.getAll('modalidad');
    const tipoContrato = searchParams.getAll('tipoContrato');

    return { q, ubicacion, categoria, modalidad, tipoContrato };
  }, [searchParams]);

  const { jobs, total, loading } = useJobs(filters);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.ubicacion) params.set('ubicacion', newFilters.ubicacion);

    if (Array.isArray(newFilters.categoria)) {
      newFilters.categoria.forEach(cat => params.append('categoria', cat));
    }
    if (Array.isArray(newFilters.modalidad)) {
      newFilters.modalidad.forEach(mod => params.append('modalidad', mod));
    }
    if (Array.isArray(newFilters.tipoContrato)) {
      newFilters.tipoContrato.forEach(tipo => params.append('tipoContrato', tipo));
    }

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <Container className="py-5">
      {/* Barra de Búsqueda Integrada en JobList */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="bg-white p-3 rounded-4 shadow-sm border">
            <Row className="g-2">
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Cargo, palabra clave o empresa..."
                    className="border-0 shadow-none"
                    value={filters.q}
                    onChange={(e) => handleFilterChange({ ...filters, q: e.target.value })}
                  />
                </InputGroup>
              </Col>
              <Col md={5} className="border-start-md">
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    <FaMapMarkerAlt />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Ubicación o ciudad..."
                    className="border-0 shadow-none"
                    value={filters.ubicacion}
                    onChange={(e) => handleFilterChange({ ...filters, ubicacion: e.target.value })}
                  />
                </InputGroup>
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary" 
                  className="w-100 rounded-pill"
                  onClick={handleResetFilters}
                >
                  Limpiar
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3} className="mb-4">
          <FilterSidebar 
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </Col>
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold m-0">Resultados de búsqueda</h3>
            <span className="text-muted">{total} vacantes encontradas</span>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
              <h5>No se encontraron vacantes con los filtros seleccionados</h5>
              <p className="text-muted">Intenta ajustando tus términos de búsqueda o limpiando los filtros.</p>
              <Button variant="primary" onClick={handleResetFilters} className="rounded-pill">
                Ver todas las vacantes
              </Button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default JobList;
