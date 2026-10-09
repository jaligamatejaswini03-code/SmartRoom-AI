import React, { useState } from 'react';
import {
  Sparkles,
  Maximize2,
  Palette,
  IndianRupee,
  Armchair,
  Sun,
  Flame,
  Check,
  Plus,
  X,
  Compass,
} from 'lucide-react';
import { RoomRequirements } from '../types';

interface RequirementsFormProps {
  onSubmit: (requirements: RoomRequirements) => void;
  isLoading: boolean;
  initialValues?: Partial<RoomRequirements>;
}

export const RequirementsForm: React.FC<RequirementsFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [roomType, setRoomType] = useState<string>(initialValues?.room_type || 'Living Room');
  const [customRoomType, setCustomRoomType] = useState<string>('');
  const [length, setLength] = useState<string>(initialValues?.length || '14');
  const [width, setWidth] = useState<string>(initialValues?.width || '12');
  const [height, setHeight] = useState<string>(initialValues?.height || '10');
  const [style, setStyle] = useState<string>(initialValues?.style || 'Modern');

  // Curated color chips
  const CURATED_COLORS = [
    { name: 'Warm Beige', hex: '#E8D8C8' },
    { name: 'Charcoal Slate', hex: '#2C302E' },
    { name: 'Brushed Brass', hex: '#C5A059' },
    { name: 'Sage Green', hex: '#879883' },
    { name: 'Terracotta', hex: '#C86D51' },
    { name: 'Ivory White', hex: '#F9F8F3' },
    { name: 'Navy Blue', hex: '#1E293B' },
    { name: 'Natural Oak', hex: '#C4A482' },
  ];

  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialValues?.colors && initialValues.colors.length
      ? initialValues.colors
      : ['Warm Beige', 'Charcoal Slate', 'Brushed Brass']
  );
  const [customColorInput, setCustomColorInput] = useState<string>('');

  // Budget
  const BUDGET_OPTIONS = [
    'Below ₹50,000',
    '₹50,000–₹1,00,000',
    '₹1,00,000–₹2,00,000',
    '₹2,00,000+',
    'Custom Budget',
  ];
  const [budget, setBudget] = useState<string>(initialValues?.budget || '₹1,00,000–₹2,00,000');
  const [customBudget, setCustomBudget] = useState<string>(initialValues?.custom_budget || '');

  // Furniture options
  const FURNITURE_OPTIONS = [
    'Bed',
    'Sofa',
    'Wardrobe',
    'Study Table',
    'Dining Table',
    'TV Unit',
    'Bookshelf',
    'Coffee Table',
    'Storage',
    'Other',
  ];
  const [furniture, setFurniture] = useState<string[]>(
    initialValues?.furniture && initialValues.furniture.length
      ? initialValues.furniture
      : ['Sofa', 'Coffee Table', 'TV Unit', 'Storage']
  );
  const [customFurnitureInput, setCustomFurnitureInput] = useState<string>('');

  // Lighting
  const LIGHTING_OPTIONS = ['Warm', 'Cool', 'Natural', 'Mixed', 'Decorative'];
  const [lighting, setLighting] = useState<string>(initialValues?.lighting || 'Warm');

  // Decoration preferences
  const DECORATION_OPTIONS = [
    'Indoor plants',
    'Wall art',
    'Curtains',
    'Rugs',
    'Mirrors',
    'Decorative lights',
    'Shelves',
  ];
  const [decorations, setDecorations] = useState<string[]>(
    initialValues?.decorations && initialValues.decorations.length
      ? initialValues.decorations
      : ['Indoor plants', 'Wall art', 'Curtains', 'Rugs']
  );

  // Additional requirements
  const [additionalRequirements, setAdditionalRequirements] = useState<string>(
    initialValues?.additional_requirements ||
      'I want maximum storage, clean walking aisles, and enough space for relaxing and studying.'
  );

  const [errorMsg, setErrorMsg] = useState<string>('');

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const addCustomColor = () => {
    const trimmed = customColorInput.trim();
    if (trimmed && !selectedColors.includes(trimmed)) {
      setSelectedColors([...selectedColors, trimmed]);
      setCustomColorInput('');
    }
  };

  const removeColor = (colorName: string) => {
    setSelectedColors(selectedColors.filter((c) => c !== colorName));
  };

  const toggleFurniture = (item: string) => {
    if (furniture.includes(item)) {
      setFurniture(furniture.filter((f) => f !== item));
    } else {
      setFurniture([...furniture, item]);
    }
  };

  const addCustomFurniture = () => {
    const trimmed = customFurnitureInput.trim();
    if (trimmed && !furniture.includes(trimmed)) {
      setFurniture([...furniture, trimmed]);
      setCustomFurnitureInput('');
    }
  };

  const toggleDecoration = (item: string) => {
    if (decorations.includes(item)) {
      setDecorations(decorations.filter((d) => d !== item));
    } else {
      setDecorations([...decorations, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const effectiveRoomType = roomType === 'Other' && customRoomType.trim() ? customRoomType.trim() : roomType;

    const numL = parseFloat(length);
    const numW = parseFloat(width);

    if (isNaN(numL) || numL <= 0 || isNaN(numW) || numW <= 0) {
      setErrorMsg('Please enter valid room dimensions greater than 0.');
      return;
    }

    if (selectedColors.length === 0) {
      setErrorMsg('Please select or specify at least one preferred color.');
      return;
    }

    if (budget === 'Custom Budget' && !customBudget.trim()) {
      setErrorMsg('Please specify your custom budget amount.');
      return;
    }

    const payload: RoomRequirements = {
      room_type: effectiveRoomType,
      length: length.trim(),
      width: width.trim(),
      height: height.trim() ? `${height.trim()} ft` : '10 ft',
      style,
      colors: selectedColors,
      budget: budget === 'Custom Budget' ? customBudget.trim() : budget,
      custom_budget: customBudget,
      furniture,
      lighting,
      decorations,
      additional_requirements: additionalRequirements.trim(),
    };

    onSubmit(payload);
  };

  const STYLE_DESCRIPTIONS: Record<string, string> = {
    Modern: 'Clean geometric lines, polished finishes, integrated storage & neutral bases',
    Minimalist: 'Clutter-free, functional essentials, open negative space & muted tones',
    Luxury: 'Rich textures, metallic champagne accents, bespoke joinery & deep depth',
    Traditional: 'Classic moldings, warm hardwoods, rich drapery & timeless symmetry',
    Scandinavian: 'Light birch woods, cozy textiles, airy whites & functional serenity',
    Bohemian: 'Organic wicker, terracotta tones, vibrant layering & relaxed foliage',
    Industrial: 'Raw metals, exposed brick tones, matte black accents & tactile concrete',
    Contemporary: 'Curved organic silhouettes, textured bouclé & state-of-the-art styling',
    Rustic: 'Weathered woods, earthy textures, warm craftsmanship & grounded comfort',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-stone-800 pb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
          <Compass className="h-3.5 w-3.5" />
          <span>No Room Uploads Required · Zero-Photo Generative Synthesis</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl">
          Tell us about your dream room
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-400">
          Provide your room's spatial parameters and design wishes. Our Generative AI will engineer a
          complete custom interior plan and synthesize a realistic room visualization.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A: Room Type */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <label className="block text-sm font-semibold uppercase tracking-wider text-amber-400">
            A. Room Type
          </label>
          <p className="mt-1 text-xs text-stone-400">
            Select the designated spatial purpose of the room.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {[
              'Bedroom',
              'Living Room',
              'Kitchen',
              'Dining Room',
              'Study Room',
              'Home Office',
              'Kids Room',
              'Bathroom',
              'Other',
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRoomType(type)}
                className={`rounded-xl border px-3.5 py-3 text-left text-xs font-medium transition-all ${
                  roomType === type
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm shadow-amber-900/20'
                    : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {roomType === 'Other' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter custom room type (e.g. Media Room, Library, Balcony Lounge)"
                value={customRoomType}
                onChange={(e) => setCustomRoomType(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Section B: Room Dimensions */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              B. Room Dimensions
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Accurate dimensions ensure functional 36-inch walking clearances and scaled furniture sizing.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-stone-300">
                Length (feet) *
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="100"
                  required
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2.5 pr-8 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  placeholder="14"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">ft</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">
                Width (feet) *
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="100"
                  required
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2.5 pr-8 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  placeholder="12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">ft</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">
                Height (feet) <span className="text-stone-400">(optional)</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="6"
                  max="30"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2.5 pr-8 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  placeholder="10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">ft</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
            <span>
              Total Floor Area: ~
              <strong className="text-stone-200">
                {Math.round((parseFloat(length) || 0) * (parseFloat(width) || 0))} sq.ft
              </strong>
            </span>
            <span>Recommended for: {parseFloat(length) * parseFloat(width) > 180 ? 'Spacious Multi-Zone' : 'Optimized Compact Living'}</span>
          </div>
        </div>

        {/* Section C: Interior Style */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <label className="block text-sm font-semibold uppercase tracking-wider text-amber-400">
            C. Interior Style
          </label>
          <p className="mt-1 text-xs text-stone-400">
            Choose the core architectural and design philosophy for the space.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              'Modern',
              'Minimalist',
              'Luxury',
              'Traditional',
              'Scandinavian',
              'Bohemian',
              'Industrial',
              'Contemporary',
              'Rustic',
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStyle(opt)}
                className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                  style === opt
                    ? 'border-amber-500 bg-amber-500/15 text-stone-100 ring-1 ring-amber-500/30'
                    : 'border-stone-800 bg-stone-800/40 text-stone-300 hover:border-stone-700 hover:bg-stone-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold">{opt}</span>
                  {style === opt && <Check className="h-4 w-4 text-amber-400" />}
                </div>
                <p className="mt-1.5 text-[11px] text-stone-400 line-clamp-2">
                  {STYLE_DESCRIPTIONS[opt]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Section D: Preferred Colors */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              D. Preferred Colors
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Select designer color harmonies or add custom accent tones.
          </p>

          {/* Curated Swatches */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CURATED_COLORS.map((c) => {
              const isSelected = selectedColors.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c.name)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/20 text-stone-100 ring-1 ring-amber-500/40'
                      : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/30 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Custom color input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add custom color (e.g. Muted Emerald, Dusty Rose, Champagne)"
              value={customColorInput}
              onChange={(e) => setCustomColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomColor();
                }
              }}
              className="flex-1 rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomColor}
              className="flex items-center gap-1 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200 hover:border-amber-500 hover:bg-stone-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Selected colors active list */}
          {selectedColors.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] text-stone-400">Active Palette:</span>
              {selectedColors.map((color) => (
                <span
                  key={color}
                  className="flex items-center gap-1 rounded-lg bg-stone-800 px-2 py-0.5 text-xs text-stone-200 border border-stone-700"
                >
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-stone-400 hover:text-stone-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section E: Budget */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              E. Estimated Budget
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Enables smart resource allocation across furniture, lighting, storage, and styling.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setBudget(opt)}
                className={`rounded-xl border px-3 py-3 text-center text-xs font-medium transition-all ${
                  budget === opt
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {budget === 'Custom Budget' && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-stone-300">
                Enter Custom Budget (₹)
              </label>
              <input
                type="text"
                placeholder="e.g. ₹75,000 or ₹3,50,000"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-800/80 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Section F: Furniture Requirements */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <Armchair className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              F. Furniture Requirements
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Select mandatory furniture pieces to incorporate into the room layout plan.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {FURNITURE_OPTIONS.map((item) => {
              const isChecked = furniture.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFurniture(item)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-500/15 text-stone-100'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isChecked
                        ? 'border-amber-500 bg-amber-500 text-stone-900'
                        : 'border-stone-600 bg-stone-800'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add other custom furniture (e.g. Ergonomic Recliner, Dressing Vanity, Bar Cart)"
              value={customFurnitureInput}
              onChange={(e) => setCustomFurnitureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomFurniture();
                }
              }}
              className="flex-1 rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomFurniture}
              className="flex items-center gap-1 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200 hover:border-amber-500 hover:bg-stone-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Section G: Lighting Preference */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              G. Lighting Preference
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Defines the luminaire kelvin temperature, ambient lumens, and accent fixtures.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {LIGHTING_OPTIONS.map((lightOpt) => (
              <button
                key={lightOpt}
                type="button"
                onClick={() => setLighting(lightOpt)}
                className={`rounded-xl border px-3 py-3 text-center text-xs font-medium transition-all ${
                  lighting === lightOpt
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                }`}
              >
                {lightOpt} Lighting
              </button>
            ))}
          </div>
        </div>

        {/* Section H: Decoration Preferences */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <label className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              H. Decoration Preferences
            </label>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Choose styling accessories to accentuate spatial character and texture.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {DECORATION_OPTIONS.map((dec) => {
              const isChecked = decorations.includes(dec);
              return (
                <button
                  key={dec}
                  type="button"
                  onClick={() => toggleDecoration(dec)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-500/15 text-stone-100'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isChecked
                        ? 'border-amber-500 bg-amber-500 text-stone-900'
                        : 'border-stone-600 bg-stone-800'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span>{dec}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section I: Additional Requirements */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <label className="block text-sm font-semibold uppercase tracking-wider text-amber-400">
            I. Additional Requirements & Lifestyle Needs
          </label>
          <p className="mt-1 text-xs text-stone-400">
            Specify unique lifestyle nuances (e.g., studying nook, maximum wardrobe storage, pet-friendly fabrics).
          </p>

          <textarea
            rows={4}
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Example: I want maximum storage, enough space for studying, and hidden wire management for my workstation."
            className="mt-3 w-full rounded-xl border border-stone-700 bg-stone-800/80 p-4 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 py-4 text-base font-bold text-stone-950 shadow-xl shadow-amber-900/30 transition-all hover:scale-[1.01] hover:shadow-amber-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-950 border-t-transparent" />
                <span className="font-semibold text-stone-950">Synthesizing Architectural Space...</span>
              </div>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-stone-950" />
                <span className="font-serif text-lg tracking-wide text-stone-950">
                  Generate My Dream Room
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
