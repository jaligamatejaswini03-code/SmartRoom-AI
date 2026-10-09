import React, { useState } from 'react';
import {
  Download,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
  Check,
  Share2,
} from 'lucide-react';

interface VisualizationViewerProps {
  imageUrl: string;
  roomType: string;
  style: string;
  dimensions: string;
  budget: string;
  onModify: () => void;
  onRegenerate: () => void;
  imagePrompt?: string;
}

export const VisualizationViewer: React.FC<VisualizationViewerProps> = ({
  imageUrl,
  roomType,
  style,
  dimensions,
  budget,
  onModify,
  onRegenerate,
  imagePrompt,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `SmartRoom_${roomType}_${style}_Design.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl">
      {/* Visual Canvas Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
        <img
          src={imageUrl}
          alt={`AI Generated ${style} ${roomType}`}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Ambient Gradient Shadows */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />

        {/* Floating Top Controls */}
        <div className="absolute left-4 top-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-stone-900/80 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md border border-stone-700/60">
              {style} · {roomType}
            </span>
            <span className="hidden sm:inline-flex rounded-lg bg-stone-900/80 px-2.5 py-1 text-xs font-medium text-stone-300 backdrop-blur-md border border-stone-700/60">
              {dimensions}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              title="Toggle Architectural Overlays"
              className={`rounded-lg p-2 text-xs font-medium backdrop-blur-md transition-colors border ${
                showOverlay
                  ? 'bg-amber-600/90 text-stone-100 border-amber-500'
                  : 'bg-stone-900/80 text-stone-300 border-stone-700/60 hover:bg-stone-800'
              }`}
            >
              <Layers className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              className="rounded-lg border border-stone-700/60 bg-stone-900/80 p-2 text-stone-300 backdrop-blur-md hover:bg-stone-800 hover:text-stone-100 transition-colors"
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>

            {imagePrompt && (
              <button
                onClick={() => setShowPromptModal(true)}
                title="View AI Image Synthesis Prompt"
                className="rounded-lg border border-stone-700/60 bg-stone-900/80 p-2 text-stone-300 backdrop-blur-md hover:bg-stone-800 hover:text-stone-100 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Floating Architectural Overlay Hotspots */}
        {showOverlay && (
          <div className="pointer-events-none absolute inset-0">
            {/* Focal Point Indicator */}
            <div className="absolute left-[38%] top-[42%] -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1.5 rounded-full bg-stone-950/75 px-3 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md ring-1 ring-amber-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Primary Architectural Focal Point</span>
              </div>
            </div>

            {/* Clearance Indicator */}
            <div className="absolute left-[20%] bottom-[24%]">
              <div className="rounded-lg bg-stone-950/70 px-2.5 py-1 text-[10px] text-stone-300 backdrop-blur-md border border-stone-700/50">
                36" Continuous Transit Corridor
              </div>
            </div>

            {/* Natural Light Sensor Indicator */}
            <div className="absolute right-[12%] top-[30%]">
              <div className="rounded-lg bg-stone-950/70 px-2.5 py-1 text-[10px] text-amber-200 backdrop-blur-md border border-amber-600/40">
                Natural Daylight Optimization
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar Info */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <span className="rounded-md bg-stone-900/85 px-2.5 py-1 font-medium backdrop-blur-md border border-stone-700/60">
              Allocated Budget: {budget}
            </span>
            <span className="hidden md:inline rounded-md bg-stone-900/85 px-2.5 py-1 font-medium backdrop-blur-md border border-stone-700/60 text-stone-400">
              Photorealistic 16:9 Interior Visualization
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-stone-700/70 bg-stone-900/90 px-3 py-1.5 text-xs font-medium text-stone-200 backdrop-blur-md hover:bg-stone-800 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-stone-700/70 bg-stone-900/90 px-3.5 py-1.5 text-xs font-semibold text-stone-100 backdrop-blur-md hover:bg-amber-600 hover:border-amber-500 transition-colors shadow-lg"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Visual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar below Image */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 bg-stone-900/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onModify}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-stone-950 transition-all hover:bg-amber-500 shadow-md shadow-amber-900/20 active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Modify Design</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 transition-colors hover:border-amber-500 hover:bg-stone-700 hover:text-stone-100"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Generate Another Design</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-400">
          Synthesized from spatial requirements · No room upload needed
        </div>
      </div>

      {/* AI Image Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Automated AI Vision Prompt
              </h3>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-stone-400 hover:text-stone-100 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              The system automatically constructed this specialized architectural prompt from your
              specifications without requiring any uploaded reference photo:
            </p>
            <pre className="mt-3 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-stone-800 bg-stone-950 p-4 text-xs font-mono text-stone-300">
              {imagePrompt}
            </pre>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowPromptModal(false)}
                className="rounded-xl bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-100 hover:bg-stone-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
