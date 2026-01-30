export interface ActionItem {
  task: string;
  owner: string;
  priority: string;
}

export interface RecapOutput {
  executiveSummary: string;
  keyHighlights: string[];
  decisionsTaken: string[];
  risksAndBlockers: string[];
  actionItems: ActionItem[];
  nextSteps: string[];
}

export async function generateRecap(inputText: string): Promise<RecapOutput> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: inputText })
});


  if (!response.ok) {
    throw new Error("Failed to generate recap");
  }

  const data = await response.json();
  return data;
}
