import React, { useEffect, useState } from 'react';
import { HistorialSolicitudesFuncionario } from '../../services/solicitud.services';
import DataTable from 'react-data-table-component';

export default function HistorialFuncionario() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const solicitudes = await HistorialSolicitudesFuncionario();
        setHistorial(solicitudes);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }
    };
    fetchHistorial();
  }, []);

  // Configuración de las columnas de la tabla
  const columnas = [
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.estado,
      sortable: true,
    },
    {
      name: 'Ambiente',
      selector: (row) => (row.ambiente ? row.ambiente.nombre : 'N/A'),
      sortable: true,
    },
    {
      name: 'Técnico',
      selector: (row) => (row.tecnico ? row.tecnico.nombre : 'N/A'),
      sortable: true,
    },
    {
      name: 'Solución',
      selector: (row) => (row.solucion ? row.solucion.descripcionSolucion : 'N/A'),
      sortable: true,
    },
  ];

  return (
    <div className="p-4">
      <DataTable
        columns={columnas}
        data={historial}
        pagination // Habilitar la paginación
        highlightOnHover
        striped
        noDataComponent="No hay solicitudes finalizadas."
      />
    </div>
  );
}
