import React, { memo, useCallback } from 'react';
import TriageQuestion from './TriageQuestion';
import TriageCompletion from './TriageCompletion';
import TriageError from './TriageError';
import TriageLoader from './TriageLoader';
import SessionIdContainer from './SessionIdContainer';
import SessionRecoveryContainer from './SessionRecoveryContainer';
import ProgressBar from '../ui/ProgressBar';
import FormContainer from '../ui/FormContainer';
import Button from '../ui/Button';

const TriageContainer = memo(({ 
  preguntaActual,
  triageCompletado,
  nivelESI,
  progreso,
  loading,
  error,
  onRespuesta,
  onVolver,
  onReiniciar,
  onReintentar,
  pacienteNombre = 'Paciente',
  // Nuevas props para manejo de sesiones
  showSessionId = false,
  sessionId = null,
  onSessionIdContinue = null,
  showSessionRecovery = false,
  onRecoverSession = null,
  onNewSession = null
}) => {

  const handleVolver = useCallback(() => {
    if (onVolver) {
      onVolver();
    }
  }, [onVolver]);

  // Memoizar el título para evitar recalcular en cada render
  const title = showSessionId ? "Registro Exitoso" :
    showSessionRecovery ? "Recuperar Sesión" :
    triageCompletado ? "Evaluación Completada" : "Evaluación de Triage";

  // Mostrar barra de progreso y info del paciente
  const showProgressAndPatient = !showSessionId && !showSessionRecovery;
  
  // Mostrar error global
  const showGlobalError = error && !triageCompletado && !preguntaActual && !showSessionId && !showSessionRecovery;
  
  // Mostrar contenido principal
  const showMainContent = showSessionId || showSessionRecovery || (!error || preguntaActual);

  return (
    <FormContainer
      title={title}
      showBackButton={showProgressAndPatient}
      onBack={handleVolver}
      className="max-w-4xl mx-auto"
    >
      {/* Barra de progreso */}
      {showProgressAndPatient && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progreso de la evaluación
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progreso)}% completado
            </span>
          </div>
          <ProgressBar progress={progreso} showShimmer={!triageCompletado} />
        </div>
      )}

      {/* Información del paciente */}
      {showProgressAndPatient && (
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Evaluando a: <span className="font-medium text-gray-900 dark:text-white">{pacienteNombre}</span>
          </p>
        </div>
      )}

      {/* Error global */}
      {showGlobalError && (
        <TriageError
          error={error}
          onReintentar={onReintentar}
          onVolver={handleVolver}
          loading={loading}
        />
      )}

      {/* Contenido principal */}
      {showMainContent && (
        <div className="min-h-[500px] flex items-start justify-center">
          {/* Mostrar contenedor para ID de sesión */}
          {showSessionId && sessionId ? (
            <SessionIdContainer
              sessionId={sessionId}
              onContinue={onSessionIdContinue}
            />
          ) : /* Mostrar contenedor para recuperación de sesión */
          showSessionRecovery ? (
            <SessionRecoveryContainer
              onRecoverSession={onRecoverSession}
              onNewSession={onNewSession}
              loading={loading}
            />
          ) : /* Triage completado */
          triageCompletado ? (
            <TriageCompletion 
              nivelESI={nivelESI}
              onVolver={handleVolver}
              onReiniciar={onReiniciar}
              pacienteNombre={pacienteNombre}
            />
          ) : /* Pregunta actual */
          preguntaActual ? (
            <div className="w-full max-w-3xl">
              <TriageQuestion
                pregunta={preguntaActual}
                onRespuesta={onRespuesta}
                loading={loading}
                className="w-full"
              />
            </div>
          ) : (
            <div className="text-center">
              {loading ? (
                <TriageLoader 
                  mensaje="Cargando pregunta..."
                  submensaje="Preparando tu evaluación personalizada"
                />
              ) : !showSessionId && !showSessionRecovery ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">No hay preguntas disponibles</p>
                  <Button onClick={handleVolver} variant="secondary">
                    Volver al inicio
                  </Button>
                </div>
              ) : (
                <TriageLoader 
                  mensaje="Procesando..."
                  submensaje="Un momento por favor"
                />
              )}
            </div>
          )}
        </div>
      )}
    </FormContainer>
  );
});

TriageContainer.displayName = 'TriageContainer';

export default TriageContainer;
