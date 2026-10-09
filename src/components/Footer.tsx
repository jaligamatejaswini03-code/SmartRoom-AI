import React from 'react';
import { Sparkles, Layers, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-800 bg-stone-950/70 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-stone-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold text-stone-100">
                SmartRoom <span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-stone-400 leading-relaxed">
              A Generative AI-based personalized interior design and realistic room visualization system. 
              Designed without requiring uploaded room photographs, synthesizing complete architectural plans, 
              color harmonies, furniture allocations, and realistic rendering from pure spatial parameters.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Architecture & Stack
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-amber-500" />
                <span>Generative AI Planning & Vision</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-500" />
                <span>FastAPI Backend & React Frontend</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>SQLite Persistent Schemas</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Key Capabilities
            </h4>
            <ul className="mt-3 space-y-1.5 text-xs text-stone-400">
              <li>• Zero-photo synthesis</li>
              <li>• Multi-concept generation (3 styles)</li>
              <li>• Context-aware AI design chat</li>
              <li>• Budget value-engineering</li>
              <li>• Local SQLite design history</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-800/80 pt-6 text-center text-xs text-stone-400">
          <p>© {new Date().getFullYear()} SmartRoom AI · Academic BTech CSE Generative AI Engineering Project</p>
        </div>
      </div>
    </footer>
  );
};
