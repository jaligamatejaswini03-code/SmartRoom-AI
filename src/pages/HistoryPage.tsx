import React, { useState, useEffect } from 'react';
import {
  History,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Trash2,
  Calendar,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { DesignResult } from '../types';
import { fetchDesigns, deleteDesign } from '../services/api';

interface HistoryPageProps {
  onSelectDesign: (design: DesignResult) => void;
  onModifyDesign: (design: DesignResult) => void;
  onGenerateAgain: (design: DesignResult) => void;
  onStartNewDesign: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectDesign,
  onModifyDesign,
  onGenerateAgain,
  onStartNewDesign,
}) => {
  const [designs, setDesigns] = useState<DesignResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDesigns();
      setDesigns(data);
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this saved room design from database?')) {
      try {
        await deleteDesign(id);
        setDesigns(designs.filter((d) => d.id !== id));
      } catch (err) {
        console.warn('Delete failed:', err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-100">
              My Designs
            </h1>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Previously synthesized interior blueprints stored in SQLite persistent database.
          </p>
        </div>

        <button
          onClick={onStartNewDesign}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-amber-500 shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Room Design</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="mt-4 text-xs text-stone-400">Loading saved blueprints from SQLite database...</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-stone-800 bg-stone-900/40 py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-800 text-stone-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-stone-200">
            No Saved Designs Yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs text-stone-400">
            Synthesize your first dream space without uploading any photos. All completed design plans
            will automatically be cataloged here.
          </p>
          <div className="mt-6">
            <button
              onClick={onStartNewDesign}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-stone-950 hover:bg-amber-500 shadow-md"
            >
              Start Designing Now
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => {
            const dateStr = design.created_at
              ? new Date(design.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={design.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 transition-all hover:border-stone-700 hover:bg-stone-900 hover:shadow-xl"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950">
                  <img
                    src={design.image_url}
                    alt={`${design.style} ${design.room_type}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-stone-950/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md border border-stone-700/60">
                      {design.room_type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleDelete(e, design.id)}
                      title="Delete design"
                      className="rounded-lg bg-stone-950/80 p-1.5 text-stone-400 backdrop-blur-md hover:bg-red-950 hover:text-red-300 transition-colors border border-stone-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-200">{design.style}</span>
                    <span className="font-medium text-amber-400">{design.budget}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Calendar className="h-3 w-3" />
                      <span>{dateStr}</span>
                      <span>·</span>
                      <span>{design.dimensions}</span>
                    </div>

                    <p className="mt-2.5 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {design.design_summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-stone-800/80 pt-4">
                    <button
                      onClick={() => onSelectDesign(design)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-stone-800 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700 hover:text-stone-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => onModifyDesign(design)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-amber-600/15 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-600/25 transition-colors border border-amber-500/20"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Modify</span>
                    </button>

                    <button
                      onClick={() => onGenerateAgain(design)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-stone-700 py-2 text-xs font-medium text-stone-300 hover:bg-stone-800 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Again</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
