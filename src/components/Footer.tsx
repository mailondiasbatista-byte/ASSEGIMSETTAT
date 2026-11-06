import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            AcademiaConnect
          </span>
          <span className="text-xs text-slate-400">
            · Sistema de Controlo e Integração de Estudantes
          </span>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Plataforma Universitária. Novatos & Anciãos.
        </div>

      </div>
    </footer>
  );
};
