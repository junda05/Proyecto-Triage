import React from 'react';
// Importar iconos de lucide-react para notificaciones y otros componentes
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Database,
  LogOut,
  BarChart3,
  Edit,
  Users,
  Settings,
  Home,
  User,
  Trash2,
  Clock,
  Calendar,
  CalendarDays,
  Timer,
  Shield,
  UserCheck,
  ClipboardList,
  // Iconos para la escala Likert
  Smile,
  Meh,
  Frown,
  Heart,
  AlertCircle,
  Zap,
  Flame,
  Skull,
  Activity,
  TrendingUp,
  ChartNoAxesColumn,
  StretchVertical
} from 'lucide-react';

// Icono CheckCircle específico para éxito
export const CheckCircleIcon = ({ className = "h-6 w-6" }) => <CheckCircle className={className} />;
export const XCircleIcon = ({ className = "h-6 w-6" }) => <XCircle className={className} />;

// Icono de editar para acciones
export const EditIcon = ({ className = "h-5 w-5" }) => <Edit className={className} />;

// Icono de eliminar para acciones
export const TrashIcon = ({ className = "h-5 w-5" }) => <Trash2 className={className} />;

// Icono de usuarios para administración
export const UsersIcon = ({ className = "h-5 w-5" }) => <Users className={className} />;

// Icono de configuración
export const SettingsIcon = ({ className = "h-5 w-5" }) => <Settings className={className} />;

// Icono de home/dashboard
export const HomeIcon = ({ className = "h-5 w-5" }) => <Home className={className} />;

// Icono de agregar/plus
export const PlusIcon = ({ className = "h-5 w-5" }) => <Plus className={className} />;

// Icono de perfil de usuario
export const ProfileIcon = ({ className = "h-5 w-5" }) => <User className={className} />;

// Iconos de Lucide para exportación directa
export const UsersLucide = Users;
export const UserLucide = User;
export const AlertTriangleLucide = AlertTriangle;
export const CalendarLucide = Calendar;
export const ClockLucide = Clock;
export const TimerLucide = Timer;
export const ShieldLucide = Shield;
export const UserCheckLucide = UserCheck;
export const TrendingUpLucide = TrendingUp;
export const AlertCircleLucide = AlertCircle;
export const ActivityLucide = Activity;
export const ChartNoAxesColumnLucide = ChartNoAxesColumn;
export const StretchVerticalLucide = StretchVertical;
export const CalendarDaysLucide = CalendarDays;
export const ClipboardListLucide = ClipboardList;
export const DatabaseLucide = Database;
export const LogOutLucide = LogOut;
export const BarChart3Lucide = BarChart3;
export const ChevronDownLucide = ChevronDown;

// Iconos para Reports con exportación explícita
export const ClockIcon = ({ className = "h-5 w-5" }) => <Clock className={className} />;
export const CalendarIcon = ({ className = "h-5 w-5" }) => <Calendar className={className} />;
export const CalendarDaysIcon = ({ className = "h-5 w-5" }) => <CalendarDays className={className} />;
export const ClipboardListIcon = ({ className = "h-5 w-5" }) => <ClipboardList className={className} />;
export const AlertTriangleIcon = ({ className = "h-5 w-5" }) => <AlertTriangle className={className} />;
export const TimerIcon = ({ className = "h-5 w-5" }) => <Timer className={className} />;
export const UserCheckIcon = ({ className = "h-5 w-5" }) => <UserCheck className={className} />;
export const TrendingUpIcon = ({ className = "h-5 w-5" }) => <TrendingUp className={className} />;
export const AlertCircleIcon = ({ className = "h-5 w-5" }) => <AlertCircle className={className} />;

// Icono de usuario para pacientes
export const UserIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    />
  </svg>
);

// Icono de escudo para personal médico
export const ShieldIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
    />
  </svg>
);

// Icono de check para confirmación
export const CheckIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

// Icono de sol
export const SunIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
);

// Icono de luna
export const MoonIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
    />
  </svg>
);

// Icono de ojo (mostrar contraseña) - Lucide React
export const EyeIcon = ({ className = "h-6 w-6" }) => (
  <Eye className={className} />
);

