import React from 'react';
import SectionDescription from '../../ui/SectionDescription';

const SymptomsStep = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Motivo de Consulta
        </h3>
        <SectionDescription>
          Describa los síntomas que presenta actualmente. Sea lo más específico posible: cuándo comenzaron, cómo se sienten, qué los empeora o mejora.
        </SectionDescription>
      </div>
      
      <div>
        <label htmlFor="sintomas_iniciales" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describa sus síntomas actuales
        </label>
        <textarea
          id="sintomas_iniciales"
          name="sintomas_iniciales"
          rows={6}
          value={formData.sintomas_iniciales}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors duration-200 ${
            errors.sintomas_iniciales
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400'
          }`}
          placeholder="Ejemplo: Desde ayer en la noche siento dolor de cabeza intenso que empeora con la luz. También tengo náuseas y un poco de fiebre..."
          required
        />
        {errors.sintomas_iniciales && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.sintomas_iniciales}
          </p>
        )}
      </div>
    </div>
  );
};

export default SymptomsStep;
