import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { api } from '../services/mockApi';

const FilterSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    api.getCategorias()
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4">Filtros</h5>
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Categoría</Form.Label>
        {categories.map(cat => (
          <Form.Check 
            key={cat.id}
            type="checkbox"
            label={cat.nombre}
            id={`cat-${cat.id}`}
            className="mb-2 text-muted"
          />
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Modalidad</Form.Label>
        {['Remoto', 'Presencial', 'Híbrido'].map(mod => (
          <Form.Check 
            key={mod}
            type="checkbox"
            label={mod}
            id={`mod-${mod}`}
            className="mb-2 text-muted"
          />
        ))}
      </Form.Group>

      <Button variant="outline-primary" className="w-100 rounded-pill">
        Aplicar Filtros
      </Button>
    </Card>
  );
};

export default FilterSidebar;
