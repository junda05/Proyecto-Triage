import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './routes/AppRouter';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
