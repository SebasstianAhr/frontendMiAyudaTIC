import React, { useState, useEffect } from 'react';
import axiosConfig from '../../services/axios';
import DataTable from 'react-data-table-component';
import AppLayout from "../../layouts/appLayout/AppLayout";
import TecnicoLayout from '../../layouts/tecnicoLayout/TecnicoLayout';
import SolutionModal from './modal';

const CasosPorResolverTabla = () => {
  const [cases, setCases] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseTypes, setCaseTypes] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        const response = await axiosConfig.get('http://localhost:3010/api/solicitud/asignadas', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const filteredCases = response.data.solicitudesAsignadas.filter(c => c.estado !== 'finalizado');
        setCases(filteredCases);
      } catch (error) {
        console.error('Error al obtener los casos:', error.response?.data || error.message);
      }
    };

    const fetchCaseTypes = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        const response = await axiosConfig.get('http://localhost:3010/api/tipoCaso', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        const caseTypesData = response.data.data;
    
        if (Array.isArray(caseTypesData)) {
          console.log('Tipos de caso recibidos:', caseTypesData);
          setCaseTypes(caseTypesData);
        } else {
          console.error('La propiedad data de la respuesta de la API no es un array:', caseTypesData);
          setCaseTypes([]);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de caso:', error.response?.data || error.message);
        setCaseTypes([]);
      }
    };
    
    fetchCases();
    fetchCaseTypes();
  }, []);

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'Descripción', selector: row => row.descripcion },
    { name: 'Fecha', selector: row => new Date(row.fecha).toLocaleDateString() },
    { name: 'Estado', selector: row => row.estado },
    { name: 'Código de Caso', selector: row => row.codigoCaso },
    {
      name: 'Acciones',
      cell: row => (
        <button onClick={() => openModal(row)}>
          Solucionar Caso
        </button>
      )
    }
  ];

  const openModal = (caseData) => {
    setSelectedCase(caseData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  

  const handleSubmit = async () => {
    try {
      if (!selectedCase) {
        console.error('No hay caso seleccionado.');
        return;
      }
  
      console.log("ID del caso seleccionado:", selectedCase._id);
    
      const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

      const updatedCase = {
        descripcionSolucion: selectedCase.solucion,
        tipoCaso: selectedCase._id,
        tipoSolucion: selectedCase.tipoSolucion,
      };

      // Validar que todos los campos estén completos antes de enviar
      if (!updatedCase.descripcionSolucion || !updatedCase.tipoCaso || !updatedCase.tipoSolucion) {
        alert('Por favor completa todos los campos antes de enviar.');
        return;
      }
      console.log (updatedCase)
      // Realizamos la solicitud POST, incluyendo el ID en la URL y el token en los headers
      const response = await axiosConfig.post(
        `http://localhost:3010/api/solucionCaso/${selectedCase._id}`, 
        updatedCase,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Respuesta del servidor:', response.data);
    
      // Si la solución es 'finalizado', eliminar el caso de la lista
      if (updatedCase.tipoSolucion === 'finalizado') {
        setCases(cases.filter(c => c._id !== selectedCase._id));
      }
    
      closeModal();  // Cierra el modal después de enviar la solución
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
        alert('Error al actualizar el caso: ' + (error.response.data.error || 'Error desconocido.'));
      } else {
        console.error('Error en la solicitud:', error.message);
        alert('Error en la solicitud: ' + error.message);
      }
    }
  };

  return (
    <AppLayout>
      <TecnicoLayout>
        <div>
          <div>
            <DataTable columns={columns} data={cases} pagination />
          </div>

          {selectedCase && (
            <SolutionModal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              onSubmit={handleSubmit}
              solutionDescription={selectedCase.solucion}
              setSolutionDescription={(value) => setSelectedCase({ ...selectedCase, solucion: value })}
              caseType={selectedCase.tipoCaso}
              setCaseType={(value) => setSelectedCase({ ...selectedCase, tipoCaso: value })}
              solutionType={selectedCase.tipoSolucion}
              setSolutionType={(value) => setSelectedCase({ ...selectedCase, tipoSolucion: value })}
              caseTypes={caseTypes}
            />
          )}
        </div>
      </TecnicoLayout>
    </AppLayout>
  );
};

export default CasosPorResolverTabla;

