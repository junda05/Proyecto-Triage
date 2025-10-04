import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import WelcomeScreen from '../pages/welcome/WelcomeScreen';
import PatientBasicData from '../pages/patients/PatientBasicData';
import TriagePage from '../pages/triage/TriagePage';
import StaffDashboard from '../pages/staff/StaffDashboard';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ReportsPage from '../pages/reports/ReportsPage';
import NotFoundPage from '../pages/error/NotFoundPage';
import LoginForm from '../components/ui/LoginForm';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import TriageProtectedRoute from './TriageProtectedRoute';

// Componente wrapper para manejar la navegación en LoginForm
const StaffLoginRoute = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <LoginForm 
      isExpanding={false}
      onBackClick={handleBackClick}
    />
  );
};

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome-screen" replace />} />
        <Route path="/welcome-screen" element={<WelcomeScreen />} />
        <Route path="/patients/register" element={<PatientBasicData />} />
        <Route 
          path="/patients/triage" 
          element={
            <TriageProtectedRoute>
              <TriagePage />
            </TriageProtectedRoute>
          } 
        />
        <Route path="/staff/login" element={<StaffLoginRoute />} /> 
        <Route 
          path="/staff/dashboard" 
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/reportes" 
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/admin/users" 
          element={
            <AdminProtectedRoute>
              <UserManagementPage />
            </AdminProtectedRoute>
          } 
        />
        {/* Página de error 404 para rutas no encontradas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