// Icono de ojo tachado (ocultar contraseña) - Lucide React
export const EyeSlashIcon = ({ className = "h-6 w-6" }) => (
  <EyeOff className={className} />
);

// Icono de flecha izquierda - Lucide React
export const ArrowLeftIcon = ({ className = "h-6 w-6" }) => (
  <ArrowLeft className={className} />
);

// === ICONOS PARA NOTIFICACIONES (Lucide React) ===

// Icono de éxito (CheckCircle de Lucide)
export const IconoExito = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <CheckCircle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de error (XCircle de Lucide)
export const IconoError = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <XCircle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de advertencia (AlertTriangle de Lucide)
export const IconoAdvertencia = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <AlertTriangle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de información (Info de Lucide)
export const IconoInfo = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Info 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Iconos de navegación
export const ChevronLeftIcon = ({ className = "h-6 w-6" }) => <ChevronLeft className={className} />;
export const ChevronRightIcon = ({ className = "h-6 w-6" }) => <ChevronRight className={className} />;

// === ICONOS PARA TRIAGE CONTAINERS ===

// Icono de documento/sesión
export const SessionDocumentIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <FileText 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de copiar
export const CopyIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Copy 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de check (confirmación)
export const CheckMarkIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Check 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de recuperar/refrescar
export const RecoveryIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Database 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de nueva sesión
export const NewSessionIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Plus 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de carga/loading
export const LoadingIcon = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <RefreshCw 
      size={sizes[tamaño]} 
      className={`${className} animate-spin`}
    />
  );
};

// Iconos para la escala Likert de gravedad (1-10)
export const getSeverityIcon = (value, size = 20) => {
  const iconProps = { size, className: "transition-all duration-200" };
  
  switch (value) {
    case 1:
      return <Smile {...iconProps} className={`${iconProps.className} text-green-500`} />;
    case 2:
      return <Heart {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 3:
      return <Activity {...iconProps} className={`${iconProps.className} text-green-300`} />;
    case 4:
      return <Meh {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    case 5:
      return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    case 6:
      return <TrendingUp {...iconProps} className={`${iconProps.className} text-orange-400`} />;
    case 7:
      return <AlertTriangle {...iconProps} className={`${iconProps.className} text-orange-500`} />;
    case 8:
      return <Zap {...iconProps} className={`${iconProps.className} text-red-400`} />;
    case 9:
      return <Flame {...iconProps} className={`${iconProps.className} text-red-500`} />;
    case 10:
      return <Skull {...iconProps} className={`${iconProps.className} text-red-600`} />;
    default:
      return <Frown {...iconProps} />;
  }
};

// Función para obtener el color de fondo basado en el valor
export const getSeverityColor = (value) => {
  switch (value) {
    case 1:
      return 'bg-green-100 border-green-300 text-green-700';
    case 2:
      return 'bg-green-100 border-green-400 text-green-700';
    case 3:
      return 'bg-green-50 border-green-300 text-green-600';
    case 4:
      return 'bg-yellow-50 border-yellow-300 text-yellow-700';
    case 5:
      return 'bg-yellow-100 border-yellow-400 text-yellow-700';
    case 6:
      return 'bg-orange-50 border-orange-300 text-orange-700';
    case 7:
      return 'bg-orange-100 border-orange-400 text-orange-700';
    case 8:
      return 'bg-red-50 border-red-300 text-red-700';
    case 9:
      return 'bg-red-100 border-red-400 text-red-700';
    case 10:
      return 'bg-red-200 border-red-500 text-red-800';
    default:
      return 'bg-gray-50 border-gray-300 text-gray-600';
  }
};

// Función para obtener el color seleccionado
export const getSeveritySelectedColor = (value) => {
  switch (value) {
    case 1:
    case 2:
    case 3:
      return 'bg-green-500 border-green-600 text-white shadow-lg scale-110';
    case 4:
    case 5:
      return 'bg-yellow-500 border-yellow-600 text-white shadow-lg scale-110';
    case 6:
    case 7:
      return 'bg-orange-500 border-orange-600 text-white shadow-lg scale-110';
    case 8:
    case 9:
    case 10:
      return 'bg-red-500 border-red-600 text-white shadow-lg scale-110';
    default:
      return 'bg-gray-500 border-gray-600 text-white shadow-lg scale-110';
  }
};
