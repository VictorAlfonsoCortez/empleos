import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { api } from '../services/mockApi';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVacantes()
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="py-5">
      <Row>
        <Col lg={3} className="mb-4">
          <FilterSidebar />
        </Col>
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold m-0">Resultados de búsqueda</h3>
            <span className="text-muted">{jobs.length} vacantes encontradas</span>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
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
