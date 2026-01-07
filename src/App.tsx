import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import WebhookTester from './components/WebhookTester';
import './styles/themes.css';

function AppContent() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <ThemeSelector />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 transition-colors duration-300">
            Webhook Testing Suite
          </h1>
          <p className="text-lg transition-colors duration-300">
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