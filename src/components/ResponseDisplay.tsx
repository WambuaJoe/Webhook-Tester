import React, { useState } from 'react';
import { Copy, Check, Clock, Server } from 'lucide-react';
import { WebhookResponse } from '../types/webhook';

interface ResponseDisplayProps {
  response: WebhookResponse | null;
  loading: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, loading }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'text-red-600 bg-red-50';
    if (status >= 200 && status < 300) return 'text-emerald-600 bg-emerald-50';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Response</h2>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600">Sending request...</p>
            </div>
          </div>
        ) : response ? (
          <div className="space-y-6">
            {/* Status and Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Server size={20} className="text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(response.status)}`}>
                    {response.status} {response.statusText}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="text-sm font-medium text-slate-800">{response.duration}ms</p>
                </div>
              </div>
            </div>

            {/* Response Headers */}
            {Object.keys(response.headers).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Response Headers</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response.headers, null, 2), 'headers')}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                  >
                    {copiedField === 'headers' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedField === 'headers' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            )}

            {/* Response Body */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700">Response Body</h3>
                <button
                  onClick={() => copyToClipboard(response.body, 'body')}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                >
                  {copiedField === 'body' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedField === 'body' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                  {response.body || 'No response body'}
                </pre>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
              Response received at {new Date(response.timestamp).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Server size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No response yet</p>
            <p className="text-slate-400 text-sm">Send a request to see the response here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;