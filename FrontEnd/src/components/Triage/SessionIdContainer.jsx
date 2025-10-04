import React, { useState, useCallback, memo } from 'react';
import Button from '../ui/Button';
import TriageCard from './TriageCard';
import { 
  SessionDocumentIcon, 
  CopyIcon, 
  CheckMarkIcon, 
  IconoAdvertencia 
} from '../icons/Icons';

const SessionIdContainer = memo(({ 
  sessionId,
  onContinue
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = sessionId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Error al copiar al portapapeles:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  }, [sessionId]);

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    }
  }, [onContinue]);

  if (!sessionId) {
    return null;
  }

  return (
    <TriageCard>
      <div className="space-y-6 py-6">
        {/* Header con icono y título */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <SessionDocumentIcon tamaño="lg" className="text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ¡Registro exitoso!
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
            Tu triage ha comenzado exitosamente. Te hemos asignado un ID único que te permitirá recuperar tu sesión 
            si cierras el navegador, se apaga tu dispositivo o ocurre algún problema técnico.
          </p>
        </div>

        {/* ID de sesión */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <SessionDocumentIcon tamaño="sm" className="text-gray-500 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tu ID de sesión:
            </label>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 shadow-sm">
              <span className="text-sm font-mono text-gray-900 dark:text-white break-all leading-relaxed">
                {sessionId}
              </span>
            </div>
            
            <Button
              onClick={handleCopyId}
              variant={copied ? "success" : "secondary"}
              className="flex-shrink-0 min-w-[100px] transition-all duration-200 w-full sm:w-auto"
            >
              <div className="flex items-center gap-2 justify-center">
                {copied ? (
                  <>
                    <CheckMarkIcon tamaño="sm" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <CopyIcon tamaño="sm" />
                    <span>Copiar</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Alerta importante */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <IconoAdvertencia tamaño="sm" className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed">
                <span className="font-semibold">Importante:</span> Guarda este ID en un lugar seguro. 
                Te ayudará a continuar tu triage desde donde lo dejaste si necesitas cerrar esta ventana.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de continuar */}
        <div className="pt-2">
          <Button
            onClick={handleContinue}
            className="w-full sm:w-auto sm:min-w-[200px] mx-auto block"
          >
            Continuar con el triage
          </Button>
        </div>
      </div>
    </TriageCard>
  );
});

SessionIdContainer.displayName = 'SessionIdContainer';

export default SessionIdContainer;
