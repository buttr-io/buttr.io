import { LogEntry, Persona, Prompt } from "../types/types";

export const INITIAL_TAGS: string[] = [
  "Coding",
  "Marketing",
  "Support",
  "Legal",
  "Creative",
  "Data Analysis",
];

export const LLM_MODELS: string[] = [
  "GPT-4",
  "Claude 3.5",
  "Gemini Pro",
  "Llama 3",
];

export const COUNTRIES: string[] = [
  "Global",
  "USA",
  "UK",
  "Germany",
  "Japan",
  "Brazil",
  "India",
  "Canada",
  "France",
  "Australia",
];


/* =====================================================
   MOCK DATA
===================================================== */

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: "per-1",
    title: "US Tech Professional",
    country: "USA",
    description:
      "A software engineer or technical product manager based in the US.",
    created_at: new Date(
      Date.now() - 86400000 * 20
    ).toISOString(),
  },
  {
    id: "per-2",
    title: "German Retail Shopper",
    country: "Germany",
    description:
      "Value-conscious consumer preferring formal communication.",
    created_at: new Date(
      Date.now() - 86400000 * 15
    ).toISOString(),
  },
  {
    id: "per-3",
    title: "Global Financial Analyst",
    country: "Global",
    description:
      "Expert in reading balance sheets and identifying market trends.",
    created_at: new Date(
      Date.now() - 86400000 * 10
    ).toISOString(),
  },
];

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: "p-101",
    question:
      "Analyze quarterly financial report and summarize risks.",
    models: ["GPT-4", "Claude 3.5"],
    personas: ["per-3"],
    tags: ["Finance", "Data Analysis"],
    created_at: new Date(
      Date.now() - 86400000 * 2
    ).toISOString(),
    status: "Active",
  },
  {
    id: "p-102",
    question:
      "Write a polite but firm email declining vendor proposal.",
    models: ["GPT-4"],
    personas: ["per-1"],
    tags: ["Communication", "Business"],
    created_at: new Date(
      Date.now() - 86400000 * 5
    ).toISOString(),
    status: "Active",
  },
  {
    id: "p-103",
    question:
      "Generate a Python script to scrape weather API.",
    models: ["Gemini Pro", "Llama 3"],
    personas: ["per-1"],
    tags: ["Coding"],
    created_at: new Date(
      Date.now() - 86400000 * 10
    ).toISOString(),
    status: "Disabled",
  },
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: "l-1",
    timestamp: new Date(
      Date.now() - 86400000 * 2
    ).toISOString(),
    user_id: "usr_admin",
    action_type: "Addition",
    details: "Created prompt p-101",
    rationale: null,
  },
];