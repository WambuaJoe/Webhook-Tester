import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', color: 'bg-slate-50' },
    { value: 'dark', label: 'Dark', color: 'bg-slate-800' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
    { value: 'green', label: 'Green', color: 'bg-emerald-600' },
  ] as const;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-2">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Palette size={16} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Theme</span>
        </div>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`w-8 h-8 rounded-lg ${t.color} border-2 transition-all ${
                theme === t.value
                  ? 'border-slate-400 scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={t.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
