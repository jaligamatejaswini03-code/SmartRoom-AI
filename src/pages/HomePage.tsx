import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { FeatureCards } from '../components/FeatureCards';

interface HomePageProps {
  onStartDesigning: () => void;
  onExploreFeatures: () => void;
  onSelectSampleStyle?: (style: string, roomType: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartDesigning,
  onExploreFeatures,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:px-8">
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-amber-600/10 blur-[130px]" />

        <div className="mx-auto max-w-4xl text-center">
          {/* Top Pill / Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Zero-Photo Generative AI Interior Architecture</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-stone-100 sm:text-6xl sm:leading-[1.15]">
            SmartRoom <span className="text-amber-400">AI</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 font-serif text-xl sm:text-2xl text-stone-300 font-medium">
            Design your dream space with Generative AI
          </p>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 sm:text-base">
            Enter your room requirements and let AI create a personalized interior design and realistic
            room visualization.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <button
              onClick={onStartDesigning}
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-7 py-4 text-sm font-bold text-stone-950 shadow-xl shadow-amber-900/30 transition-all hover:scale-[1.02] hover:shadow-amber-500/25 sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-stone-950" />
              <span>Start Designing</span>
              <ArrowRight className="h-4 w-4 text-stone-950 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-700 bg-stone-800/80 px-6 py-4 text-sm font-semibold text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-700 sm:w-auto"
            >
              <span>Explore Features</span>
            </button>
          </div>

          {/* Highlight metrics banner */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-stone-800/80 pt-8 sm:grid-cols-4 text-left">
            <div className="border-l border-stone-800 pl-4">
              <span className="text-xs text-stone-400 block">Synthesis Type</span>
              <strong className="text-sm font-bold text-stone-200 mt-0.5 block">Zero-Photo Required</strong>
            </div>
            <div className="border-l border-stone-800 pl-4">
              <span className="text-xs text-stone-400 block">AI Visual Output</span>
              <strong className="text-sm font-bold text-stone-200 mt-0.5 block">Photorealistic 16:9</strong>
            </div>
            <div className="border-l border-stone-800 pl-4">
              <span className="text-xs text-stone-400 block">Variations</span>
              <strong className="text-sm font-bold text-stone-200 mt-0.5 block">3 Distinct Concepts</strong>
            </div>
            <div className="border-l border-stone-800 pl-4">
              <span className="text-xs text-stone-400 block">Intelligence</span>
              <strong className="text-sm font-bold text-stone-200 mt-0.5 block">Value-Engineered Budget</strong>
            </div>
          </div>
        </div>

        {/* Visual Hero Showcase */}
        <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl">
          <div className="relative aspect-[16/9] w-full">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
              alt="SmartRoom AI Visual Concept"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-md rounded-2xl bg-stone-950/85 p-4 backdrop-blur-md border border-stone-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Concept Preview · Modern Minimalist
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-stone-100">
                  Open-Concept 16' × 14' Living & Lounge Architecture
                </h3>
                <p className="mt-1 text-xs text-stone-400">
                  Synthesized with warm alabaster planes, 36" circulation aisle, and concealed warm LED illumination.
                </p>
              </div>

              <button
                onClick={onStartDesigning}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-xs font-bold text-stone-950 shadow-lg shadow-amber-900/30 hover:bg-amber-500 transition-colors"
              >
                <span>Design Yours</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards onStartDesigning={onStartDesigning} />
    </div>
  );
};
