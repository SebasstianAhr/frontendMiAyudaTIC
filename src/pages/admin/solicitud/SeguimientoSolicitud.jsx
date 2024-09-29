import React, { useEffect, useState } from "react";
import AppLayout from "../../../layouts/appLayout/AppLayout";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import AdminSolicitudLayout from "../../../layouts/adminLayout/AdminSolicitudLayout";
import DataTable from "react-data-table-component";
import { HistorialSolicitudesLider } from "../../../services/solicitud.services";

export default function SeguimientoSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await HistorialSolicitudesLider();
        setSolicitudes(data);
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const columnas = [
    {
      name: "Código del Caso",
      selector: (row) => row.codigoCaso, // Agregando código del caso
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: "Usuario",
      selector: (row) => (row.usuario ? row.usuario.nombre : "Sin usuario"),
      sortable: true,
    },
    {
      name: "Ambiente",
      selector: (row) => (row.ambiente ? row.ambiente.nombre : "Sin ambiente"),
      sortable: true,
    },
    {
      name: "Imagen",
      selector: (row) =>
        row.foto ? (
          <a
            href={row.foto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Ver Foto
          </a>
        ) : (
          "No disponible"
        ),
    },
    {
      name: "Técnico",
      selector: (row) => (row.tecnico ? row.tecnico.nombre : "N/A"), // Nombre del técnico
      sortable: true,
    },

    {
      name: "Solución",
      selector: (row) =>
        row.solucion ? row.solucion.descripcionSolucion : "N/A",
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (
        <span
          className={` ${
            row.estado === "finalizado"
              ? "text-verde-sena"
              : row.estado === "asignado"
              ? "text-yellow-500"
              : "text-black"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
  ];

  return (
    <AppLayout>
      <AdminLayout>
        <AdminSolicitudLayout>
        <main className="pl-8 py-8">

          <h2 className="text-xl font-bold mb-4">Seguimiento de Solicitudes</h2>
          <DataTable
            columns={columnas}
            data={solicitudes}
            progressPending={loading}
            paginationComponentOptions={paginationOptions}
            pagination
            highlightOnHover
            striped
            noDataComponent="No hay solicitudes disponibles."
          />
          
          </main>

        </AdminSolicitudLayout>
      </AdminLayout>
    </AppLayout>
  );
}
