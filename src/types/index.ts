export interface RoomRequirements {
  room_type: string;
  length: string;
  width: string;
  height?: string;
  style: string;
  colors: string[];
  budget: string;
  custom_budget?: string;
  furniture: string[];
  lighting: string;
  decorations: string[];
  additional_requirements: string;
}

export interface FurnitureItem {
  name: string;
  purpose: string;
  placement: string;
  price: string;
  dimensions?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface LightingPlan {
  ambient?: string;
  task?: string;
  accent?: string;
  color_temperature?: string;
}

export interface DecorationIdea {
  item: string;
  description: string;
  styling_note: string;
}

export interface MaterialSuggestion {
  material: string;
  application: string;
  finish: string;
}

export interface BudgetBreakdown {
  furniture: string;
  lighting: string;
  decorations: string;
  storage: string;
  other: string;
  total: string;
}

export interface DesignConcept {
  id: string;
  name: string;
  style: string;
  description: string;
  estimated_budget: string;
  image_url: string;
  highlight: string;
}

export interface DesignResult {
  id: string;
  request_id?: string;
  room_type: string;
  dimensions: string;
  style: string;
  budget: string;
  image_url: string;
  prompt_used?: string;
  image_prompt_used?: string;
  design_summary: string;
  color_palette: ColorSwatch[];
  furniture_recommendations: FurnitureItem[];
  furniture_placement: string;
  lighting_recommendations: LightingPlan;
  decoration_ideas: DecorationIdea[];
  space_utilization: string;
  budget_breakdown: BudgetBreakdown;
  materials_suggestions: MaterialSuggestion[];
  design_tips: string[];
  concepts: DesignConcept[];
  created_at?: string;
  original_requirements?: RoomRequirements;
}

export interface BudgetOptimizationResult {
  status: string;
  original_budget: string;
  optimized_budget: string;
  total_savings: string;
  savings_percentage: string;
  optimized_breakdown: BudgetBreakdown;
  suggestions: Array<{
    category: string;
    title: string;
    saving: string;
    recommendation: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: string[];
}
