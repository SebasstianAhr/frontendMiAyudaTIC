import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AppLayout from '../../layouts/appLayout/AppLayout';
import TecnicoLayout from '../../layouts/tecnicoLayout/tecnicoLayout';
// import ReactToPrint from 'react-to-print'; // Si decides usar la funcionalidad de impresión

const CasosResueltosTabla = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        const response = await axios.get('http://localhost:3010/api/solicitud/finalizadas', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        console.log('Respuesta de la API:', response.data); // Para depurar la respuesta de la API
  
        if (response.data && response.data.solicitudesFinalizadas) {
          setCases(response.data.solicitudesFinalizadas);
        } else {
          console.error('No se encontraron solicitudes asignadas.');
        }
      } catch (error) {
        console.error('Error al obtener los casos resueltos:', error.response || error);
      }
    };
  
    fetchCases();
  }, []);
  

  const filteredCases = cases.filter(c =>
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'Código del Caso', selector: row => row.codigoCaso },
    { name: 'Descripción', selector: row => row.descripcion },
    { name: 'Fecha de Resolución', selector: row => row.fecha },
    { 
      name: 'Solución', 
      selector: row => row.solucion ? row.solucion.descripcionSolucion : 'No disponible', 
      width: '200px' // Establece el ancho aquí también
    },
    { name: 'Ambiente', selector: row => row.ambiente ? row.ambiente.nombre : 'No disponible' }, // Mostrar ambiente si existe
  ];


  

  return (
    <AppLayout>
    <TecnicoLayout>
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Casos Resueltos</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Si decides usar la funcionalidad de impresión
        <ReactToPrint
          trigger={() => (
            <button className="btn bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transition ease-in-out duration-150 ml-4">
              Descargar PDF
            </button>
          )}
          content={() => printRef.current}
        />
        */}
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filteredCases} // Aquí se usa el filtro de búsqueda
          pagination
          responsive
        />
      </div>
    </div>
    </TecnicoLayout>
    </AppLayout>
  );
};

export default CasosResueltosTabla;
