import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
