import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import WelcomeScreen from '../components/Common/WelcomeScreen';
import PatientBasicData from '../pages/PatientBasicData';
import StaffDashboard from '../pages/StaffDashboard';

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/patient/basic-data" element={<PatientBasicData />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          {/* Ruta por defecto que redirige al inicio */}
          <Route path="*" element={<WelcomeScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
