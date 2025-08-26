import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import PageContainer from '../ui/PageContainer';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '../icons/Icons';

const LoginForm = ({ isExpanding, onBackClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Activar la animación de entrada después de montar el componente
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría la lógica real de autenticación
      console.log('Datos de login:', formData);
      
      // Redirigir al dashboard del staff
      navigate('/staff/dashboard');
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Inténtelo nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md transition-all duration-700 ease-out ${
      isLoaded 
        ? 'opacity-100 transform translate-y-0 scale-100' 
        : 'opacity-0 transform translate-y-8 scale-95'
    } ${isExpanding ? 'opacity-0 scale-95' : ''}`}>
    <PageContainer variant="form">
    {/* Header centrado con flecha y título */}
    <div className="flex flex-col items-center mb-8">
        {/* Contenedor de flecha y título */}
        <div className="flex items-center gap-3 mb-4">
        <button
            type="button"
            onClick={onBackClick}
            className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Volver a la selección de roles"
        >
            <ArrowLeftIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-primary dark:text-blue-400 whitespace-nowrap">
            Acceso del personal médico
        </h2>
        </div>
    
    {/* Descripción centrada */}
    <p className="text-gray-600 dark:text-gray-300 text-center">
      Ingrese sus credenciales para acceder al sistema
    </p>
  </div>

        {/* Mostrar error general si existe */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de usuario */}
          <FormInput
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            label="Nombre de usuario o email"
            placeholder="Ingrese su usuario o email"
            error={errors.username}
            disabled={isLoading}
            required
          />

          {/* Campo de contraseña */}
          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            error={errors.password}
            disabled={isLoading}
            required
            className="pr-12"
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </FormInput>

          {/* Opción "Recordarme" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Recordarme
              </label>
            </div>
            
            <button
              type="button"
              className="text-sm text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              disabled={isLoading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <Button
              type="submit"
              size="sm"
              className="w-full py-3 text-[17px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>¿Necesita acceso? Contacte al administrador del sistema</p>
        </div>
      </PageContainer>
    </div>
  );
};

export default LoginForm;
