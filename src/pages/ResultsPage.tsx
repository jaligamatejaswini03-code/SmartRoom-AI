import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  MessageSquare,
  TrendingDown,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { DesignResult, DesignConcept, BudgetOptimizationResult } from '../types';
import { VisualizationViewer } from '../components/VisualizationViewer';
import { DesignConcepts } from '../components/DesignConcepts';
import { DesignDetails } from '../components/DesignDetails';
import { ModifyModal } from '../components/ModifyModal';
import { BudgetOptimizerModal } from '../components/BudgetOptimizerModal';
import { optimizeBudget } from '../services/api';

interface ResultsPageProps {
  design: DesignResult;
  onModifySubmit: (prompt: string, quickTags: string[]) => void;
  onRegenerate: () => void;
  onBackToForm: () => void;
  onOpenChat: () => void;
  isModifying: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  design,
  onModifySubmit,
  onRegenerate,
  onBackToForm,
  onOpenChat,
  isModifying,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<DesignConcept | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [optimizationData, setOptimizationData] = useState<BudgetOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Active visualization URL: concept image if selected, otherwise primary design image
  const activeImageUrl = selectedConcept ? selectedConcept.image_url : design.image_url;
  const activeStyle = selectedConcept ? selectedConcept.style : design.style;

  const handleOpenBudgetOptimizer = async () => {
    setIsBudgetModalOpen(true);
    if (!optimizationData && design.original_requirements) {
      setIsOptimizing(true);
      try {
        const res = await optimizeBudget(
          design.original_requirements,
          design.budget_breakdown?.total || '145000'
        );
        setOptimizationData(res);
      } catch (err) {
        console.warn('Failed to fetch budget optimization:', err);
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleApplyBudgetOptimization = () => {
    setIsBudgetModalOpen(false);
    onModifySubmit('Optimize my budget: substitute materials and modular furniture for cost savings.', [
      'Make It More Affordable',
    ]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToForm}
            className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Edit Requirements</span>
          </button>

          <span className="text-xs text-stone-400">·</span>

          <span className="text-xs font-medium text-stone-300">
            {design.room_type} · {design.dimensions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenBudgetOptimizer}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
          >
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Optimize Budget</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-stone-700 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Main Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Generative AI Spatial Blueprint</span>
        </div>
        <h1 className="mt-2.5 font-serif text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl">
          Your Personalized Room Design
        </h1>
        <p className="mt-1.5 text-sm text-stone-400">
          A bespoke architectural design plan and photorealistic visual synthesis created strictly from
          your specifications.
        </p>
      </div>

      {/* SECTION 1: AI Generated Room Visualization (Prominent) */}
      <section className="mb-12">
        <VisualizationViewer
          imageUrl={activeImageUrl}
          roomType={design.room_type}
          style={activeStyle}
          dimensions={design.dimensions}
          budget={design.budget}
          onModify={() => setIsModifyModalOpen(true)}
          onRegenerate={onRegenerate}
          imagePrompt={design.image_prompt_used}
        />
      </section>

      {/* SECTION 7: Multiple Design Options (Concepts) */}
      {design.concepts && design.concepts.length > 0 && (
        <section className="mb-12">
          <DesignConcepts
            concepts={design.concepts}
            selectedConceptId={selectedConcept ? selectedConcept.id : design.concepts[0]?.id}
            onSelectConcept={(concept) => setSelectedConcept(concept)}
          />
        </section>
      )}

      {/* SECTIONS 2 to 10: Complete Architectural Plan Details */}
      <DesignDetails
        design={design}
        onOpenBudgetOptimizer={handleOpenBudgetOptimizer}
        onOpenChat={onOpenChat}
      />

      {/* Modals */}
      <ModifyModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        onSubmitModification={(prompt, tags) => {
          setIsModifyModalOpen(false);
          onModifySubmit(prompt, tags);
        }}
        isLoading={isModifying}
        currentRoomType={design.room_type}
      />

      <BudgetOptimizerModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        optimizationData={optimizationData}
        isLoading={isOptimizing}
        onApplyOptimization={handleApplyBudgetOptimization}
      />
    </div>
  );
};
