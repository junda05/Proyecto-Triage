import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TriageContainer from '../../components/Triage/TriageContainer';
import useTriage from '../../hooks/useTriage';
import useAuth from '../../hooks/useAuth';
import ConfirmModal from '../../components/ui/ConfirmModal';

const TriagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mostrarExito } = useAuth();
  
  const {
    sesionActual,
    preguntaActual,
    loading,
    error,
    triageCompletado,
    nivelESI,
    progreso,
    iniciarSesionTriage,
    recuperarSesionPorId,
    enviarRespuesta,
    reiniciarTriage,
    limpiarError
  } = useTriage();

  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    message: '', 
    onConfirm: null, 
    title: 'Confirmar' 
  });
  const [showSessionId, setShowSessionId] = useState(false);
  const [showSessionRecovery, setShowSessionRecovery] = useState(false);
  
  // Usar ref para evitar re-ejecución del useEffect cuando cambia sesionActual
  const inicializacionRef = useRef({ completada: false, pacienteId: null });

  // Inicializar triage cuando llegue información del paciente
  useEffect(() => {
    const state = location.state;
    
    // Evitar re-ejecutar si ya se procesó este paciente
    if (inicializacionRef.current.completada && 
        inicializacionRef.current.pacienteId === state?.pacienteId) {
      return;
    }
    
    if (state?.pacienteId && !sesionActual) {
      // Marcar como en proceso para este paciente
      inicializacionRef.current.pacienteId = state.pacienteId;
      
      // Configurar información del paciente
      setPacienteInfo({
        id: state.pacienteId,
        nombre: state.pacienteNombre || 'Paciente',
        apellido: state.pacienteApellido || ''
      });

      // Iniciar sesión de triage
      iniciarSesionTriage(state.pacienteId).then(resultado => {
        if (resultado.success) {
          // Mostrar ID de sesión cuando se inicia exitosamente
          setShowSessionId(true);
          // Notification removed to avoid duplication with SessionIdContainer
        }
        // Marcar inicialización como completada
        inicializacionRef.current.completada = true;
      });
    } else if (!state?.pacienteId && !inicializacionRef.current.completada) {
      // No hay información de navegación - mostrar recuperación
      setShowSessionRecovery(true);
      inicializacionRef.current.completada = true;
    }
  }, [location.state, iniciarSesionTriage, mostrarExito]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: sesionActual is intentionally omitted to prevent re-execution when session state changes

  // Manejar recuperación de sesión por ID
  const handleRecoverSession = useCallback(async (sessionId) => {
    try {
      const resultado = await recuperarSesionPorId(sessionId);
      
      if (resultado.success) {
        // Establecer información del paciente primero
        const pacienteData = resultado.data.sesion.paciente_detail;
        setPacienteInfo({
          id: resultado.data.sesion.paciente,
          nombre: pacienteData ? pacienteData.primer_nombre : 'Paciente',
          apellido: pacienteData ? pacienteData.primer_apellido : ''
        });
        
        // Luego ocultar la pantalla de recuperación
        // Esto se hace después para asegurar que el estado esté actualizado
        setTimeout(() => {
          setShowSessionRecovery(false);
          // Marcar como completada la inicialización
          inicializacionRef.current.completada = true;
          inicializacionRef.current.pacienteId = resultado.data.sesion.paciente;
        }, 100);
        
        return { success: true };
      } else if (resultado.shouldRedirectToRegister) {
        setTimeout(() => {
          navigate('/patients/register', { 
            replace: true,
            state: { 
              message: 'La sesión que intentaste recuperar ya fue completada. Por favor, registra un nuevo paciente.' 
            }
          });
        }, 2000);
        return { success: false, error: resultado.error };
      } else {
        // Retornar el error para que el componente lo maneje
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      console.error('Error inesperado al recuperar sesión:', error);
      return { success: false, error: 'Error inesperado al recuperar la sesión' };
    }
  }, [recuperarSesionPorId, navigate]);

  // Manejar inicio de nueva sesión cuando no se quiere recuperar
  const handleNewSession = useCallback(() => {
    setShowSessionRecovery(false);
    inicializacionRef.current.completada = true; // Marcar como completada antes de navegar
    navigate('/patients/register', { replace: true });
  }, [navigate]);

  // Manejar continuar después de mostrar el ID de sesión
  const handleSessionIdContinue = useCallback(() => {
    setShowSessionId(false);
  }, []);

  const handleRespuesta = useCallback(async (valorRespuesta, informacionAdicional) => {
    limpiarError();
    await enviarRespuesta(valorRespuesta, informacionAdicional);
  }, [limpiarError, enviarRespuesta]);

  const handleVolver = useCallback(() => {
    if (sesionActual && !triageCompletado) {
      setModalConfig({
        isOpen: true,
        title: 'Abandonar Evaluación',
        message: '¿Estás seguro de que quieres abandonar la evaluación de triage? Se perderá el progreso actual.',
        onConfirm: () => {
          setModalConfig({ isOpen: false, message: '', onConfirm: null, title: 'Confirmar' });
          reiniciarTriage();
          navigate('/');
        }
      });
      return;
    }
    navigate('/');
  }, [sesionActual, triageCompletado, reiniciarTriage, navigate]);

  const handleReiniciar = useCallback(() => {
    if (triageCompletado) {
      setModalConfig({
        isOpen: true,
        title: 'Registrar Nuevo Paciente',
        message: '¿Quieres registrar un nuevo paciente? Serás redirigido a la página principal.',
        onConfirm: () => {
          setModalConfig({ isOpen: false, message: '', onConfirm: null, title: 'Confirmar' });
          reiniciarTriage();
          // Reset de la inicialización
          inicializacionRef.current = { completada: false, pacienteId: null };
          navigate('/');
        }
      });
      return;
    }

    setModalConfig({
      isOpen: true,
      title: 'Reiniciar Evaluación',
      message: '¿Quieres reiniciar la evaluación? Esto creará una nueva sesión de triage para el mismo paciente.',
      onConfirm: () => {
        setModalConfig({ isOpen: false, message: '', onConfirm: null, title: 'Confirmar' });
        if (pacienteInfo) {
          reiniciarTriage();
          // Reset parcial para permitir nueva inicialización con el mismo paciente
          inicializacionRef.current.completada = false;
          setTimeout(() => {
            iniciarSesionTriage(pacienteInfo.id).then(resultado => {
              if (resultado.success) {
                setShowSessionId(true);
              }
              inicializacionRef.current.completada = true;
            });
          }, 100);
        }
      }
    });
  }, [triageCompletado, pacienteInfo, reiniciarTriage, navigate, iniciarSesionTriage]);

  const handleReintentar = useCallback(() => {
    if (pacienteInfo) {
      reiniciarTriage();
      // Reset parcial para permitir nueva inicialización
      inicializacionRef.current.completada = false;
      setTimeout(() => {
        iniciarSesionTriage(pacienteInfo.id).then(resultado => {
          if (resultado.success) {
            setShowSessionId(true);
          }
          inicializacionRef.current.completada = true;
        });
      }, 100);
    }
  }, [pacienteInfo, reiniciarTriage, iniciarSesionTriage]);

  const handleCloseModal = useCallback(() => {
    setModalConfig({ isOpen: false, message: '', onConfirm: null, title: 'Confirmar' });
  }, []);

  // Memoizar el nombre completo para evitar recalcular en cada render
  const nombreCompleto = useMemo(() => {
    return pacienteInfo ? 
      `${pacienteInfo.nombre || 'Paciente'} ${pacienteInfo.apellido || ''}`.trim() || 'Paciente' : 
      'Paciente';
  }, [pacienteInfo]);

  // Mostrar pantalla de carga si no hay información del paciente y no necesita recuperación
  if (!pacienteInfo && !showSessionRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando información del paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TriageContainer
        preguntaActual={preguntaActual}
        triageCompletado={triageCompletado}
        nivelESI={nivelESI}
        progreso={progreso}
        loading={loading}
        error={error}
        onRespuesta={handleRespuesta}
        onVolver={handleVolver}
        onReiniciar={handleReiniciar}
        onReintentar={handleReintentar}
        pacienteNombre={nombreCompleto}
        // Props para manejo de sesiones
        showSessionId={showSessionId}
        sessionId={sesionActual?.id}
        onSessionIdContinue={handleSessionIdContinue}
        showSessionRecovery={showSessionRecovery}
        onRecoverSession={handleRecoverSession}
        onNewSession={handleNewSession}
      />
      
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default TriagePage;
