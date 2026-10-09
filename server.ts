import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('your_')) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI client init error:', err);
  }
}

// Curated high-resolution photorealistic interior renders
const CURATED_ROOM_RENDERS: Record<string, Record<string, string>> = {
  'Living Room': {
    Modern: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
    Bohemian: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    Industrial: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80',
    Traditional: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80',
    Rustic: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
  },
  Bedroom: {
    Modern: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    Bohemian: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80',
    Industrial: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b49?auto=format&fit=crop&w=1600&q=80',
    Traditional: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80',
    Rustic: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
  },
  Kitchen: {
    Modern: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1600&q=80',
  },
  'Study Room': {
    Modern: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    Industrial: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
  },
  'Home Office': {
    Modern: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=1600&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
  },
  'Dining Room': {
    Modern: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
  },
  'Kids Room': {
    Modern: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1600&q=80',
  },
  Bathroom: {
    Modern: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
    Luxury: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80',
  },
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80';

// SQLite CLI helper
function runDbCommand(cmd: string, arg?: string): Promise<any> {
  return new Promise((resolve) => {
    const pythonScript = path.join(__dirname, 'db_manager.py');
    const args = arg ? [pythonScript, cmd, arg] : [pythonScript, cmd];
    execFile('python3', args, (error, stdout) => {
      if (error) {
        console.warn(`Database CLI error on ${cmd}:`, error);
        resolve(null);
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch {
        resolve(stdout.trim());
      }
    });
  });
}

// Ensure database tables
runDbCommand('init');

function buildDesignPrompt(req: any): string {
  const roomType = req.room_type || 'Living Room';
  const length = req.length || '14';
  const width = req.width || '12';
  const height = req.height || '9-10 ft';
  const style = req.style || 'Modern';
  const colors = Array.isArray(req.colors) ? req.colors.join(', ') : 'Neutral stone, warm oak, brushed brass';
  const budget = req.budget || '₹1,00,000–₹2,00,000';
  const furniture = Array.isArray(req.furniture) ? req.furniture.join(', ') : 'Sofa, coffee table, storage';
  const lighting = req.lighting || 'Warm layered lighting';
  const decorations = Array.isArray(req.decorations) ? req.decorations.join(', ') : 'Plants, artwork, rugs';
  const additional = req.additional_requirements || 'Maximum functional efficiency and clean aesthetics';

  return `You are an expert interior designer and space-planning consultant.

Create a personalized interior design for the following room.

Room Type: ${roomType}
Room Dimensions: ${length} ft × ${width} ft
Room Height: ${height}
Interior Style: ${style}
Preferred Colors: ${colors}
Budget: ${budget}
Furniture Requirements: ${furniture}
Lighting Preference: ${lighting}
Decoration Preferences: ${decorations}
Additional Requirements: ${additional}

Design the room while respecting the given dimensions, style, colors, furniture requirements and budget.

Provide:

1. Design Summary
2. Color Palette
3. Furniture Recommendations
4. Furniture Placement
5. Lighting Recommendations
6. Decoration Ideas
7. Space Utilization
8. Estimated Budget Breakdown
9. Materials Suggestions
10. Design Tips

Make the recommendations practical, realistic and suitable for the given room size and budget.

Return the result in structured JSON adhering to this exact format:
{
  "design_summary": "Comprehensive architectural description of the concept and zoning",
  "color_palette": [
    {"name": "Color Name", "hex": "#HEX", "role": "Primary / Secondary / Accent"}
  ],
  "furniture_recommendations": [
    {"name": "Name", "purpose": "Purpose", "placement": "Placement", "price": "₹XX,XXX", "dimensions": "Dimensions"}
  ],
  "furniture_placement": "Detailed space planning rules with walking aisle clearances",
  "lighting_recommendations": {
    "ambient": "Ambient fixture plan",
    "task": "Task lighting plan",
    "accent": "Accent LED details",
    "color_temperature": "2700K - 3000K warm white"
  },
  "decoration_ideas": [
    {"item": "Item", "description": "Description", "styling_note": "Styling rule"}
  ],
  "space_utilization": "Specific sq.ft efficiency analysis",
  "budget_breakdown": {
    "furniture": "₹XX,XXX",
    "lighting": "₹XX,XXX",
    "decorations": "₹XX,XXX",
    "storage": "₹XX,XXX",
    "other": "₹XX,XXX",
    "total": "₹XX,XXX"
  },
  "materials_suggestions": [
    {"material": "Material name", "application": "Usage", "finish": "Finish"}
  ],
  "design_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "concepts": [
    {
      "id": "concept-1",
      "name": "${style} Signature",
      "style": "${style}",
      "description": "Harmonious balance of ergonomics, storage, and natural lighting.",
      "estimated_budget": "${budget}",
      "highlight": "Optimal circulation and clean sightlines"
    },
    {
      "id": "concept-2",
      "name": "Warm Contemporary",
      "style": "Contemporary",
      "description": "Organic curves, tactile fabrics, and warm neutral surfaces.",
      "estimated_budget": "${budget}",
      "highlight": "Acoustic comfort and relaxed lounge mood"
    },
    {
      "id": "concept-3",
      "name": "Luxury Modern",
      "style": "Luxury",
      "description": "Refined architectural cove lights, fluted textures, and champagne metal accents.",
      "estimated_budget": "${budget}",
      "highlight": "High-end bespoke cabinetry and mood illumination"
    }
  ]
}`;
}

function buildImagePrompt(req: any): string {
  const roomType = req.room_type || 'Living Room';
  const length = req.length || '14';
  const width = req.width || '12';
  const style = req.style || 'Modern';
  const colors = Array.isArray(req.colors) ? req.colors.join(', ') : 'warm neutral tones';
  const budget = req.budget || '₹1,00,000–₹2,00,000';
  const furniture = Array.isArray(req.furniture) ? req.furniture.join(', ') : 'essential furniture';
  const lighting = req.lighting || 'Warm lighting';
  const decorations = Array.isArray(req.decorations) ? req.decorations.join(', ') : 'wall art and plants';
  const additional = req.additional_requirements || 'clean architectural aesthetic';

  return `Generate a realistic interior-design visualization of a ${roomType} measuring approximately ${length} × ${width} feet.

Style: ${style}
Color palette: ${colors}
Budget level: ${budget}
Required furniture: ${furniture}
Lighting: ${lighting}
Decorations: ${decorations}
Special requirements: ${additional}

Create a realistic, professionally designed interior.

The room should:
- Respect the requested room dimensions
- Include the requested furniture
- Follow the requested interior style
- Use the requested colors
- Use appropriate furniture proportions
- Have realistic lighting
- Provide practical walking space
- Look aesthetically pleasing
- Follow the user's budget level

Generate a high-quality photorealistic interior-design visualization.

Do not show people.
Do not show text inside the image.
Do not add unrelated furniture or objects.`;
}

// Fallback plan generator for demo / offline reliability
function generateFallbackPlan(req: any, prompt: string) {
  const room = req.room_type || 'Living Room';
  const style = req.style || 'Modern';
  const l = parseFloat(String(req.length || '14').replace(/[^0-9.]/g, '') || '14');
  const w = parseFloat(String(req.width || '12').replace(/[^0-9.]/g, '') || '12');
  const sqft = Math.round(l * w);
  const budgetRaw = req.budget || '₹1,00,000–₹2,00,000';
  const furnitureList = req.furniture && req.furniture.length ? req.furniture : ['Sofa', 'Coffee Table', 'TV Unit'];

  let numericBudget = 145000;
  if (budgetRaw.includes('50,000') && budgetRaw.includes('Below')) numericBudget = 45000;
  else if (budgetRaw.includes('50,000–₹1,00,000')) numericBudget = 85000;
  else if (budgetRaw.includes('1,00,000–₹2,00,000')) numericBudget = 145000;
  else if (budgetRaw.includes('2,00,000+')) numericBudget = 250000;

  const furnCost = Math.round(numericBudget * 0.52);
  const lightCost = Math.round(numericBudget * 0.14);
  const decCost = Math.round(numericBudget * 0.10);
  const storCost = Math.round(numericBudget * 0.16);
  const othCost = numericBudget - (furnCost + lightCost + decCost + storCost);

  const palettes: Record<string, Array<{ name: string; hex: string; role: string }>> = {
    Modern: [
      { name: 'Warm Alabaster', hex: '#F5F5F0', role: 'Primary Wall' },
      { name: 'Architectural Charcoal', hex: '#2A2E2B', role: 'Secondary Contrast' },
      { name: 'Brushed Champagne Gold', hex: '#C6A15B', role: 'Accent Metallic' },
      { name: 'Natural Sand', hex: '#8E8578', role: 'Textile Base' },
    ],
    Minimalist: [
      { name: 'Studio Pure White', hex: '#FAFAFA', role: 'Primary' },
      { name: 'Soft Concrete Greige', hex: '#E2E2DF', role: 'Secondary' },
      { name: 'Matte Obsidian', hex: '#1C1C1E', role: 'Accent' },
      { name: 'Pale Bleached Ash', hex: '#D2C8BE', role: 'Wood Tone' },
    ],
    Luxury: [
      { name: 'Midnight Obsidian', hex: '#181B1E', role: 'Primary Depth' },
      { name: 'Lustrous Brass', hex: '#B8924A', role: 'Accent Metallic' },
      { name: 'Silk Oyster', hex: '#EBE8E2', role: 'Secondary Neutral' },
      { name: 'Rich Smoked Walnut', hex: '#3B2A1E', role: 'Rich Wood' },
    ],
    Scandinavian: [
      { name: 'Nordic Off-White', hex: '#F8F7F4', role: 'Primary Surface' },
      { name: 'Pale Birch Oak', hex: '#D7C4B0', role: 'Wood Joinery' },
      { name: 'Muted Sage Pine', hex: '#7A8C7B', role: 'Organic Accent' },
      { name: 'Granite Grey', hex: '#4B5563', role: 'Anchor Neutral' },
    ],
  };

  const selectedPalette = palettes[style] || palettes['Modern'];

  const perItem = Math.max(3500, Math.round(furnCost / Math.max(1, furnitureList.length)));
  const furnitureItems = furnitureList.map((item: string) => ({
    name: `${style} ${item}`,
    purpose: `Custom-tailored ${item.toLowerCase()} optimized for ergonomic comfort and clean proportions in a ${room.toLowerCase()}`,
    placement: `Positioned along primary perimeter wall with 36" walking clearance from room entry`,
    price: `₹${perItem.toLocaleString('en-IN')}`,
    dimensions: `Standard ${sqft > 160 ? 'spacious' : 'compact'} architectural scale`,
  }));

  return {
    design_summary: `A personalized ${style.toLowerCase()} design plan meticulously configured for your ${l}' × ${w}' (${sqft} sq.ft) ${room.toLowerCase()}. The plan achieves a harmonious equilibrium between serene visual unclutteredness, high-traffic walkway clearances (minimum 36 inches), and targeted storage integration under a ₹${numericBudget.toLocaleString('en-IN')} budget framework.`,
    color_palette: selectedPalette,
    furniture_recommendations: furnitureItems,
    furniture_placement: `Main furniture pieces are anchored to structural perimeter surfaces to preserve an uninterrupted 38-inch diagonal line of sight from the entrance toward natural window apertures.`,
    lighting_recommendations: {
      ambient: `Flush 3000K warm-white architectural ceiling downlights spaced evenly at 4.5-foot intervals.`,
      task: `Dimmable reading/work task luminaire offering 450 lumens of focused glare-free illumination.`,
      accent: `Concealed 2700K LED warm ribbon cove behind the primary accent feature and beneath low credenzas.`,
      color_temperature: '2700K - 3000K Warm Architectural White',
    },
    decoration_ideas: [
      {
        item: 'Textured Wool Area Rug',
        description: 'Neutral low-pile wool rug anchoring the seating ensemble',
        styling_note: 'Ensure at least the front legs of major seating pieces rest securely on the rug perimeter.',
      },
      {
        item: 'Curated Gallery Art Pieces',
        description: 'Matte black minimalist frames with 2.5-inch archival mats',
        styling_note: 'Hang artwork centerline at eye level (57-58 inches from finished floor).',
      },
      {
        item: 'Indoor Botanical Specimen',
        description: 'Fiddle leaf fig or sansevieria in an artisanal terracotta cylinder',
        styling_note: 'Position in the ambient light corner to draw sightlines outward.',
      },
      {
        item: 'Floor-to-Ceiling Drapery',
        description: 'Semi-sheer linen drapery hung on high ceiling track',
        styling_note: 'Mount rod 3 inches beneath ceiling line to amplify room height visually.',
      },
    ],
    space_utilization: `Total Footprint: ${sqft} sq.ft. Furniture Footprint: ${Math.round(sqft * 0.38)} sq.ft (38%). Circulation Clearances: ${Math.round(sqft * 0.44)} sq.ft (44%). Open Negative Space: ${Math.round(sqft * 0.18)} sq.ft (18%). This ratio ensures a spacious feel and seamless movement.`,
    budget_breakdown: {
      furniture: `₹${furnCost.toLocaleString('en-IN')}`,
      lighting: `₹${lightCost.toLocaleString('en-IN')}`,
      decorations: `₹${decCost.toLocaleString('en-IN')}`,
      storage: `₹${storCost.toLocaleString('en-IN')}`,
      other: `₹${othCost.toLocaleString('en-IN')}`,
      total: `₹${numericBudget.toLocaleString('en-IN')}`,
    },
    materials_suggestions: [
      { material: 'Natural White Oak / Walnut', application: 'Furniture frames & display shelving', finish: 'Satin low-VOC oil seal' },
      { material: 'Performance Bouclé / Linen Blend', application: 'Seating upholstery', finish: 'Stain-resistant hydrophobic weave' },
      { material: 'Brushed Brass / Powder-coated Steel', application: 'Hardware & light fixture arms', finish: 'Matte satin anti-fingerprint' },
      { material: 'Honed Travertine or Quartz', application: 'Table tops & accent surfaces', finish: 'Non-porous honed finish' },
    ],
    design_tips: [
      `Elevate drapery tracks to ceiling level rather than window casings to visually add vertical height.`,
      `Adopt layered light switching (ambient, task, accent) on independent dimmers to transform daytime productivity into evening calm.`,
      `Maintain a strict 36-inch walking aisle between entryways and seating clusters to avoid traffic bottlenecks.`,
      `Apply the 60-30-10 color rule: 60% dominant wall neutral, 30% secondary texture/wood, and 10% intentional accent tone.`,
    ],
    concepts: [
      {
        id: 'concept-1',
        name: `${style} Balanced`,
        style: style,
        description: `Our primary recommendation tailored to your exact criteria with optimal storage efficiency.`,
        estimated_budget: `₹${numericBudget.toLocaleString('en-IN')}`,
        highlight: 'Balanced functionality with clean architectural lines',
      },
      {
        id: 'concept-2',
        name: 'Warm Contemporary',
        style: 'Contemporary',
        description: 'Organic rounded silhouettes, tactile bouclé fabrics, and earth-toned ceramic accents for soothing warmth.',
        estimated_budget: `₹${Math.round(numericBudget * 1.05).toLocaleString('en-IN')}`,
        highlight: 'Enhanced acoustic comfort and tactile upholstery',
      },
      {
        id: 'concept-3',
        name: 'Luxury Modern',
        style: 'Luxury',
        description: 'Deep charcoal surfaces, fluted architectural wall cladding, and warm integrated cove illumination.',
        estimated_budget: `₹${Math.round(numericBudget * 1.25).toLocaleString('en-IN')}`,
        highlight: 'Bespoke joinery with luxury metallic highlights',
      },
    ],
    prompt_used: prompt,
  };
}

// Endpoint: Generate Design
app.post(['/generate-design', '/api/generate-design'], async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.room_type || !data.style || !data.budget) {
      return res.status(400).json({ detail: 'Room type, style, and budget are required.' });
    }

    const designPrompt = buildDesignPrompt(data);
    const imagePrompt = buildImagePrompt(data);

    let planData: any = null;

    // 1. Generate text plan with Gemini if available
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: designPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          planData = JSON.parse(response.text);
          planData.prompt_used = designPrompt;
        }
      } catch (err) {
        console.warn('Gemini text generation failed, utilizing structured generator:', err);
      }
    }

    if (!planData) {
      planData = generateFallbackPlan(data, designPrompt);
    }

    // 2. Room visualization image
    let imageUrl = '';
    const roomType = data.room_type || 'Living Room';
    const style = data.style || 'Modern';

    // Attempt Gemini image generation if available
    if (ai) {
      try {
        const imgResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: { parts: [{ text: imagePrompt }] },
          config: {
            imageConfig: {
              aspectRatio: '16:9',
              imageSize: '1K',
            },
          },
        });
        const candidate = imgResponse.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (err) {
        // Image generation on flash-image can require paid tier; gracefully use matched photorealistic render
        console.warn('Direct image model call returned, using matched photorealistic render:', err);
      }
    }

    if (!imageUrl) {
      const cat = CURATED_ROOM_RENDERS[roomType] || CURATED_ROOM_RENDERS['Living Room'];
      imageUrl = cat[style] || cat['Modern'] || DEFAULT_IMAGE;
    }

    // Assign concept images
    const cat = CURATED_ROOM_RENDERS[roomType] || CURATED_ROOM_RENDERS['Living Room'];
    const conceptImgs = [
      cat[style] || cat['Modern'] || imageUrl,
      cat['Contemporary'] || cat['Minimalist'] || imageUrl,
      cat['Luxury'] || cat['Scandinavian'] || imageUrl,
    ];
    if (planData.concepts && Array.isArray(planData.concepts)) {
      planData.concepts.forEach((c: any, i: number) => {
        c.image_url = conceptImgs[i] || imageUrl;
      });
    }

    // 3. Save to SQLite via db_manager
    const savePayload = JSON.stringify({
      request: data,
      result: planData,
      image_url: imageUrl,
    });
    const dbResult = await runDbCommand('save', savePayload);

    const resultId = dbResult?.result_id || `res_${Date.now()}`;
    const requestId = dbResult?.request_id || `req_${Date.now()}`;

    const dimensionsStr = `${data.length || '14'} ft × ${data.width || '12'} ft${data.height ? ` × ${data.height}` : ''}`;

    const responsePayload = {
      id: resultId,
      request_id: requestId,
      room_type: data.room_type,
      dimensions: dimensionsStr,
      style: data.style,
      budget: data.budget,
      image_url: imageUrl,
      prompt_used: designPrompt,
      image_prompt_used: imagePrompt,
      design_summary: planData.design_summary,
      color_palette: planData.color_palette || [],
      furniture_recommendations: planData.furniture_recommendations || [],
      furniture_placement: planData.furniture_placement || '',
      lighting_recommendations: planData.lighting_recommendations || {},
      decoration_ideas: planData.decoration_ideas || [],
      space_utilization: planData.space_utilization || '',
      budget_breakdown: planData.budget_breakdown || {},
      materials_suggestions: planData.materials_suggestions || [],
      design_tips: planData.design_tips || [],
      concepts: planData.concepts || [],
      created_at: new Date().toISOString(),
    };

    return res.json(responsePayload);
  } catch (error) {
    console.error('Error in /generate-design:', error);
    return res.status(500).json({ detail: 'Unable to generate the design right now. Please try again.' });
  }
});

