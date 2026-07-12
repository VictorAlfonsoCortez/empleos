import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const JobCard = ({ job }) => {
  return (
    <Card className="job-card p-3 mb-4">
      <Row>
        <Col xs="auto">
          <img src={job.logoEmpresa} alt={job.empresa} className="job-card-logo" />
        </Col>
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Link to={`/empleos/${job.id}`} className="job-card-title d-block">
                {job.titulo}
              </Link>
              <p className="text-muted mb-2 small">{job.empresa}</p>
            </div>
            <Badge className="badge-custom">{job.categoria}</Badge>
          </div>
          
          <div className="d-flex flex-wrap gap-3 text-muted small mt-2">
            <span className="d-flex align-items-center gap-1">
              <FaMapMarkerAlt /> {job.ubicacion} ({job.modalidad})
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaClock /> {job.tipoContrato}
            </span>
            {job.salario.mostrar && (
              <span className="d-flex align-items-center gap-1">
                <FaMoneyBillWave /> {job.salario.min} - {job.salario.max} {job.salario.moneda}
              </span>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default JobCard;
