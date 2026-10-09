import React from 'react';
import { DesignConcept } from '../types';
import { Layers, CheckCircle } from 'lucide-react';

interface DesignConceptsProps {
  concepts: DesignConcept[];
  selectedConceptId: string;
  onSelectConcept: (concept: DesignConcept) => void;
}

export const DesignConcepts: React.FC<DesignConceptsProps> = ({
  concepts,
  selectedConceptId,
  onSelectConcept,
}) => {
  if (!concepts || concepts.length === 0) return null;

  return (
    <section className="mt-12 rounded-3xl border border-stone-800 bg-stone-900/40 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
              Multiple Design Concepts
            </h3>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            3 distinct architectural interpretations synthesized from your identical spatial requirements.
          </p>
        </div>
        <span className="text-xs text-amber-400/90 font-medium self-start sm:self-auto">
          Click any concept to preview & switch
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {concepts.map((concept, index) => {
          const isSelected = selectedConceptId === concept.id || (index === 0 && !selectedConceptId);
          return (
            <div
              key={concept.id || index}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-amber-500 bg-stone-900 ring-2 ring-amber-500/30 shadow-xl shadow-amber-950/20'
                  : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-800/80'
              }`}
            >
              {/* Concept Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950">
                <img
                  src={concept.image_url}
                  alt={concept.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="rounded-lg bg-stone-950/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md border border-stone-700/60">
                    Option {index + 1}: {concept.style}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-stone-950">
                    <CheckCircle className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xs font-semibold text-stone-200">
                    {concept.highlight}
                  </div>
                </div>
              </div>

              {/* Concept Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-stone-100">
                      {concept.name}
                    </h4>
                    <span className="text-xs font-medium text-amber-400">
                      {concept.estimated_budget}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800/80">
                  <button
                    onClick={() => onSelectConcept(concept)}
                    className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-900/20'
                        : 'border border-stone-700 bg-stone-800 text-stone-200 hover:border-amber-500 hover:bg-stone-700 hover:text-stone-100'
                    }`}
                  >
                    {isSelected ? 'Currently Selected' : 'Select Design'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
