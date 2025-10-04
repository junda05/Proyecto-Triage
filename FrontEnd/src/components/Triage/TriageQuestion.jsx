import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import LikertScale from '../ui/LikertScale';
import TriageCard from './TriageCard';

const TriageQuestion = ({ 
  pregunta, 
  onRespuesta, 
  loading = false,
  className = '' 
}) => {
  const [valorRespuesta, setValorRespuesta] = useState('');
  const [valoresMultiples, setValoresMultiples] = useState([]);
  const [informacionAdicional, setInformacionAdicional] = useState('');
  const [otroEspecificar, setOtroEspecificar] = useState('');
  const [error, setError] = useState('');

  // Resetear valores cuando cambia la pregunta
  useEffect(() => {
    setValorRespuesta('');
    setValoresMultiples([]);
    setInformacionAdicional('');
    setOtroEspecificar('');
    setError('');
  }, [pregunta?.codigo]);

  const validarRespuesta = () => {
    setError('');
    
    if (!pregunta) {
      setError('No hay pregunta para responder');
      return false;
    }

    // Validaciones según tipo de pregunta
    switch (pregunta.tipo) {
      case 'boolean':
        if (!valorRespuesta) {
          setError('Por favor selecciona una opción');
          return false;
        }
        break;
      
      case 'choice':
        if (!valorRespuesta) {
          setError('Por favor selecciona una opción');
          return false;
        }
        break;
      
      case 'multi_choice':
        if (valoresMultiples.length === 0) {
          setError('Por favor selecciona al menos una opción');
          return false;
        }
        // Validar que si se selecciona "Otro (especificar)", se proporcione el texto
        if (valoresMultiples.includes('Otro (especificar)') && !otroEspecificar.trim()) {
          setError('Por favor especifica la información adicional para "Otro (especificar)"');
          return false;
        }
        break;
      
      case 'numeric':
        if (!valorRespuesta || isNaN(valorRespuesta)) {
          setError('Por favor ingresa un valor numérico válido');
          return false;
        }
        break;
      
      case 'scale':
        if (!valorRespuesta) {
          setError('Por favor selecciona un valor en la escala');
          return false;
        }
        break;
      
      case 'text':
        if (!valorRespuesta.trim()) {
          setError('Por favor proporciona una respuesta');
          return false;
        }
        break;
      
      default:
        break;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validarRespuesta()) {
      return;
    }

    let valorFinal;
    let informacionFinal = informacionAdicional || null;
    
    // Preparar valor según tipo de pregunta
    switch (pregunta.tipo) {
      case 'boolean':
        // Convertir 'Si'/'No' a booleanos reales
        valorFinal = valorRespuesta === 'Si';
        break;
      case 'multi_choice':
        valorFinal = valoresMultiples;
        // Si se selecciona "Otro (especificar)", agregar el texto a información adicional
        if (valoresMultiples.includes('Otro (especificar)') && otroEspecificar.trim()) {
          informacionFinal = otroEspecificar.trim();
        }
        break;
      case 'numeric':
        valorFinal = parseFloat(valorRespuesta);
        break;
      case 'scale':
        valorFinal = parseInt(valorRespuesta);
        break;
      default:
        valorFinal = valorRespuesta;
    }

    onRespuesta(valorFinal, informacionFinal);
  };

  const handleMultipleChoice = (opcion, checked) => {
    const esOpcionNinguna = opcion === 'Ninguna de las anteriores' || opcion === 'Ninguno de los anteriores';
    const esCancer = opcion === 'Cáncer';
    
    if (checked) {
      setValoresMultiples(prev => {
        // Si se selecciona "Ninguna/Ninguno de las/los anteriores", limpiar otras opciones
        if (esOpcionNinguna) {
          return [opcion];
        }
        
        // Si se selecciona "Cáncer", limpiar todas las otras opciones (excepto "Ninguna de las anteriores")
        if (esCancer) {
          return [opcion];
        }
        
        // Si se selecciona otra opción y "Cáncer" está seleccionado, remover cáncer
        let newValues = prev.filter(val => val !== 'Cáncer');
        
        // Si se selecciona otra opción y "Ninguna/Ninguno de las/los anteriores" está seleccionada, removerla
        newValues = newValues.filter(val => val !== 'Ninguna de las anteriores' && val !== 'Ninguno de los anteriores');
        
        // Evitar duplicados
        if (!newValues.includes(opcion)) {
          return [...newValues, opcion];
        }
        return newValues;
      });
    } else {
      setValoresMultiples(prev => prev.filter(val => val !== opcion));
      // Si se deselecciona "Otro (especificar)", limpiar el texto
      if (opcion === 'Otro (especificar)') {
        setOtroEspecificar('');
      }
    }
  };

  const renderInput = () => {
    if (!pregunta) return null;

    switch (pregunta.tipo) {
      case 'boolean':
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`pregunta-${pregunta.codigo}-label`}>
            {['Si', 'No'].map(opcion => (
              <label key={opcion} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.codigo}`}
                  value={opcion}
                  checked={valorRespuesta === opcion}
                  onChange={(e) => setValorRespuesta(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                  aria-describedby={error ? `error-${pregunta.codigo}` : undefined}
                />
                <span className="text-gray-700 dark:text-gray-300">{opcion}</span>
              </label>
            ))}
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`pregunta-${pregunta.codigo}-label`}>
            {pregunta.opciones?.map(opcion => (
              <label key={opcion} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.codigo}`}
                  value={opcion}
                  checked={valorRespuesta === opcion}
                  onChange={(e) => setValorRespuesta(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                  aria-describedby={error ? `error-${pregunta.codigo}` : undefined}
                />
                <span className="text-gray-700 dark:text-gray-300">{opcion}</span>
              </label>
            ))}
          </div>
        );

      case 'multi_choice':
        const ningunaDeLasAnterioresSeleccionada = valoresMultiples.includes('Ninguna de las anteriores') || 
                                                 valoresMultiples.includes('Ninguno de los anteriores');
        const cancerSeleccionado = valoresMultiples.includes('Cáncer');
        
        return (
          <div className="space-y-3">
            {pregunta.opciones?.map(opcion => {
              const esNingunaDeLasAnteriores = opcion === 'Ninguna de las anteriores' || opcion === 'Ninguno de los anteriores';
              const esOtroEspecificar = opcion === 'Otro (especificar)';
              const esCancer = opcion === 'Cáncer';
              
              // Lógica de deshabilitación
              let estaDeshabilitada = false;
              
              // Si "Ninguna de las anteriores" está seleccionada, deshabilitar otras opciones
              if (ningunaDeLasAnterioresSeleccionada && !esNingunaDeLasAnteriores) {
                estaDeshabilitada = true;
              }
              // Si "Cáncer" está seleccionado, deshabilitar todas las otras opciones (excepto "Ninguna de las anteriores")
              else if (cancerSeleccionado && !esCancer && !esNingunaDeLasAnteriores) {
                estaDeshabilitada = true;
              }
              // Si hay otras enfermedades seleccionadas (no cáncer, no ninguna), deshabilitar cáncer
              else if (!esCancer && !esNingunaDeLasAnteriores && valoresMultiples.length > 0 && !cancerSeleccionado) {
                if (esCancer) {
                  estaDeshabilitada = true;
                }
              }
              
              return (
                <div key={opcion}>
                  <label 
                    className={`flex items-center space-x-3 ${
                      estaDeshabilitada ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={valoresMultiples.includes(opcion)}
                      onChange={(e) => handleMultipleChoice(opcion, e.target.checked)}
                      disabled={estaDeshabilitada}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`text-gray-700 dark:text-gray-300 ${
                      estaDeshabilitada ? 'opacity-50' : ''
                    }`}>
                      {opcion}
                    </span>
                  </label>
                  
                  {/* Campo de texto para "Otro (especificar)" - debajo del checkbox */}
                  {esOtroEspecificar && valoresMultiples.includes(opcion) && (
                    <div className="ml-7 mt-2">
                      <FormInput
                        id={`otro-especificar-${pregunta.codigo}`}
                        type="text"
                        value={otroEspecificar}
                        onChange={(e) => setOtroEspecificar(e.target.value)}
                        placeholder="Especifique..."
                        className="max-w-md"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'numeric':
        return (
          <FormInput
            id={`pregunta-${pregunta.codigo}`}
            type="number"
            value={valorRespuesta}
            onChange={(e) => setValorRespuesta(e.target.value)}
            placeholder={`Ingresa un valor ${pregunta.unidad ? `en ${pregunta.unidad}` : ''}`}
            error={error}
          />
        );

      case 'scale':
        const min = Math.min(...pregunta.opciones);
        const max = Math.max(...pregunta.opciones);
        const labels = pregunta.etiquetas || {};
        
        return (
          <div className="space-y-4">
            <LikertScale
              min={min}
              max={max}
              value={valorRespuesta ? parseInt(valorRespuesta) : null}
              onChange={(value) => setValorRespuesta(value.toString())}
              labels={labels}
              error={error}
              disabled={loading}
              className="w-full"
              showProgressBar={true}
            />
          </div>
        );

      case 'text':
        return (
          <FormInput
            id={`pregunta-${pregunta.codigo}`}
            type="text"
            value={valorRespuesta}
            onChange={(e) => setValorRespuesta(e.target.value)}
            placeholder="Describe tu respuesta..."
            error={error}
          />
        );

      default:
        return (
          <FormInput
            id={`pregunta-${pregunta.codigo}`}
            type="text"
            value={valorRespuesta}
            onChange={(e) => setValorRespuesta(e.target.value)}
            placeholder="Tu respuesta..."
            error={error}
          />
        );
    }
  };

  if (!pregunta) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No hay pregunta disponible
      </div>
    );
  }

  return (
    <TriageCard className={className}>
      <div className="space-y-6 py-6">
        {/* Pregunta */}
        <div className="text-center">
          <h3 
            id={`pregunta-${pregunta.codigo}-label`}
            className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
          >
            {pregunta.texto}
          </h3>
          
          {pregunta.descripcion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
              {pregunta.descripcion}
            </p>
          )}
        </div>

        {/* Error local */}
        {error && (
          <div 
            id={`error-${pregunta.codigo}`}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Input de respuesta */}
        <div className="space-y-4">
          {renderInput()}
        </div>

        {/* Campo adicional para información extra - Solo para medicamentos, no para alergias */}
        {pregunta.codigo.includes('medicamento') && 
         valorRespuesta && valorRespuesta !== 'No' && valorRespuesta !== 'Ninguna de las anteriores' && (
          <div className="space-y-4">
            <FormInput
              id={`adicional-${pregunta.codigo}`}
              type="text"
              value={informacionAdicional}
              onChange={(e) => setInformacionAdicional(e.target.value)}
              placeholder="Especifica (opcional)..."
              label="Información adicional"
            />
          </div>
        )}

        {/* Botón para enviar respuesta */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto sm:min-w-[200px] mx-auto block"
          >
            {loading ? 'Enviando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </TriageCard>
  );
};

export default TriageQuestion;