// Endpoint: Modify Design
app.post(['/modify-design', '/api/modify-design'], async (req: Request, res: Response) => {
  try {
    const { original_requirements, modification_prompt, quick_tags } = req.body;
    if (!original_requirements) {
      return res.status(400).json({ detail: 'Original requirements are required.' });
    }

    const updated = { ...original_requirements };
    const notes = [modification_prompt, ...(quick_tags || [])].filter(Boolean).join('; ');
    updated.additional_requirements = `${updated.additional_requirements || ''} | Modification request: ${notes}`.trim();

    if (quick_tags?.includes('Make It More Minimalist')) updated.style = 'Minimalist';
    if (quick_tags?.includes('Make It More Luxurious')) updated.style = 'Luxury';
    if (quick_tags?.includes('Add Plants')) {
      updated.decorations = Array.from(new Set([...(updated.decorations || []), 'Indoor plants']));
    }
    if (quick_tags?.includes('Add Storage')) {
      updated.furniture = Array.from(new Set([...(updated.furniture || []), 'Storage']));
    }

    // Re-call generate endpoint logic
    req.body = updated;
    // Delegate to generate handler
    const designPrompt = buildDesignPrompt(updated);
    const imagePrompt = buildImagePrompt(updated);
    let planData: any = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: designPrompt,
          config: { responseMimeType: 'application/json' },
        });
        if (response.text) {
          planData = JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('Gemini modify fallback:', err);
      }
    }

    if (!planData) {
      planData = generateFallbackPlan(updated, designPrompt);
    }

    const cat = CURATED_ROOM_RENDERS[updated.room_type] || CURATED_ROOM_RENDERS['Living Room'];
    const imageUrl = cat[updated.style] || cat['Modern'] || DEFAULT_IMAGE;

    const savePayload = JSON.stringify({
      request: updated,
      result: planData,
      image_url: imageUrl,
    });
    const dbResult = await runDbCommand('save', savePayload);

    return res.json({
      id: dbResult?.result_id || `res_${Date.now()}`,
      request_id: dbResult?.request_id || `req_${Date.now()}`,
      room_type: updated.room_type,
      dimensions: `${updated.length} ft × ${updated.width} ft`,
      style: updated.style,
      budget: updated.budget,
      image_url: imageUrl,
      prompt_used: designPrompt,
      image_prompt_used: imagePrompt,
      design_summary: planData.design_summary,
      color_palette: planData.color_palette || [],
      furniture_recommendations: planData.furniture_recommendations || [],
      furniture_placement: planData.furniture_placement || '',
      lighting_recommendations: planData.lighting_recommendations || {},
      decoration_ideas: planData.decoration_ideas || [],
      space_utilization: planData.space_utilization || '',
      budget_breakdown: planData.budget_breakdown || {},
      materials_suggestions: planData.materials_suggestions || [],
      design_tips: planData.design_tips || [],
      concepts: planData.concepts || [],
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /modify-design:', error);
    return res.status(500).json({ detail: 'Unable to modify the design right now. Please try again.' });
  }
});

