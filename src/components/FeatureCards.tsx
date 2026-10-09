import React from 'react';
import {
  Palette,
  Eye,
  Calculator,
  Armchair,
  MessageSquareCode,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FeatureCardsProps {
  onStartDesigning: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onStartDesigning }) => {
  const features = [
    {
      title: 'AI Interior Design',
      icon: Palette,
      tag: 'Generative Synthesis',
      description:
        'Translates your room dimensions, preferred design style, and functional priorities into an architecturally balanced interior plan with materials and spatial guidelines.',
      color: 'from-amber-500/20 to-amber-900/10',
      border: 'hover:border-amber-500/50',
    },
    {
      title: 'Personalized Room Visualization',
      icon: Eye,
      tag: 'Zero Photo Required',
      description:
        'Generates a completely new, photorealistic interior visualization tailored strictly to your requested dimensions, color tones, lighting mood, and furniture choices.',
      color: 'from-stone-700/30 to-stone-900/40',
      border: 'hover:border-stone-500/50',
    },
    {
      title: 'Smart Budget Planning',
      icon: Calculator,
      tag: 'Value Engineering',
      description:
        'Breaks down costs across furniture, lighting, storage, and accessories with an automated budget optimization engine that suggests lower-cost materials and smarter allocations.',
      color: 'from-emerald-500/15 to-emerald-950/20',
      border: 'hover:border-emerald-500/50',
    },
    {
      title: 'Furniture Recommendations',
      icon: Armchair,
      tag: 'Space Planning',
      description:
        'Recommends exact furniture items tailored to your room scale, itemizing purpose, 36-inch walking aisle clearances, and estimated realistic pricing.',
      color: 'from-sky-500/15 to-sky-950/20',
      border: 'hover:border-sky-500/50',
    },
    {
      title: 'AI Design Assistant',
      icon: MessageSquareCode,
      tag: 'Conversational Guidance',
      description:
        'Context-aware design consultant that answers specific questions about your generated room, advising on wall paint accents, lighting fixtures, and storage ideas.',
      color: 'from-purple-500/15 to-purple-950/20',
      border: 'hover:border-purple-500/50',
    },
    {
      title: 'Multiple Design Options',
      icon: Layers,
      tag: '3 Diverse Concepts',
      description:
        'Simultaneously synthesizes 3 distinct design concepts from the exact same requirements (e.g. Modern Minimalist, Warm Contemporary, Luxury Modern) for easy comparison.',
      color: 'from-amber-600/15 to-stone-900/40',
      border: 'hover:border-amber-400/50',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Intelligent Space Synthesis
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl">
            Everything You Need to Design Your Dream Space
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-400 sm:text-base">
            SmartRoom AI replaces trial-and-error room design with algorithmic spatial reasoning,
            photorealistic visual renders, and realistic budgeting.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-gradient-to-b ${feature.color} p-7 transition-all duration-300 ${feature.border} hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-800/90 text-amber-400 ring-1 ring-stone-700/80">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-medium tracking-wide text-stone-400">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-bold text-stone-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-stone-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/60">
                  <button
                    onClick={onStartDesigning}
                    className="flex items-center gap-1.5 text-xs font-medium text-amber-400 group-hover:text-amber-300 transition-colors"
                  >
                    <span>Try with this feature</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
