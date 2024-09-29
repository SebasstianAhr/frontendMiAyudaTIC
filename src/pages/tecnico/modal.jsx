import React from 'react';
import Modal from 'react-modal';
import './css/modal.css';

const SolutionModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  solutionDescription = "", // Asegúrate de que tenga un valor por defecto
  setSolutionDescription,
  caseType = "", // Valor por defecto
  setCaseType,
  solutionType = "", // Valor por defecto
  setSolutionType,
  caseTypes // Recibe los tipos de caso desde las props
}) => {
  // Validar que caseTypes es un array
  if (!Array.isArray(caseTypes)) {
    console.error('caseTypes debe ser un array', caseTypes);
    return null; // Opcional: puedes mostrar un mensaje de error o un estado alternativo aquí
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Solucionar Caso"
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false} // Para desactivar advertencias si no usas setAppElement
    >
      <h2 className="text-xl font-semibold mb-4">Solucionar Caso</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(); // Llama a la función de envío con los datos actuales del formulario
      }}>
        <div className="mb-4">
          <label htmlFor="solutionDescription" className="block text-sm font-medium text-gray-700">Descripción de la Solución:</label>
          <input
            id="solutionDescription"
            type="text"
            value={solutionDescription} // Asegúrate de que tenga un valor definido
            onChange={(e) => setSolutionDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">Tipo de Caso:</label>
          <select
            id="caseType"
            value={caseType} // Asegúrate de que tenga un valor definido
            onChange={(e) => setCaseType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar tipo</option>
            {caseTypes.map((type, index) => (
              <option key={type.id || index} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="solutionType" className="block text-sm font-medium text-gray-700">Tipo de Solución:</label>
          <select
            id="solutionType"
            value={solutionType} // Asegúrate de que tenga un valor definido
            onChange={(e) => setSolutionType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="pendiente">pendiente</option>
            <option value="finalizado">finalizado</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SolutionModal;


