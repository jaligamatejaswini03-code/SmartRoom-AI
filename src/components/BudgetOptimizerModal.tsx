import React, { useState } from 'react';
import {
  Calculator,
  TrendingDown,
  Sparkles,
  X,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { BudgetOptimizationResult } from '../types';

interface BudgetOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimizationData: BudgetOptimizationResult | null;
  isLoading: boolean;
  onApplyOptimization: () => void;
}

export const BudgetOptimizerModal: React.FC<BudgetOptimizerModalProps> = ({
  isOpen,
  onClose,
  optimizationData,
  isLoading,
  onApplyOptimization,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5 sticky top-0 bg-stone-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Optimize My Budget
              </h3>
              <p className="text-xs text-stone-400">
                Value-engineering suggestions without sacrificing visual elegance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="mt-4 text-xs font-medium text-stone-300">
                Running value-engineering matrix across materials & fixtures...
              </p>
            </div>
          )}

          {!isLoading && optimizationData && (
            <>
              {/* Top Savings Card */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
                <div>
                  <span className="text-[11px] font-medium text-stone-400">Current Cost</span>
                  <div className="mt-1 text-lg font-bold text-stone-300 line-through">
                    {optimizationData.original_budget}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-emerald-400">Optimized Budget</span>
                  <div className="mt-1 text-xl font-bold text-emerald-300">
                    {optimizationData.optimized_budget}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-amber-400">Projected Savings</span>
                  <div className="mt-1 flex items-center gap-1.5 text-lg font-bold text-amber-300">
                    <TrendingDown className="h-4 w-4" />
                    <span>{optimizationData.total_savings} ({optimizationData.savings_percentage})</span>
                  </div>
                </div>
              </div>

              {/* Categorized Recommendations */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Value-Engineering Substitutions
                </h4>
                <div className="mt-3 space-y-3">
                  {optimizationData.suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4 transition-colors hover:border-stone-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-200">
                          {sug.title}
                        </span>
                        <span className="rounded-md bg-emerald-900/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-700/40">
                          Save {sug.saving}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                        {sug.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimized Breakdown Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Optimized Category Breakdown
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 text-center text-xs">
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
                    <span className="text-[10px] text-stone-400">Furniture</span>
                    <div className="mt-1 font-semibold text-stone-200">
                      {optimizationData.optimized_breakdown.furniture}
                    </div>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
                    <span className="text-[10px] text-stone-400">Lighting</span>
                    <div className="mt-1 font-semibold text-stone-200">
                      {optimizationData.optimized_breakdown.lighting}
                    </div>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
                    <span className="text-[10px] text-stone-400">Decorations</span>
                    <div className="mt-1 font-semibold text-stone-200">
                      {optimizationData.optimized_breakdown.decorations}
                    </div>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
                    <span className="text-[10px] text-stone-400">Storage</span>
                    <div className="mt-1 font-semibold text-stone-200">
                      {optimizationData.optimized_breakdown.storage}
                    </div>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-stone-400">Other / Buffer</span>
                    <div className="mt-1 font-semibold text-stone-200">
                      {optimizationData.optimized_breakdown.other}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-700 px-4 py-2.5 text-xs font-medium text-stone-300 hover:bg-stone-800"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onApplyOptimization}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-stone-950 shadow-md shadow-emerald-950/40 hover:bg-emerald-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>Apply & Regenerate Design</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
