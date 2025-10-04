import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormContainer from '../../components/ui/FormContainer';
import ProgressBar from '../../components/ui/ProgressBar';
import StepNavigation from '../../components/ui/StepNavigation';
import StepIndicator from '../../components/ui/StepIndicator';
import { ArrowLeftIcon } from '../../components/icons/Icons';
import pacienteService from '../../services/api/pacienteService';
import useMultiStepForm from '../../hooks/useMultiStepForm';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import { 
  validadoresPaciente, 
  validadoresContactoEmergencia,
  validarNombreCompletoMinimo,
  validarDiferenciaPacienteContacto,
  validarDatosPaciente,
  validarDatosContactoEmergencia
} from '../../services/utils/validadores';

// Importar los componentes de pasos
import PersonalContactStep from '../../components/forms/PatientFormSteps/PersonalContactStep';
import HealthInfoStep from '../../components/forms/PatientFormSteps/HealthInfoStep';
import EmergencyContactStep from '../../components/forms/PatientFormSteps/EmergencyContactStep';
import SymptomsStep from '../../components/forms/PatientFormSteps/SymptomsStep';

const PatientBasicData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hook de autenticación
  const auth = useAuth();
  
  // Hook de notificaciones centralizado
  const { mostrarExito, mostrarError, mostrarInfo } = useNotificaciones();
  
  // Configuración de pasos
  const TOTAL_STEPS = 4;
  const STEP_NAMES = [
    'Información Personal y Contacto',
    'Información de Salud',
    'Contacto de Emergencia',
    'Motivo de Consulta'
  ];

  // Datos iniciales del formulario
  const initialFormData = {
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fecha_nacimiento: '',
    tipo_documento: '',
    numero_documento: '',
    sexo: '',
    prefijo_telefonico: '+57',
    telefono: '',
    regimen_eps: '',
    eps: '',
    tiene_seguro_medico: false,
    nombre_seguro_medico: '', // Ensure this is always a string
    sintomas_iniciales: '',
    // Datos del contacto de emergencia
    contacto_emergencia: {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      prefijo_telefonico: '+57',
      telefono: '',
      relacion_parentesco: ''
    }
  };

  // Hook personalizado para manejo de pasos
  const {
    currentStep,
    formData,
    errors,
    nextStep,
    previousStep,
    updateFormData,
    updateNestedFormData,
    clearErrors,
    setFieldErrors,
    getProgress
  } = useMultiStepForm(TOTAL_STEPS, initialFormData);

  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const welcomeShownRef = useRef(false);

  // Mostrar notificación de bienvenida al cargar el formulario (solo una vez)
  useEffect(() => {
    if (!welcomeShownRef.current) {
      // Verificar si hay un mensaje específico desde la navegación
      const state = location.state;
      if (state?.message) {
        // Mostrar mensaje específico de redirección
        mostrarInfo(state.message, {
          titulo: 'Información'
        });
      } else {
        // Mensaje de bienvenida por defecto
        mostrarInfo('Complete el formulario paso a paso para registrarse', {
          titulo: 'Bienvenido al registro'
        });
      }
      welcomeShownRef.current = true;
    }
  }, [mostrarInfo, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('contacto_emergencia.')) {
      const fieldName = name.replace('contacto_emergencia.', '');
      updateNestedFormData(`contacto_emergencia.${fieldName}`, type === 'checkbox' ? checked : value);
      
      // Limpiar errores del campo actual
      if (errors[name]) {
        clearErrors([name]);
      }
    } else {
      updateFormData({ [name]: type === 'checkbox' ? checked : value });

      // Si cambió la fecha de nacimiento, revalidar tipo de documento
      if (name === 'fecha_nacimiento' && formData.tipo_documento) {
        const updatedFormData = { ...formData, [name]: value };
        const tipoDocError = validadoresPaciente.tipo_documento(formData.tipo_documento, updatedFormData);
        if (tipoDocError) {
          setFieldErrors({ tipo_documento: tipoDocError });
        } else {
          clearErrors(['tipo_documento']);
        }
      }

      // Limpiar errores del campo actual
      if (errors[name]) {
        clearErrors([name]);
      }
    }
  };

  const handleDropdownChange = (fieldName) => (e) => {
    const { value } = e.target;
    
    if (fieldName.startsWith('contacto_emergencia.')) {
      const contactFieldName = fieldName.replace('contacto_emergencia.', '');
      updateNestedFormData(`contacto_emergencia.${contactFieldName}`, value);
    } else {
      updateFormData({ [fieldName]: value });
      
      // Si cambió el tipo de documento, validar inmediatamente con la fecha de nacimiento actual
      if (fieldName === 'tipo_documento') {
        const updatedFormData = { ...formData, [fieldName]: value };
        const tipoDocError = validadoresPaciente.tipo_documento(value, updatedFormData);
        if (tipoDocError) {
          setFieldErrors({ tipo_documento: tipoDocError });
        } else {
          clearErrors(['tipo_documento']);
        }
      }
    }

    // Limpiar errores del campo actual si no hay error de validación específica
    if (errors[fieldName] && fieldName !== 'tipo_documento') {
      clearErrors([fieldName]);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Información Personal y Contacto
        ['primer_nombre', 'primer_apellido', 'fecha_nacimiento', 'tipo_documento', 'numero_documento', 'sexo', 'prefijo_telefonico', 'telefono'].forEach(field => {
          if (validadoresPaciente[field]) {
            const error = validadoresPaciente[field](formData[field], formData);
            if (error) {
              newErrors[field] = error;
            }
          }
        });

        // Validar que el nombre completo tenga al menos 3 palabras (solo en paso 1)
        const errorNombreCompleto = validarNombreCompletoMinimo(formData, 'paciente');
        if (errorNombreCompleto) {
          newErrors.nombre_completo_minimo = errorNombreCompleto;
        }

        // Validar campos duplicados del paciente
        const errorDuplicadosPaciente = validarDatosPaciente(formData);
        if (errorDuplicadosPaciente) {
          newErrors.campos_duplicados_paciente = errorDuplicadosPaciente;
        }

        break;

      case 2: // Información de Salud
        ['regimen_eps', 'eps'].forEach(field => {
          if (validadoresPaciente[field]) {
            const error = validadoresPaciente[field](formData[field]);
            if (error) {
              newErrors[field] = error;
            }
          }
        });

        // Validación específica si tiene seguro médico
        if (formData.tiene_seguro_medico && !formData.nombre_seguro_medico) {
          newErrors.nombre_seguro_medico = 'Este campo es obligatorio si tiene seguro médico';
        }
        break;

      case 3: // Contacto de Emergencia
        Object.keys(validadoresContactoEmergencia).forEach(field => {
          const validator = validadoresContactoEmergencia[field];
          const error = validator(formData.contacto_emergencia[field]);
          if (error) {
            newErrors[`contacto_emergencia.${field}`] = error;
          }
        });

        // Validar que el nombre completo del contacto tenga al menos 3 palabras
        const errorNombreCompletoContacto = validarNombreCompletoMinimo(formData, 'contacto');
        if (errorNombreCompletoContacto) {
          newErrors['contacto_emergencia.nombre_completo_minimo'] = errorNombreCompletoContacto;
        }

        // Validar campos duplicados del contacto de emergencia
        const errorDuplicadosContacto = validarDatosContactoEmergencia(formData.contacto_emergencia);
        if (errorDuplicadosContacto) {
          newErrors['contacto_emergencia.campos_duplicados'] = errorDuplicadosContacto;
        }

        // Validar que paciente y contacto sean diferentes
        const errorDiferencia = validarDiferenciaPacienteContacto(formData);
        if (errorDiferencia) {
          newErrors['contacto_emergencia.diferencia'] = errorDiferencia;
        }

        break;

      case 4: // Síntomas
        if (validadoresPaciente.sintomas_iniciales) {
          const error = validadoresPaciente.sintomas_iniciales(formData.sintomas_iniciales);
          if (error) {
            newErrors.sintomas_iniciales = error;
          }
        }
        break;

      default:
        // No hay validaciones específicas para otros pasos
        break;
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar datos del paciente
    Object.keys(validadoresPaciente).forEach(field => {
      const validator = validadoresPaciente[field];
      const error = validator(formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validar datos del contacto de emergencia
    Object.keys(validadoresContactoEmergencia).forEach(field => {
      const validator = validadoresContactoEmergencia[field];
      const error = validator(formData.contacto_emergencia[field]);
      if (error) {
        newErrors[`contacto_emergencia.${field}`] = error;
      }
    });

    // Validar que el nombre completo del paciente tenga al menos 3 palabras
    const errorNombreCompleto = validarNombreCompletoMinimo(formData, 'paciente');
    if (errorNombreCompleto) {
      newErrors.nombre_completo_minimo = errorNombreCompleto;
    }

    // Validar que el nombre completo del contacto tenga al menos 3 palabras
    const errorNombreCompletoContacto = validarNombreCompletoMinimo(formData, 'contacto');
    if (errorNombreCompletoContacto) {
      newErrors['contacto_emergencia.nombre_completo_minimo'] = errorNombreCompletoContacto;
    }

    // Validar campos duplicados del paciente
    const errorDuplicadosPaciente = validarDatosPaciente(formData);
    if (errorDuplicadosPaciente) {
      newErrors.campos_duplicados_paciente = errorDuplicadosPaciente;
    }

    // Validar campos duplicados del contacto de emergencia
    const errorDuplicadosContacto = validarDatosContactoEmergencia(formData.contacto_emergencia);
    if (errorDuplicadosContacto) {
      newErrors['contacto_emergencia.campos_duplicados'] = errorDuplicadosContacto;
    }

    // Validar que paciente y contacto sean diferentes
    const errorDiferencia = validarDiferenciaPacienteContacto(formData);
    if (errorDiferencia) {
      newErrors['contacto_emergencia.diferencia'] = errorDiferencia;
    }

    // Validación específica si tiene seguro médico
    if (formData.tiene_seguro_medico && !formData.nombre_seguro_medico) {
      newErrors.nombre_seguro_medico = 'Este campo es obligatorio si tiene seguro médico';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      clearErrors();
      
      // Marcar el paso actual como completado
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      nextStep();
      
      // Mostrar notificación de progreso
      mostrarInfo(`Paso ${currentStep + 1} de ${TOTAL_STEPS}: ${STEP_NAMES[currentStep]}`, {
        titulo: 'Sección completada'
      });
    } else {
      mostrarError('Por favor, complete todos los campos requeridos antes de continuar', {
        titulo: 'Campos requeridos'
      });
    }
  };

  const handlePrevious = () => {
    clearErrors();
    previousStep();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      mostrarError('Por favor, corrija los errores en el formulario', {
        titulo: 'Formulario incompleto'
      });
      return;
    }

    setLoading(true);
    // Eliminar esta notificación de "Registrando paciente..."
    // mostrarInfo('Registrando paciente...', {
    //   titulo: 'Procesando',
    //   autoCloseMs: 3000
    // });

    try {
      const result = await pacienteService.crearPaciente(formData);

      if (result.success) {
        mostrarExito('Paciente registrado exitosamente. Iniciando evaluación...', {
          titulo: 'Registro completado'
        });
        
        // Redirigir al triage después de un breve delay
        setTimeout(() => {
          navigate('/patients/triage', { 
            state: { 
              pacienteId: result.data.id,
              pacienteNombre: formData.primer_nombre,
              pacienteApellido: formData.primer_apellido
            } 
          });
        }, 2000);
      } else {
        // Manejo mejorado de errores del backend
        let errorMessage = 'Error al registrar el paciente';
        let specificErrors = {};

        if (result.error) {
          // Si hay errores de campo específicos
          if (typeof result.error === 'object' && !Array.isArray(result.error)) {
            Object.keys(result.error).forEach(field => {
              if (Array.isArray(result.error[field])) {
                specificErrors[field] = result.error[field][0];
              } else {
                specificErrors[field] = result.error[field];
              }
            });
            
            // Si hay errores específicos de campos, mostrarlos
            if (Object.keys(specificErrors).length > 0) {
              setFieldErrors(specificErrors);
              errorMessage = 'Hay errores en algunos campos del formulario';
            }
          } else if (typeof result.error === 'string') {
            errorMessage = result.error;
          }
        }

        mostrarError(errorMessage, {
          titulo: 'Error en el registro'
        });
      }
    } catch (error) {
      mostrarError('Error inesperado. Intente nuevamente.', {
        titulo: 'Error del sistema'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalContactStep
            formData={formData}
            onChange={handleChange}
            onDropdownChange={handleDropdownChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <HealthInfoStep
            formData={formData}
            onChange={handleChange}
            onDropdownChange={handleDropdownChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <EmergencyContactStep
            formData={formData}
            onChange={handleChange}
            onDropdownChange={handleDropdownChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <SymptomsStep
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormContainer
      title={`Registro de Paciente - ${STEP_NAMES[currentStep - 1]}`}
      showBackButton={true}
      onBack={handleBack}
      backButtonProps={{
        disabled: loading,
        children: <ArrowLeftIcon className="h-5 w-5" />
      }}
    >
      {/* Indicador de Pasos */}
      <StepIndicator 
        steps={STEP_NAMES} 
        currentStep={currentStep} 
        completedSteps={completedSteps}
      />

      {/* Barra de Progreso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paso {currentStep} de {TOTAL_STEPS}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(getProgress())}% completado
          </span>
        </div>
        <ProgressBar progress={getProgress()} showShimmer={true} />
      </div>

      {/* Contenido del Paso Actual */}
      <div className="w-full mb-6">
        {renderCurrentStep()}
      </div>

      {/* Navegación entre Pasos */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isLoading={loading}
        nextButtonText="Siguiente"
        submitButtonText="Iniciar Evaluación"
        previousButtonText="Anterior"
        showPrevious={true}
      />
    </FormContainer>
  );
};

export default PatientBasicData;
