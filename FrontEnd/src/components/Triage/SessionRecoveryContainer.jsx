import React, { useState, useCallback, memo } from 'react';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import TriageCard from './TriageCard';
import { 
  RecoveryIcon, 
  LoadingIcon 
} from '../icons/Icons';

const SessionRecoveryContainer = memo(({ 
  onRecoverSession, 
  onNewSession,
  loading = false
}) => {
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!sessionId.trim()) {
      return;
    }

    // onRecoverSession ahora retorna un resultado y maneja los errores via notificaciones
    await onRecoverSession(sessionId.trim());
  }, [sessionId, onRecoverSession]);

  const handleInputChange = useCallback((e) => {
    setSessionId(e.target.value);
  }, []);

  const handleNewSession = useCallback(() => {
    setSessionId('');
    onNewSession();
  }, [onNewSession]);

  return (
    <TriageCard>
      <div className="space-y-6 py-6">
        {/* Header con icono y título */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <RecoveryIcon tamaño="lg" className="text-blue-600 dark:text-blue-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Recuperar sesión de triage
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
            ¿Tienes un ID de sesión anterior que quieres continuar?
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <FormInput
              id="sessionId"
              name="sessionId"
              type="text"
              value={sessionId}
              onChange={handleInputChange}
              placeholder="Ej: 12345678-1234-1234-1234-123456789012"
              label="ID de sesión"
              disabled={loading}
              className="text-sm font-mono"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleNewSession}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] order-2 sm:order-1"
            >
              Nuevo triage
            </Button>
            
            <Button
              type="submit"
              disabled={loading || !sessionId.trim()}
              className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <LoadingIcon tamaño="sm" />
                  <span>Recuperando...</span>
                </>
              ) : (
                "Recuperar"
              )}
            </Button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
            Si no tienes un ID de sesión o quieres empezar desde el principio, 
            puedes crear un nuevo triage.
          </p>
        </div>
      </div>
    </TriageCard>
  );
});

SessionRecoveryContainer.displayName = 'SessionRecoveryContainer';

export default SessionRecoveryContainer;