import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import WebhookTester from './components/WebhookTester';
import './styles/themes.css';

function AppContent() {
  const { theme } = useTheme();

  const themeGradients = {
    light: 'bg-gradient-to-br from-slate-50 to-slate-100',
    dark: 'bg-gradient-to-br from-slate-900 to-slate-800',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
  };

  const themeTextColors = {
    light: 'text-slate-800',
    dark: 'text-slate-50',
    blue: 'text-blue-900',
    green: 'text-emerald-900',
  };

  return (
    <div className={`min-h-screen ${themeGradients[theme]} transition-colors duration-300`}>
      <ThemeSelector />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${themeTextColors[theme]} mb-2 transition-colors duration-300`}>
            Webhook Testing Suite
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-400' : theme === 'blue' ? 'text-blue-700' : theme === 'green' ? 'text-emerald-700' : 'text-slate-600'
          }`}>
            Test, debug, and chat with your webhooks
          </p>
        </div>
        <WebhookTester />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;