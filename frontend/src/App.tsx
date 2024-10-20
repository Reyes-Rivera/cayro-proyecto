import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/Router';
import { ThemeProvider } from './components/web-components/ThemeProvider';
const App: React.FC = () => {
  return (
    <ThemeProvider  attribute="class" defaultTheme="system" enableSystem={true}>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
