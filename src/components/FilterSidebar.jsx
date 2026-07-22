import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { jobService } from '../services/jobService';

const FilterSidebar = ({ activeFilters = {}, onFilterChange, onResetFilters }) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    jobService.getCategorias()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const selectedCategories = activeFilters.categoria || [];
  const selectedModalities = activeFilters.modalidad || [];
  const selectedTypes = activeFilters.tipoContrato || [];

  const handleCategoryToggle = (catName) => {
    const next = selectedCategories.includes(catName)
      ? selectedCategories.filter(c => c !== catName)
      : [...selectedCategories, catName];
    onFilterChange({ ...activeFilters, categoria: next });
  };

  const handleModalityToggle = (modName) => {
    const next = selectedModalities.includes(modName)
      ? selectedModalities.filter(m => m !== modName)
      : [...selectedModalities, modName];
    onFilterChange({ ...activeFilters, modalidad: next });
  };

  const handleTypeToggle = (typeName) => {
    const next = selectedTypes.includes(typeName)
      ? selectedTypes.filter(t => t !== typeName)
      : [...selectedTypes, typeName];
    onFilterChange({ ...activeFilters, tipoContrato: next });
  };

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedModalities.length > 0 || 
    selectedTypes.length > 0 || 
    Boolean(activeFilters.q) || 
    Boolean(activeFilters.ubicacion);

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold m-0">Filtros</h5>
        {hasActiveFilters && (
          <Button 
            variant="link" 
            className="p-0 text-decoration-none text-danger small"
            onClick={onResetFilters}
          >
            Limpiar todo
          </Button>
        )}
      </div>
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold d-flex justify-content-between">
          Categoría
          {selectedCategories.length > 0 && (
            <Badge bg="primary">{selectedCategories.length}</Badge>
          )}
        </Form.Label>
        {categories.map(cat => (
          <Form.Check 
            key={cat.id}
            type="checkbox"
            label={cat.nombre}
            id={`cat-${cat.id}`}
            checked={selectedCategories.includes(cat.nombre)}
            onChange={() => handleCategoryToggle(cat.nombre)}
            className="mb-2 text-muted"
          />
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold d-flex justify-content-between">
          Modalidad
          {selectedModalities.length > 0 && (
            <Badge bg="primary">{selectedModalities.length}</Badge>
          )}
        </Form.Label>
        {['Remoto', 'Presencial', 'Híbrido'].map(mod => (
          <Form.Check 
            key={mod}
            type="checkbox"
            label={mod}
            id={`mod-${mod}`}
            checked={selectedModalities.includes(mod)}
            onChange={() => handleModalityToggle(mod)}
            className="mb-2 text-muted"
          />
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold d-flex justify-content-between">
          Tipo de Contrato
          {selectedTypes.length > 0 && (
            <Badge bg="primary">{selectedTypes.length}</Badge>
          )}
        </Form.Label>
        {['Tiempo completo', 'Medio tiempo', 'Freelance'].map(tipo => (
          <Form.Check 
            key={tipo}
            type="checkbox"
            label={tipo}
            id={`tipo-${tipo}`}
            checked={selectedTypes.includes(tipo)}
            onChange={() => handleTypeToggle(tipo)}
            className="mb-2 text-muted"
          />
        ))}
      </Form.Group>
    </Card>
  );
};

export default FilterSidebar;
