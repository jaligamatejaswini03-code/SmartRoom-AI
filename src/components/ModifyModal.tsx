import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, X, Check } from 'lucide-react';

interface ModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitModification: (prompt: string, quickTags: string[]) => void;
  isLoading: boolean;
  currentRoomType: string;
}

export const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  onClose,
  onSubmitModification,
  isLoading,
  currentRoomType,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const QUICK_OPTIONS = [
    'Change Color',
    'Change Furniture',
    'Add Storage',
    'Remove Furniture',
    'Change Lighting',
    'Make It More Minimalist',
    'Make It More Luxurious',
    'Make It More Affordable',
    'Add Plants',
    'Add More Decoration',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && selectedTags.length === 0) return;
    onSubmitModification(prompt.trim(), selectedTags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Modify Design
              </h3>
              <p className="text-xs text-stone-400">
                Tweak and iterate on your {currentRoomType} design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Options Chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400">
              Quick Presets & Tweaks
            </label>
            <p className="mt-0.5 text-xs text-stone-400">
              Select one or multiple rapid adjustment triggers:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_OPTIONS.map((opt) => {
                const isSelected = selectedTags.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleTag(opt)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/40'
                        : 'border-stone-800 bg-stone-800/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-amber-400" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Modification Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400">
              Tell AI what you want to change…
            </label>
            <p className="mt-0.5 text-xs text-stone-400">
              Be as specific as you like (materials, colors, items, mood):
            </p>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Change the wall color to light sage green, add a study table next to the window, and make the seating more plush and affordable."
              className="mt-2.5 w-full rounded-2xl border border-stone-700 bg-stone-950/70 p-4 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-stone-700 px-4 py-2.5 text-xs font-medium text-stone-300 hover:bg-stone-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || (!prompt.trim() && selectedTags.length === 0)}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-stone-950 shadow-md shadow-amber-900/30 transition-all hover:bg-amber-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-950 border-t-transparent" />
                  <span>Regenerating Visualization...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Apply & Regenerate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
