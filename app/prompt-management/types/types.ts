import { ReactNode } from "react";

export type Status = "Active" | "Disabled";

export type ActionType =
  | "Addition"
  | "Disabling"
  | "Enabling"
  | "Tag Creation";


export interface Persona {
  id: string;
  title: string;
  country: string;
  description: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  question: string;
  models: string[];
  personas: string[]; // persona IDs
  tags: string[];
  created_at: string;
  status: Status;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  action_type: ActionType;
  details: string;
  rationale: string | null;
}

export interface PromptFormData {
  question: string;
  models: string[];
  personas: string[];
  tags: string[];
  isDisabled: boolean;
}

export interface PersonaFormData {
  id: string | null;
  title: string;
  country: string;
  description: string;
}


export interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "purple" | "green" | "red" | "gray" | "orange";
  onRemove?: () => void;
}