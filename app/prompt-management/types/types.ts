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
    // country?: string; // FIX: NEED TO BE REMOVED
    location_id: string; // FIX: Should not be optional
    location_level: LocationLevel; // FIX: Should not be optional
    description: string;
    created_at: string;
}

export interface City {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  code: string | null;
  cities: City[];
}

export interface Country {
  id: string;
  name: string;
  iso_code: string;
  states: State[];
}

export enum LocationLevel {
  COUNTRY = "COUNTRY",
  STATE = "STATE",
  CITY = "CITY"
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
  location_id: string;
  location_level: LocationLevel;
  description: string;
}


export interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "purple" | "green" | "red" | "gray" | "orange";
  onRemove?: () => void;
}