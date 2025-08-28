import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import PageContainer from '../ui/PageContainer';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '../icons/Icons';
import useAuth from '../../hooks/useAuth';
import useFormulario from '../../hooks/useFormulario';
import { validadoresLogin } from '../../services/utils/validadores';

const LoginForm = ({ isExpanding, onBackClick }) => {
  // Hooks de autenticación y formulario
  const { iniciarSesion, cargando, mostrarAdvertencia } = useAuth();
  const { valores, errores, onChange, esValido } = useFormulario(
    { username: '', password: '' },
    validadoresLogin
  );

  // Estados locales para UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Activar la animación de entrada después de montar el componente
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.state, mostrarAdvertencia, navigate, location.pathname]);

  // Limpiar error general cuando el usuario empiece a escribir
  useEffect(() => {
    if (errorGeneral && (valores.username || valores.password)) {
      setErrorGeneral('');
    }
  }, [valores.username, valores.password, errorGeneral]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!esValido()) {
      return;
    }
    
    setErrorGeneral('');
    
    try {
      const resultado = await iniciarSesion(valores.username, valores.password);
      
      if (resultado.ok) {
        // La notificación de éxito y navegación se manejan en el AuthContext
        // Añadir un pequeño delay para que se vea la notificación
        setTimeout(() => {
          navigate('/staff/dashboard');
        }, 1000);
      } else {
        // El error ya se muestra como notificación, pero también mostramos uno local
        setErrorGeneral('Credenciales incorrectas. Verifique su usuario y contraseña.');
      }
    } catch (error) {
      // Fallback por si algo sale mal
      setErrorGeneral('Error de conexión. Intente nuevamente.');
      console.error('Error en login:', error);
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
        <div className="flex items-start sm:items-center gap-2 sm:gap-2 mb-4">
        <button
            type="button"
            onClick={onBackClick}
            className="p-0.5 sm:p-1.5 text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Volver a la selección de roles"
        >
            <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold text-primary dark:text-blue-400 text-center leading-tight">
            Acceso del personal médico
        </h2>
        </div>
    
    {/* Descripción centrada */}
    <p className="text-base sm:text-base text-gray-600 dark:text-gray-300 text-center">
      Ingrese sus credenciales para acceder al sistema
    </p>
  </div>

        {/* Mostrar error general si existe */}
        {errorGeneral && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{errorGeneral}</p>
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de usuario */}
          <FormInput
            id="username"
            name="username"
            type="text"
            value={valores.username}
            onChange={onChange}
            label="Nombre de usuario"
            placeholder="Ingrese su usuario"
            error={errores.username}
            disabled={cargando}
            required
          />

          {/* Campo de contraseña */}
          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={valores.password}
            onChange={onChange}
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            error={errores.password}
            disabled={cargando}
            required
            className="pr-12"
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              disabled={cargando}
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
                disabled={cargando}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Recordarme
              </label>
            </div>
            
            <button
              type="button"
              className="text-sm text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              disabled={cargando}
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
              disabled={cargando}
            >
              {cargando ? (
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
