import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Globe, Settings } from 'lucide-react';
import { WebhookProfile, Header } from '../types/webhook';

interface ProfileManagerProps {
  profiles: WebhookProfile[];
  activeProfile: WebhookProfile | null;
  onCreateProfile: (profile: Omit<WebhookProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile: (id: string, profile: Partial<WebhookProfile>) => void;
  onDeleteProfile: (id: string) => void;
  onSelectProfile: (profile: WebhookProfile) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onSelectProfile,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'POST',
    headers: [{ key: 'Content-Type', value: 'application/json' }] as Header[],
    description: '',
    color: '#3B82F6',
  });

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      method: 'POST',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      description: '',
      color: '#3B82F6',
    });
  };

  const handleCreateProfile = () => {
    if (!formData.name.trim() || !formData.url.trim()) return;
    
    onCreateProfile(formData);
    resetForm();
    setShowCreateForm(false);
  };

  const handleEditProfile = (profile: WebhookProfile) => {
    setFormData({
      name: profile.name,
      url: profile.url,
      method: profile.method,
      headers: profile.headers,
      description: profile.description || '',
      color: profile.color,
    });
    setEditingProfile(profile.id);
  };

  const handleUpdateProfile = () => {
    if (!editingProfile || !formData.name.trim() || !formData.url.trim()) return;
    
    onUpdateProfile(editingProfile, formData);
    resetForm();
    setEditingProfile(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowCreateForm(false);
    setEditingProfile(null);
  };

  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }]
    }));
  };

  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="text-slate-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Webhook Profiles</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            New Profile
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Create/Edit Form */}
        {(showCreateForm || editingProfile) && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              {editingProfile ? 'Edit Profile' : 'Create New Profile'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My API Webhook"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.example.com/webhook"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this webhook"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color Theme
                </label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color 
                          ? 'border-slate-400 scale-110' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Add Header
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.headers.map((header, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Header Name"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Header Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="w-full h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={editingProfile ? handleUpdateProfile : handleCreateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Save size={14} />
                  {editingProfile ? 'Update' : 'Create'} Profile
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profiles List */}
        <div className="space-y-3">
          {profiles.length === 0 ? (
            <div className="text-center py-8">
              <Globe size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No webhook profiles yet</p>
              <p className="text-slate-400 text-sm">Create your first profile to get started</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  activeProfile?.id === profile.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                onClick={() => onSelectProfile(profile)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: profile.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800 truncate">
                          {profile.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {profile.method}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate mb-1">
                        {profile.url}
                      </p>
                      {profile.description && (
                        <p className="text-xs text-slate-500 truncate">
                          {profile.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProfile(profile);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProfile(profile.id);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;