import { useState, useEffect } from 'react';
import { obtenerAmbientes, crearSolicitud } from '../../services/solicitud.services';
import AppLayout from "../../layouts/appLayout/AppLayout";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";

export default function Funcionario() {
  const { register, handleSubmit, reset } = useForm();
  const [ambientes, setAmbientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const response = await obtenerAmbientes();
        const data = response.data;
        
        if (Array.isArray(data)) {
          setAmbientes(data);
        } else {
          setAmbientes([]);
        }
      } catch (error) {
        console.error('Error al cargar los ambientes:', error);
        setAmbientes([]);
      }
    };

    fetchAmbientes();
  }, []);

  const openModal = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const onSubmit = async () => {
    try {
      const submissionData = new FormData();
      submissionData.append('descripcion', formData.descripcion);
      submissionData.append('telefono', formData.telefono);
      submissionData.append('ambiente', formData.ambiente);
      submissionData.append('foto', formData.foto[0]);

      const response = await crearSolicitud(submissionData);
      console.log('Solicitud enviada con éxito:', response);
      toast.success('La solicitud ha sido realizada.');
      reset(); // Limpia el formulario después de enviarlo
      closeModal(); // Cierra el modal después de enviar
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Hubo un error al realizar la solicitud.');
      closeModal(); // Cierra el modal si ocurre un error
    }
  };

  return (
    <AppLayout>
      <main className="w-full flex justify-center py-8">
        <div className="w-full max-w-[30%] p-8 border rounded-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Solicitud</h2>
          <form onSubmit={handleSubmit(openModal)} className="flex flex-col space-y-4">
            <textarea
              className="p-3 border border-gray-300 rounded focus:outline-none"
              placeholder="Descripción"
              {...register('descripcion')}
            ></textarea>
            <input
              type="tel"
              placeholder="Teléfono"
              className="p-3 border border-gray-300 rounded focus:outline-none"
              {...register('telefono')}
            />
            <select
              className="p-3 border border-gray-300 rounded focus:outline-none"
              {...register('ambiente')}
            >
              <option value="">Ambiente de formacion</option>
              {ambientes.map((amb) => (
                <option key={amb._id} value={amb._id}>
                  {amb.nombre}
                </option>
              ))}
            </select>
            <div className="w-full flex items-center space-x-4 mt-3 justify-between">
              <label className="cursor-pointer bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center">
                Agregar Foto
                <input
                  type="file"
                  className="hidden"
                  {...register('foto')}
                />
              </label>
              <button
                type="submit"
                className="bg-azul-sena text-white py-2 px-4 rounded"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-4">¿Estás seguro de enviar esta solicitud?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Editar
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-azul-sena text-white rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