// Endpoint: Optimize Budget
app.post(['/optimize-budget', '/api/optimize-budget'], (req: Request, res: Response) => {
  try {
    const { requirements, current_total } = req.body;
    const rawNum = parseInt(String(current_total || '145000').replace(/[^0-9]/g, '')) || 145000;

    const optTotal = Math.round(rawNum * 0.74);
    const savings = rawNum - optTotal;

    const furnCost = Math.round(rawNum * 0.52);
    const lightCost = Math.round(rawNum * 0.14);
    const decCost = Math.round(rawNum * 0.10);
    const storCost = Math.round(rawNum * 0.16);
    const othCost = rawNum - (furnCost + lightCost + decCost + storCost);

    const optFurn = Math.round(furnCost * 0.76);
    const optLight = Math.round(lightCost * 0.65);
    const optDec = Math.round(decCost * 0.60);
    const optStor = Math.round(storCost * 0.78);
    const optOth = Math.round(othCost * 0.70);

    return res.json({
      status: 'optimized',
      original_budget: `₹${rawNum.toLocaleString('en-IN')}`,
      optimized_budget: `₹${optTotal.toLocaleString('en-IN')}`,
      total_savings: `₹${savings.toLocaleString('en-IN')}`,
      savings_percentage: '26%',
      optimized_breakdown: {
        furniture: `₹${optFurn.toLocaleString('en-IN')}`,
        lighting: `₹${optLight.toLocaleString('en-IN')}`,
        decorations: `₹${optDec.toLocaleString('en-IN')}`,
        storage: `₹${optStor.toLocaleString('en-IN')}`,
        other: `₹${optOth.toLocaleString('en-IN')}`,
        total: `₹${optTotal.toLocaleString('en-IN')}`,
      },
      suggestions: [
        {
          category: 'Lower-Cost Furniture Alternatives',
          title: 'Engineered Wood & Ready-to-Assemble Units',
          saving: `₹${(furnCost - optFurn).toLocaleString('en-IN')}`,
          recommendation: 'Replace customized solid-wood joinery with high-density moisture-resistant engineered wood with natural melamine veneers and modular flat-pack frameworks.',
        },
        {
          category: 'Alternative Materials',
          title: 'High-Pressure Laminate & Performance Blends',
          saving: 'Est. 15-20% on finishes',
          recommendation: 'Substitute imported sintered stone and solid brass pulls with matte quartz composite laminates and satin powder-coated aluminum hardware.',
        },
        {
          category: 'Affordable Lighting',
          title: 'Direct-to-Surface Track & Plug-in Sconces',
          saving: `₹${(lightCost - optLight).toLocaleString('en-IN')}`,
          recommendation: 'Eliminate false-ceiling gypsum cutouts; install surface-mount architectural magnetic track spots with warm 2700K dimmable LED bulbs.',
        },
        {
          category: 'Reduced Decoration Costs',
          title: 'Curated Archival Prints & Local Nursery Greenery',
          saving: `₹${(decCost - optDec).toLocaleString('en-IN')}`,
          recommendation: 'Source downloadable digital prints with standard gallery frames and choose hearty indoor specimens (ZZ plant, snake plant) in terracotta pots.',
        },
      ],
    });
  } catch (error) {
    console.error('Error in /optimize-budget:', error);
    return res.status(500).json({ detail: 'Unable to optimize budget right now. Please try again.' });
  }
});

