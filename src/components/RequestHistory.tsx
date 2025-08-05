import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { HistoryItem } from '../types/webhook';

interface RequestHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ history, onSelect }) => {
  const getStatusColor = (status: number) => {
    if (status === 0) return 'text-red-600';
    if (status >= 200 && status < 300) return 'text-emerald-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Request History</h2>
      </div>
      
      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No requests yet</p>
            <p className="text-slate-400 text-sm">Your request history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {item.request.method}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(item.response.status)}`}>
                        {item.response.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 truncate" title={item.request.url}>
                      {truncateUrl(item.request.url)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistory;