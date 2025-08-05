import React, { useState } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';
import { WebhookRequest, Header } from '../types/webhook';

interface RequestFormProps {
  onSendRequest: (request: WebhookRequest) => void;
  loading: boolean;
  initialData?: {
    url: string;
    method: string;
    headers: Header[];
  };
}

const RequestForm: React.FC<RequestFormProps> = ({ onSendRequest, loading, initialData }) => {
  const [url, setUrl] = useState(initialData?.url || '');
  const [method, setMethod] = useState<string>(initialData?.method || 'POST');
  const [headers, setHeaders] = useState<Header[]>(
    initialData?.headers.length ? initialData.headers : [{ key: '', value: '' }]
  );
  const [body, setBody] = useState('{\n  "message": "Hello, webhook!"\n}');

  // Update form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setUrl(initialData.url);
      setMethod(initialData.method);
      setHeaders(initialData.headers.length ? initialData.headers : [{ key: '', value: '' }]);
    }
  }, [initialData]);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const request: WebhookRequest = {
      url: url.trim(),
      method,
      headers: headers.filter(h => h.key.trim() !== ''),
      body: body.trim() || undefined,
    };

    onSendRequest(request);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Request Configuration</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* URL and Method */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {methods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/webhook"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Headers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700">
              Headers
            </label>
            <button
              type="button"
              onClick={addHeader}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Header
            </button>
          </div>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Header Name"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="w-full h-10 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Body */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Request Body (JSON)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
              placeholder="Enter JSON payload..."
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;