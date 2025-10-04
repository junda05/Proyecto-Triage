import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useNotificaciones from '../hooks/useNotificaciones';

/**
 * Componente que protege el acceso a la página de triage
 * Solo permite acceso si se viene desde el registro de paciente con datos válidos
 */
const TriageProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { mostrarError, mostrarInfo } = useNotificaciones();
  const [validando, setValidando] = useState(true);
  const validacionEjecutada = useRef(false); // Ref para evitar múltiples validaciones

  useEffect(() => {
    // Evitar múltiples ejecuciones
    if (validacionEjecutada.current) {
      return;
    }

    const validarAcceso = () => {
      validacionEjecutada.current = true;
      
      // Verificar si hay información del paciente en el state de navegación
      const state = location.state;
      
      // Si hay state con pacienteId, permitir acceso inmediatamente
      if (state?.pacienteId) {
        const nombrePaciente = state.pacienteNombre ? 
          `${state.pacienteNombre} ${state.pacienteApellido || ''}`.trim() : 
          'Paciente';
          
        mostrarInfo(`Iniciando evaluación de triage para ${nombrePaciente}`, {
          titulo: 'Acceso autorizado'
        });
        
        setValidando(false);
        return;
      }
      
      // Sin state, permitir acceso directo para que TriagePage maneje la recuperación
      mostrarInfo('Preparando pantalla de recuperación de sesión...', {
        titulo: 'Preparando triage'
      });
      
      setValidando(false);
    };

    validarAcceso();
  }, [location.state, navigate, mostrarError, mostrarInfo]);

  // Mostrar loading mientras se valida
  if (validando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default TriageProtectedRoute;
