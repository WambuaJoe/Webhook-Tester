import React from 'react';
import WebhookTester from './components/WebhookTester';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Webhook Testing Suite
          </h1>
          <p className="text-slate-600 text-lg">
            Test, debug, and chat with your webhooks
          </p>
        </div>
        <WebhookTester />
      </div>
    </div>
  );
}

export default App;