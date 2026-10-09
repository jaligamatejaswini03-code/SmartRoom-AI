import { RoomRequirements, DesignResult, BudgetOptimizationResult } from '../types';

export async function generateDesign(req: RoomRequirements): Promise<DesignResult> {
  const payload = {
    ...req,
    budget: req.custom_budget && req.custom_budget.trim() ? req.custom_budget.trim() : req.budget,
  };

  const res = await fetch('/api/generate-design', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Unable to generate the design right now. Please try again.');
  }

  const data = await res.json();
  data.original_requirements = req;
  return data;
}

export async function modifyDesign(
  originalReq: RoomRequirements,
  modificationPrompt: string,
  quickTags: string[]
): Promise<DesignResult> {
  const res = await fetch('/api/modify-design', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      original_requirements: originalReq,
      modification_prompt: modificationPrompt,
      quick_tags: quickTags,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Unable to modify the design right now. Please try again.');
  }

  const data = await res.json();
  data.original_requirements = originalReq;
  return data;
}

export async function optimizeBudget(
  req: RoomRequirements,
  currentTotal: string
): Promise<BudgetOptimizationResult> {
  const res = await fetch('/api/optimize-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requirements: req,
      current_total: currentTotal,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Unable to optimize budget right now. Please try again.');
  }

  return await res.json();
}

export async function sendChatMessage(
  message: string,
  designContext: any
): Promise<{ reply: string; suggested_actions?: string[] }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      design_context: designContext,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Unable to process chat right now. Please try again.');
  }

  return await res.json();
}

export async function fetchDesigns(): Promise<DesignResult[]> {
  const res = await fetch('/api/designs');
  if (!res.ok) {
    throw new Error('Failed to fetch design history.');
  }
  const data = await res.json();
  return data.designs || [];
}

export async function deleteDesign(id: string): Promise<void> {
  const res = await fetch(`/api/designs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete design.');
  }
}
