import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, MessageCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { ChatMessage, WebhookProfile } from '../types/webhook';

interface ChatInterfaceProps {
  activeProfile: WebhookProfile | null;
  onProfileRequired: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeProfile, onProfileRequired }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-configure chat when active profile changes
  useEffect(() => {
    if (activeProfile) {
      setWebhookUrl(activeProfile.url);
      
      // Convert profile headers to chat headers format
      const profileHeaders: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      activeProfile.headers.forEach(header => {
        if (header.key && header.value) {
          profileHeaders[header.key] = header.value;
        }
      });
      setHeaders(profileHeaders);
    }
  }, [activeProfile]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !webhookUrl.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    const startTime = Date.now();

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: inputMessage.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      let responseContent = '';
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          const json = await response.json();
          // Try to extract message from common response formats
          responseContent = json.message || json.response || json.text || json.content || JSON.stringify(json, null, 2);
        } catch {
          responseContent = await response.text();
        }
      } else {
        responseContent = await response.text();
      }

      const webhookMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: response.ok ? 'webhook' : 'error',
        content: responseContent || `HTTP ${response.status}: ${response.statusText}`,
        timestamp: new Date().toISOString(),
        status: response.status,
        duration,
      };

      setMessages(prev => [...prev, webhookMessage]);

    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: error instanceof Error ? error.message : 'Failed to send message',
        timestamp: new Date().toISOString(),
        duration,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Status */}
      {activeProfile ? (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: activeProfile.color }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-800">
                  Connected to {activeProfile.name}
                </h3>
                <p className="text-sm text-emerald-600">
                  {activeProfile.method} • {activeProfile.url}
                </p>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings 
                    ? 'bg-emerald-200 text-emerald-700' 
                    : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={20} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800">
                  No Webhook Profile Selected
                </h3>
                <p className="text-sm text-orange-600">
                  Create or select a webhook profile to start chatting
                </p>
              </div>
              <button
                onClick={onProfileRequired}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Manage Profiles
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Settings Panel */}
      {showSettings && activeProfile && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Chat Configuration</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.example.com/chat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Custom Headers (JSON)
              </label>
              <textarea
                value={JSON.stringify(headers, null, 2)}
                onChange={(e) => {
                  try {
                    setHeaders(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Webhook Chat</h2>
            {activeProfile && (
              <span className="text-sm text-slate-500 truncate max-w-xs">
                {activeProfile.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Start a conversation</p>
              <p className="text-slate-400 text-sm">
                {activeProfile ? 'Send a message to begin chatting' : 'Select a webhook profile first'}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    <Clock size={12} />
                    <span>{formatTime(message.timestamp)}</span>
                    {message.duration && (
                      <>
                        <Zap size={12} />
                        <span>{message.duration}ms</span>
                      </>
                    )}
                    {message.status && (
                      <span className={`px-1 py-0.5 rounded text-xs ${
                        message.status >= 200 && message.status < 300
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {message.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
                  <span>Webhook is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4">
          {!activeProfile ? (
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-sm">Please select a webhook profile to start chatting</span>
              <button
                onClick={onProfileRequired}
                className="ml-auto px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
              >
                Select Profile
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;