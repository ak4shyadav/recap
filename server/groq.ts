import fetch from "node-fetch";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export async function generateRecapWithGroq(rawText: string) {
  const systemPrompt = `
You are a professional business analyst.

Your job is to convert messy notes, chat logs, or updates into a clean, structured corporate report.

Tone: Formal, professional, concise.
No fluff. No emojis. No casual language.

IMPORTANT:
Return ONLY valid JSON.
Do NOT include explanations.
Do NOT wrap in markdown.
Do NOT include backticks.

The JSON must follow this EXACT structure:

{
  "executiveSummary": "",
  "keyHighlights": [],
  "decisionsTaken": [],
  "risksAndBlockers": [],
  "actionItems": [
    { "task": "", "owner": "", "priority": "" }
  ],
  "nextSteps": []
}
`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: rawText }
      ],
      temperature: 0.1
    })
  });

  const text = await response.text();
console.log("RAW GROQ TEXT:", text);
const data = JSON.parse(text);

console.log("RAW GROQ RESPONSE:", JSON.stringify(data, null, 2));


  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from Groq");
  }

  // 🧠 Hard clean: extract JSON only
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    console.error("RAW GROQ OUTPUT:", content);
    throw new Error("Groq did not return JSON");
  }

  const jsonString = content.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("FAILED JSON:", jsonString);
    throw new Error("Invalid JSON from Groq");
  }
}
