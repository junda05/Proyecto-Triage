import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import WelcomeScreen from '../pages/WelcomeScreen';
import PatientBasicData from '../pages/PatientBasicData';
import StaffDashboard from '../pages/StaffDashboard';
import LoginForm from '../components/Auth/LoginForm';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/patient/basic-data" element={<PatientBasicData />} />
          <Route path="/staff/login" element={<StaffLoginRoute />} />
          <Route 
            path="/staff/dashboard" 
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Ruta por defecto que redirige al inicio */}
          <Route path="*" element={<WelcomeScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
