import React, { useState, useEffect } from 'react';
import { RequirementsForm } from '../components/RequirementsForm';
import { RoomRequirements } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface RequirementsPageProps {
  onSubmit: (requirements: RoomRequirements) => void;
  isLoading: boolean;
  initialValues?: Partial<RoomRequirements>;
}

export const RequirementsPage: React.FC<RequirementsPageProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [loadingStep, setLoadingStep] = useState(0);

  const STEPS = [
    'Parsing spatial geometry & computing circulation clearances...',
    'Formulating 60-30-10 color palette & acoustic texture layers...',
    'Structuring custom furniture placements & lighting kelvin plan...',
    'Rendering photorealistic 16:9 interior room visualization...',
    'Optimizing budget breakdown and multi-concept variations...',
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-900/30">
            <Sparkles className="h-10 w-10 text-stone-950 animate-pulse" />
          </div>

          <h2 className="mt-6 font-serif text-2xl font-bold text-stone-100 sm:text-3xl">
            Synthesizing Your Dream Space
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-400">
            Our Generative AI is engineering your custom architectural plan and generating a realistic
            visualization from scratch.
          </p>

          {/* Progress Timeline */}
          <div className="mt-8 space-y-3 rounded-2xl border border-stone-800 bg-stone-900/80 p-5 text-left">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < loadingStep;
              const isCurrent = idx === loadingStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                    isCurrent
                      ? 'text-amber-300 font-semibold opacity-100'
                      : isCompleted
                      ? 'text-stone-400 opacity-80'
                      : 'text-stone-400 opacity-40'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-stone-700 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <RequirementsForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          initialValues={initialValues}
        />
      )}
    </div>
  );
};
