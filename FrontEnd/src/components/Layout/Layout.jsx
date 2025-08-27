import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationContainer from '../Common/NotificationContainer';
import useAuth from '../../hooks/useAuth';

const Layout = ({ children }) => {
  const { notificaciones, eliminarNotificacion } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          {children}
        </main>
        
        <Footer />
        
        {/* Contenedor de notificaciones */}
        <NotificationContainer 
          notificaciones={notificaciones}
          onClose={eliminarNotificacion}
        />
      </div>
    </div>
  );
};

export default Layout;
