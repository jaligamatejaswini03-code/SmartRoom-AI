import React from 'react';
import {
  Palette,
  Armchair,
  Sun,
  Flame,
  Maximize2,
  IndianRupee,
  Lightbulb,
  Layers,
  Sparkles,
  Check,
  TrendingDown,
  Box,
} from 'lucide-react';
import { DesignResult } from '../types';

interface DesignDetailsProps {
  design: DesignResult;
  onOpenBudgetOptimizer: () => void;
  onOpenChat: () => void;
}

export const DesignDetails: React.FC<DesignDetailsProps> = ({
  design,
  onOpenBudgetOptimizer,
  onOpenChat,
}) => {
  return (
    <div className="space-y-12">
      {/* Section 2: Design Summary */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
              Design Summary
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            {design.dimensions} · {design.style} Concept
          </span>
        </div>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-stone-300">
          {design.design_summary}
        </p>
      </section>

      {/* Section 3: Color Palette */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Palette className="h-4 w-4 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
            Color Palette
          </h3>
        </div>
        <p className="mt-2 text-xs text-stone-400">
          Curated harmonic swatches respecting the 60-30-10 interior color rule.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {design.color_palette?.map((color, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 p-4 transition-all hover:border-stone-700"
            >
              <div
                className="h-20 w-full rounded-xl shadow-inner border border-stone-800/80 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }}
              />
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-stone-100">
                    {color.name}
                  </span>
                  <span className="font-mono text-[11px] text-stone-400">
                    {color.hex}
                  </span>
                </div>
                <div className="mt-1 text-[11px] font-medium text-amber-400">
                  {color.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Furniture Recommendations & Placement */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <Armchair className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
              Furniture Recommendations
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            {design.furniture_recommendations?.length || 0} Recommended Items
          </span>
        </div>

        {/* Space Planning & Clearance Rule */}
        {design.furniture_placement && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-stone-300">
            <strong className="text-amber-300 font-semibold block mb-1">
              Architectural Placement & Flow:
            </strong>
            {design.furniture_placement}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {design.furniture_recommendations?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-950 p-5 transition-colors hover:border-stone-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    {item.name}
                  </h4>
                  <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-amber-400 border border-stone-700">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  <strong className="text-stone-300 font-medium">Purpose: </strong>
                  {item.purpose}
                </p>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  <strong className="text-stone-300 font-medium">Suggested Placement: </strong>
                  {item.placement}
                </p>
              </div>

              {item.dimensions && (
                <div className="mt-4 pt-3 border-t border-stone-900 text-[11px] text-stone-400">
                  Scale: {item.dimensions}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Lighting Plan */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Sun className="h-4 w-4 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
            Lighting Plan
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Ambient Luminescence
            </span>
            <p className="mt-2 text-xs text-stone-300 leading-relaxed">
              {design.lighting_recommendations?.ambient || 'Diffuse architectural downlights'}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Task Illumination
            </span>
            <p className="mt-2 text-xs text-stone-300 leading-relaxed">
              {design.lighting_recommendations?.task || 'Focused glare-free reading/work fixtures'}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Accent & Cove Warmth
            </span>
            <p className="mt-2 text-xs text-stone-300 leading-relaxed">
              {design.lighting_recommendations?.accent || 'Indirect 2700K low-level LED linear strips'}
            </p>
          </div>
        </div>

        {design.lighting_recommendations?.color_temperature && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-950 px-4 py-3 text-xs border border-stone-800">
            <span className="text-stone-400">Recommended Kelvin Temperature:</span>
            <span className="font-semibold text-amber-300">
              {design.lighting_recommendations.color_temperature}
            </span>
          </div>
        )}
      </section>

      {/* Section 6: Decoration Ideas */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Flame className="h-4 w-4 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
            Decoration Ideas
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {design.decoration_ideas?.map((dec, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5 transition-colors hover:border-stone-700"
            >
              <h4 className="font-serif text-base font-bold text-stone-100">
                {dec.item}
              </h4>
              <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                {dec.description}
              </p>
              <div className="mt-3 rounded-lg bg-stone-900 p-2.5 text-[11px] text-amber-300 border border-stone-800">
                <strong>Styling rule: </strong>{dec.styling_note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Space Utilization */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Maximize2 className="h-4 w-4 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
            Space Utilization
          </h3>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-300">
          {design.space_utilization}
        </p>

        {/* Visual Space Ratio Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-stone-400 mb-2">
            <span>Furniture Footprint (38%)</span>
            <span>Circulation Clearances (44%)</span>
            <span>Open Breathing Space (18%)</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-950 p-0.5 border border-stone-800">
            <div className="h-full bg-amber-600 rounded-l-full" style={{ width: '38%' }} />
            <div className="h-full bg-sky-600" style={{ width: '44%' }} />
            <div className="h-full bg-stone-600 rounded-r-full" style={{ width: '18%' }} />
          </div>
        </div>
      </section>

      {/* Section 8: Budget Breakdown */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
              Estimated Budget Breakdown
            </h3>
          </div>
          <button
            onClick={onOpenBudgetOptimizer}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-stone-950 transition-all hover:bg-emerald-500 shadow-md shadow-emerald-950/40"
          >
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Optimize My Budget</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
            <span className="text-xs text-stone-400">Furniture</span>
            <div className="mt-2 text-base font-bold text-stone-100">
              {design.budget_breakdown?.furniture || '₹70,000'}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
            <span className="text-xs text-stone-400">Lighting</span>
            <div className="mt-2 text-base font-bold text-stone-100">
              {design.budget_breakdown?.lighting || '₹15,000'}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
            <span className="text-xs text-stone-400">Decorations</span>
            <div className="mt-2 text-base font-bold text-stone-100">
              {design.budget_breakdown?.decorations || '₹10,000'}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
            <span className="text-xs text-stone-400">Storage</span>
            <div className="mt-2 text-base font-bold text-stone-100">
              {design.budget_breakdown?.storage || '₹20,000'}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 col-span-2 sm:col-span-1">
            <span className="text-xs text-stone-400">Other / Buffer</span>
            <div className="mt-2 text-base font-bold text-stone-100">
              {design.budget_breakdown?.other || '₹15,000'}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Total Estimated Cost
            </span>
            <p className="text-[11px] text-stone-400">
              Comprehensive material, fixture, and assembly projection
            </p>
          </div>
          <div className="text-2xl font-bold font-serif text-amber-300">
            {design.budget_breakdown?.total || '₹1,30,000'}
          </div>
        </div>
      </section>

      {/* Section 9: AI Design Tips */}
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
            AI Design Tips & Styling Secrets
          </h3>
        </div>

        <div className="mt-6 space-y-3">
          {design.design_tips?.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 text-xs text-stone-300 leading-relaxed"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold">
                {idx + 1}
              </div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 10: Materials Suggestions */}
      {design.materials_suggestions && design.materials_suggestions.length > 0 && (
        <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
            <Box className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">
              Materials Suggestions
            </h3>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {design.materials_suggestions.map((mat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-800 bg-stone-950 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-stone-100">
                    {mat.material}
                  </span>
                  <span className="text-[11px] font-medium text-amber-400">
                    {mat.finish}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-400">
                  <strong className="text-stone-300 font-medium">Application: </strong>
                  {mat.application}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
