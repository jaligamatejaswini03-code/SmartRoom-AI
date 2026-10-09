import React from 'react';
import { Sparkles, Compass, History, MessageSquare, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentPage: 'home' | 'requirements' | 'results' | 'history' | 'chat';
  onNavigate: (page: 'home' | 'requirements' | 'results' | 'history' | 'chat') => void;
  hasCurrentDesign: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  hasCurrentDesign,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-3 text-left transition-opacity hover:opacity-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-100 shadow-lg shadow-amber-900/20 ring-1 ring-amber-500/30">
            <Sparkles className="h-5 w-5 text-amber-200 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-100">
                SmartRoom <span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-stone-400">
              Generative Interior Architecture
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              currentPage === 'home'
                ? 'bg-stone-800 text-amber-300'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('requirements')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              currentPage === 'requirements'
                ? 'bg-amber-600 text-stone-100'
                : 'bg-stone-800/80 text-stone-200 hover:bg-stone-700 hover:text-stone-50'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Design Room</span>
          </button>

          {hasCurrentDesign && (
            <button
              onClick={() => onNavigate('results')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                currentPage === 'results'
                  ? 'bg-stone-800 text-amber-300'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
              }`}
            >
              Current Plan
            </button>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              currentPage === 'history'
                ? 'bg-stone-800 text-amber-300'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>My Designs</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              currentPage === 'chat'
                ? 'bg-stone-800 text-amber-300'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
