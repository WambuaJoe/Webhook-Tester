import React, { useState, useRef, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: 'light', label: 'Light', color: 'bg-slate-50', ring: 'ring-slate-300' },
    { value: 'dark', label: 'Dark', color: 'bg-slate-900', ring: 'ring-slate-600' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-600', ring: 'ring-blue-400' },
    { value: 'green', label: 'Green', color: 'bg-emerald-600', ring: 'ring-emerald-400' },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl transition-all shadow-lg border ${
          isOpen
            ? 'bg-white border-slate-300 shadow-xl'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
        title="Change theme"
      >
        <Palette size={20} className="text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-max">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Select Theme</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>
          <div className="space-y-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  theme === t.value
                    ? `${t.color} ${t.ring} ring-2 text-white font-medium`
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${t.color}`} />
                <span className="text-sm">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
