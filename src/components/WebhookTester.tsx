import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProfileManager from './ProfileManager';
import RequestForm from './RequestForm';
import ResponseDisplay from './ResponseDisplay';
import RequestHistory from './RequestHistory';
import ChatInterface from './ChatInterface';
import { WebhookRequest, WebhookResponse, HistoryItem, WebhookProfile } from '../types/webhook';

const WebhookTester: React.FC = () => {
  const [response, setResponse] = useState<WebhookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'profiles' | 'tester' | 'chat'>('profiles');
  const [profiles, setProfiles] = useLocalStorage<WebhookProfile[]>('webhook-profiles', []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('active-profile-id', null);
  
  // Derive active profile from stored ID
  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const handleCreateProfile = (profileData: Omit<WebhookProfile, 'id' | 'createdAt'>) => {
    const newProfile: WebhookProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    // Auto-switch to tester tab after creating profile
    setActiveTab('tester');
  };

  const handleUpdateProfile = (id: string, updates: Partial<WebhookProfile>) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === id ? { ...profile, ...updates } : profile
    ));
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(profile => profile.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  };

  const handleSelectProfile = (profile: WebhookProfile) => {
    setActiveProfileId(profile.id);
  };

  const handleSendRequest = async (request: WebhookRequest) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = {};
      request.headers.forEach(header => {
        if (header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      // Add Content-Type if not specified and there's a body
      if (request.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
      };

      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        fetchOptions.body = request.body;
      }

      const response = await fetch(request.url, fetchOptions);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody = '';
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          const json = await response.json();
          responseBody = JSON.stringify(json, null, 2);
        } catch {
          responseBody = await response.text();
        }
      } else {
        responseBody = await response.text();
      }

      const webhookResponse: WebhookResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        duration,
        timestamp: new Date().toISOString(),
      };

      setResponse(webhookResponse);

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        request,
        response: webhookResponse,
        timestamp: new Date().toISOString(),
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10

    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: error instanceof Error ? error.message : 'Unknown error occurred',
        duration,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResponse(item.response);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profiles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Webhook Profiles
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tester'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Webhook Tester
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Webhook Chat
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profiles' ? (
        <ProfileManager
          profiles={profiles}
          activeProfile={activeProfile}
          onCreateProfile={handleCreateProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
          onSelectProfile={handleSelectProfile}
        />
      ) : activeTab === 'tester' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeProfile && (
            <div className="lg:col-span-2 mb-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeProfile.color }}
                  />
                  <span className="font-medium text-slate-800">{activeProfile.name}</span>
                  <span className="text-sm text-slate-500">({activeProfile.method})</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Connected to Chat
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="lg:col-span-2 space-y-6">
            <RequestForm 
              onSendRequest={handleSendRequest} 
              loading={loading}
              initialData={activeProfile ? {
                url: activeProfile.url,
                method: activeProfile.method,
                headers: activeProfile.headers,
              } : undefined}
            />
            <ResponseDisplay response={response} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <RequestHistory 
              history={history} 
              onSelect={handleHistorySelect}
            />
          </div>
        </div>
      ) : (
        <ChatInterface 
          activeProfile={activeProfile}
          onProfileRequired={() => setActiveTab('profiles')}
        />
      )}
    </div>
  );
};

export default WebhookTester;