// Endpoint: AI Interior Design Chat Assistant
app.post(['/chat', '/api/chat'], async (req: Request, res: Response) => {
  try {
    const { message, design_context } = req.body;
    if (!message) {
      return res.status(400).json({ detail: 'Message is required.' });
    }

    const roomType = design_context?.room_type || 'Living Room';
    const dims = design_context?.dimensions || '14 ft × 12 ft';
    const style = design_context?.style || 'Modern';
    const budget = design_context?.budget || '₹1,00,000–₹2,00,000';

    if (ai) {
      try {
        const sysPrompt = `You are 'SmartRoom AI Assistant', an empathetic, highly skilled interior architect.
Current room context:
- Room: ${roomType}
- Dimensions: ${dims}
- Style: ${style}
- Budget: ${budget}
- User Question: ${message}

Answer concisely, practically, and professionally with real interior architecture principles. Suggest 2-3 brief next steps.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: sysPrompt,
        });
        if (response.text) {
          return res.json({
            reply: response.text,
            suggested_actions: ['Apply budget optimizer', 'Adjust color palette', 'View space plan'],
          });
        }
      } catch (err) {
        console.warn('Gemini chat error:', err);
      }
    }

    // Contextual rule-based assistant
    const lower = message.toLowerCase();
    let reply = '';
    let actions = ['Run Budget Optimizer', 'View 3D Layout', 'Change Lighting'];

    if (lower.includes('cheaper') || lower.includes('budget') || lower.includes('cost')) {
      reply = `To make your ${roomType} more affordable while keeping the ${style} aesthetic intact:\n1. Switch to engineered wood carcasses for cabinets (saves ~25%).\n2. Use magnetic surface-mounted track lights instead of gypsum false ceiling coves.\n3. Source standard modular flat-pack shelving.\n\nWould you like me to run the automatic Budget Optimizer?`;
      actions = ['Run Budget Optimizer', 'Swap materials to laminate', 'Remove non-essential decor'];
    } else if (lower.includes('furniture') || lower.includes('remove')) {
      reply = `For your ${dims} ${roomType}, removing auxiliary side tables or the accent armchair will instantly reclaim ~18 sq.ft of open floor area, elevating walkway clearances to 42 inches and making the space feel significantly larger.`;
      actions = ['Remove accent armchair', 'Widen walking corridor', 'Regenerate space plan'];
    } else if (lower.includes('color') || lower.includes('wall')) {
      reply = `For this ${style} scheme, keeping three walls in light reflective off-white (like Alabaster) while painting the single focal wall in a grounded mineral tone (like Warm Taupe or Sage Olive) creates instant architectural depth without shrinking perceived room volume.`;
      actions = ['Apply Warm Taupe accent', 'Apply Sage Olive accent', 'View color swatches'];
    } else if (lower.includes('lighting')) {
      reply = `Layered lighting is essential for a ${roomType}: \n• Ambient: 3000K warm flush downlights for daylight transition.\n• Task: 400-lumen directional reading/work sconce.\n• Accent: 2700K hidden LED cove beneath the credenza or bedframe for evening calm.`;
      actions = ['Add 2700K cove light', 'Add task floor lamp', 'Use smart dimmers'];
    } else if (lower.includes('study') || lower.includes('desk') || lower.includes('work')) {
      reply = `To integrate a productive study zone into this ${dims} room:\n1. Position a 48"×24" minimalist desk perpendicular to the window to eliminate screen glare.\n2. Add cable pass-through channels to keep wires concealed.\n3. Mount two shallow floating shelves overhead for books and desk essentials.`;
      actions = ['Add ergonomic study desk', 'Add overhead floating shelves', 'Configure task lighting'];
    } else if (lower.includes('storage')) {
      reply = `To maximize storage in your ${dims} room:\n• Extend storage upward to the ceiling rather than eating into floor clearance.\n• Utilize under-bed or sofa hydraulic storage drawers.\n• Recess shelving into architectural wall niches.`;
      actions = ['Add floor-to-ceiling wardrobe', 'Add under-bed hydraulic storage', 'Recessed wall niche'];
    } else {
      reply = `Based on your ${dims} ${style} ${roomType}, we can optimize the furniture arrangement, fine-tune the ₹${budget} budget, or modify lighting to match your lifestyle. What would you like to explore next?`;
      actions = ['Optimize layout', 'Adjust color palette', 'Review budget breakdown'];
    }

    return res.json({ reply, suggested_actions: actions });
  } catch (error) {
    console.error('Error in /chat:', error);
    return res.status(500).json({ detail: 'Unable to process chat right now. Please try again.' });
  }
});

// Endpoint: Get Designs History from SQLite
app.get(['/designs', '/api/designs'], async (req: Request, res: Response) => {
  try {
    const list = await runDbCommand('list');
    return res.json({ designs: Array.isArray(list) ? list : [], total: Array.isArray(list) ? list.length : 0 });
  } catch (error) {
    console.error('Error in /designs:', error);
    return res.status(500).json({ detail: 'Failed to retrieve design history.' });
  }
});

// Endpoint: Delete Design from SQLite
app.delete(['/designs/:id', '/api/designs/:id'], async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await runDbCommand('delete', id);
    return res.json({ message: 'Design deleted successfully.', id });
  } catch (error) {
    console.error('Error deleting design:', error);
    return res.status(500).json({ detail: 'Failed to delete design.' });
  }
});

// Attach Vite dev server middleware in dev mode
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartRoom AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
