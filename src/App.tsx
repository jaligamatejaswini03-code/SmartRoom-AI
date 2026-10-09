import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RequirementsPage } from './pages/RequirementsPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ChatPage } from './pages/ChatPage';
import { RoomRequirements, DesignResult } from './types';
import { generateDesign, modifyDesign } from './services/api';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'requirements' | 'results' | 'history' | 'chat'>('home');
  const [currentDesign, setCurrentDesign] = useState<DesignResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [requirementsPrefill, setRequirementsPrefill] = useState<Partial<RoomRequirements> | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (req: RoomRequirements) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await generateDesign(req);
      setCurrentDesign(result);
      setCurrentPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Unable to generate the design right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifySubmit = async (prompt: string, quickTags: string[]) => {
    if (!currentDesign) return;
    setIsModifying(true);
    setErrorMessage(null);
    try {
      const origReq = currentDesign.original_requirements || {
        room_type: currentDesign.room_type,
        length: currentDesign.dimensions.split('×')[0]?.replace(/[^0-9.]/g, '') || '14',
        width: currentDesign.dimensions.split('×')[1]?.replace(/[^0-9.]/g, '') || '12',
        style: currentDesign.style,
        colors: currentDesign.color_palette.map((c) => c.name),
        budget: currentDesign.budget,
        furniture: currentDesign.furniture_recommendations.map((f) => f.name),
        lighting: 'Warm',
        decorations: currentDesign.decoration_ideas.map((d) => d.item),
        additional_requirements: '',
      };

      const updated = await modifyDesign(origReq, prompt, quickTags);
      setCurrentDesign(updated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Modify error:', err);
      setErrorMessage(err.message || 'Unable to modify the design right now. Please try again.');
    } finally {
      setIsModifying(false);
    }
  };

  const handleSelectHistoryDesign = (design: DesignResult) => {
    setCurrentDesign(design);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModifyHistoryDesign = (design: DesignResult) => {
    setCurrentDesign(design);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateAgainFromHistory = (design: DesignResult) => {
    const orig = design.original_requirements || {
      room_type: design.room_type,
      length: '14',
      width: '12',
      style: design.style,
      colors: design.color_palette?.map((c) => c.name) || [],
      budget: design.budget,
      furniture: design.furniture_recommendations?.map((f) => f.name) || [],
      lighting: 'Warm',
      decorations: design.decoration_ideas?.map((d) => d.item) || [],
      additional_requirements: '',
    };
    setRequirementsPrefill(orig);
    setCurrentPage('requirements');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-900 text-stone-100 font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => {
          setErrorMessage(null);
          setCurrentPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasCurrentDesign={currentDesign !== null}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mx-auto mt-4 max-w-4xl px-4 w-full">
          <div className="flex items-center justify-between rounded-2xl border border-red-500/50 bg-red-950/60 p-4 text-xs sm:text-sm text-red-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="rounded-lg p-1 text-red-400 hover:bg-red-900/40 hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Page View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onStartDesigning={() => {
              setCurrentPage('requirements');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreFeatures={() => {
              const el = document.getElementById('features');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setCurrentPage('requirements');
              }
            }}
          />
        )}

        {currentPage === 'requirements' && (
          <RequirementsPage
            onSubmit={handleGenerate}
            isLoading={isLoading}
            initialValues={requirementsPrefill}
          />
        )}

        {currentPage === 'results' && currentDesign && (
          <ResultsPage
            design={currentDesign}
            onModifySubmit={handleModifySubmit}
            onRegenerate={() => {
              setCurrentPage('requirements');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToForm={() => {
              if (currentDesign.original_requirements) {
                setRequirementsPrefill(currentDesign.original_requirements);
              }
              setCurrentPage('requirements');
            }}
            onOpenChat={() => {
              setCurrentPage('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isModifying={isModifying}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            onSelectDesign={handleSelectHistoryDesign}
            onModifyDesign={handleModifyHistoryDesign}
            onGenerateAgain={handleGenerateAgainFromHistory}
            onStartNewDesign={() => {
              setRequirementsPrefill(undefined);
              setCurrentPage('requirements');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'chat' && (
          <ChatPage currentDesign={currentDesign} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
