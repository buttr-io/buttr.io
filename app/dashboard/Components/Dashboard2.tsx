"use client"

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo, FC } from 'react';
import { 
  ChevronDown, MousePointer2, Award, Search, Info, LayoutGrid,
  Zap, Sparkles, Globe2, Brain, Bot, BarChart3, TrendingUp,
  LayoutDashboard, Eye, MessageSquare, Database, Menu, X,
  SmilePlus, Star, Layers, Maximize2, HelpCircle, LucideIcon,
  LogOut
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { logout } from '@/app/services/client-side-serivices/user/user';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface ModelConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  accentColor: string;
}

interface PageConfig {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface PositioningData {
  brand: string;
  chatgpt: number;
  gemini: number;
  claude: number;
  perplexity: number;
  deepseek: number;
  [key: string]: string | number;
}

interface VisibilityData {
  brand: string;
  chatgpt: number;
  claude: number;
  deepseek: number;
  gemini: number;
  perplexity: number;
  overall: number;
  [key: string]: string | number;
}

interface SentimentData {
  brand: string;
  chatgpt: number | null;
  gemini: number | null;
  claude: number | null;
  perplexity: number | null;
  deepseek: number | null;
  overall: number;
  [key: string]: string | number | null;
}

interface CategoryVisibilityData {
  brand_name: string;
  advertising: number;
  award_winning: number;
  creative: number;
  digital: number;
  ecommerce: number;
  entertainment: number;
  general: number;
  influencer_meme: number;
  integrated: number;
  other: number;
  performance: number;
  production: number;
  [key: string]: string | number;
}

interface CategoryPositioningData {
  brand_name: string;
  performance: number;
  digital: number;
  influencer_meme: number;
  creative: number;
  general: number;
  ecommerce: number;
  integrated: number;
  advertising: number;
  production: number;
  entertainment: number;
  award_winning: number;
  other: number;
  [key: string]: string | number;
}

interface SourceData {
  name: string;
  value: number;
}

interface GroupedSourceData {
  name: string;
  ChatGPT: number;
  Gemini: number;
  Claude: number;
  Perplexity: number;
  DeepSeek: number;
}

interface GenericBrandData {
  brand?: string;
  brand_name?: string;
  chatgpt?: number | null;
  gemini?: number | null;
  claude?: number | null;
  perplexity?: number | null;
  deepseek?: number | null;
  overall?: number;
  [key: string]: any;
}

// ==========================================
// 2. DATASETS & CONSTANTS
// ==========================================

const MODELS: Record<string, ModelConfig> = {
  OVERALL: { id: 'overall', name: 'Overall', icon: BarChart3, color: 'text-slate-600', bgColor: 'bg-slate-100', accentColor: 'slate' },
  CHATGPT: { id: 'chatgpt', name: 'ChatGPT', icon: Zap, color: 'text-emerald-600', bgColor: 'bg-emerald-50', accentColor: 'emerald' },
  CLAUDE: { id: 'claude', name: 'Claude', icon: Bot, color: 'text-orange-600', bgColor: 'bg-orange-50', accentColor: 'orange' },
  DEEPSEEK: { id: 'deepseek', name: 'DeepSeek', icon: Brain, color: 'text-cyan-600', bgColor: 'bg-cyan-50', accentColor: 'cyan' },
  GEMINI: { id: 'gemini', name: 'Gemini', icon: Sparkles, color: 'text-blue-600', bgColor: 'bg-blue-50', accentColor: 'blue' },
  PERPLEXITY: { id: 'perplexity', name: 'Perplexity', icon: Globe2, color: 'text-indigo-600', bgColor: 'bg-indigo-50', accentColor: 'indigo' },
};

const PAGES: PageConfig[] = [
  { id: 'positioning', name: 'Positioning', icon: LayoutDashboard },
  { id: 'visibility', name: 'Visibility', icon: Eye },
  { id: 'sentiment', name: 'Sentiment', icon: SmilePlus },
  { id: 'sources', name: 'Sources', icon: Database },
];

const CATEGORY_NAMES = [
  "advertising", "award-winning", "creative", "digital", "ecommerce", 
  "entertainment", "general", "influencer/meme", "integrated", "other", 
  "performance", "production"
];

const CATEGORY_COLORS: Record<string, string> = {
  "advertising": "#3b82f6",
  "award-winning": "#f59e0b",
  "creative": "#ec4899",
  "digital": "#10b981",
  "ecommerce": "#8b5cf6",
  "entertainment": "#f43f5e",
  "general": "#94a3b8",
  "influencer/meme": "#06b6d4",
  "integrated": "#6366f1",
  "other": "#64748b",
  "performance": "#f97316",
  "production": "#a855f7"
};

const POSITIONING_DATA = [
  { brand: "FCB Group India", chatgpt: 7.66, gemini: 7.59, claude: 6.34, perplexity: 8.97, deepseek: 9 },
  { brand: "Dentsu", chatgpt: 8.09, gemini: 7.88, claude: 4.69, perplexity: 8.72, deepseek: 9.09 },
  { brand: "Ogilvy", chatgpt: 9.88, gemini: 8.38, claude: 8.31, perplexity: 9.84, deepseek: 9.03 },
  { brand: "Schbang", chatgpt: 7.81, gemini: 8.91, claude: 5.5, perplexity: 9.84, deepseek: 9.44 },
  { brand: "Social Panga", chatgpt: 10.53, gemini: 9.06, claude: 10.06, perplexity: 10.22, deepseek: 9.88 },
  { brand: "Social Beat", chatgpt: 9.66, gemini: 9.12, claude: 9.41, perplexity: 9.47, deepseek: 10.16 },
  { brand: "FoxyMoron", chatgpt: 9, gemini: 9.69, claude: 9.81, perplexity: 10.44, deepseek: 10.41 },
  { brand: "McCann Worldgroup India", chatgpt: 10.28, gemini: 9.69, claude: 9.31, perplexity: 10.16, deepseek: 10.03 },
  { brand: "DDB Mudra Group", chatgpt: 10.59, gemini: 9.75, claude: 10.09, perplexity: 10.78, deepseek: 10.19 },
  { brand: "Leo Burnett India", chatgpt: 10.09, gemini: 10.22, claude: 8.84, perplexity: 10.44, deepseek: 9.75 },
  { brand: "Admatazz", chatgpt: 10.62, gemini: 10.22, claude: 9.94, perplexity: 10.75, deepseek: 11 },
  { brand: "Interactive Avenues", chatgpt: 10.56, gemini: 10.25, claude: 10.53, perplexity: 10.59, deepseek: 10.41 },
  { brand: "DigiChefs", chatgpt: 10.81, gemini: 10.31, claude: 10.09, perplexity: 10.38, deepseek: 10.78 },
  { brand: "Havas", chatgpt: 10.72, gemini: 10.34, claude: 10.53, perplexity: 9.97, deepseek: 10.38 },
  { brand: "Confluencr", chatgpt: 10.25, gemini: 10.41, claude: 10.38, perplexity: 10.69, deepseek: 10.69 },
  { brand: "Blink Digital", chatgpt: 10.5, gemini: 10.59, claude: 10.16, perplexity: 10.72, deepseek: 10.38 },
  { brand: "The Glitch", chatgpt: 10.44, gemini: 10.62, claude: 10.09, perplexity: 11, deepseek: 10.69 },
  { brand: "Ting", chatgpt: 10.78, gemini: 10.62, claude: 11, perplexity: 11, deepseek: 10.72 },
  { brand: "Grapes", chatgpt: 10.69, gemini: 10.69, claude: 10.28, perplexity: 11, deepseek: 11 },
  { brand: "Supari Studios", chatgpt: 10.72, gemini: 10.69, claude: 10.47, perplexity: 10.69, deepseek: 10.12 },
  { brand: "TBWA", chatgpt: 10.78, gemini: 10.69, claude: 10.75, perplexity: 11, deepseek: 10.5 },
  { brand: "Creativeland Asia", chatgpt: 11, gemini: 10.69, claude: 10, perplexity: 11, deepseek: 11 },
  { brand: "BBDO India", chatgpt: 10.59, gemini: 10.75, claude: 10.69, perplexity: 11, deepseek: 10.56 },
  { brand: "MullenLowe Lintas Group", chatgpt: 10.69, gemini: 10.75, claude: 10.59, perplexity: 10.81, deepseek: 10.81 },
  { brand: "Grey Group India", chatgpt: 11, gemini: 10.75, claude: 11, perplexity: 10.56, deepseek: 11 },
  { brand: "VML", chatgpt: 11, gemini: 10.81, claude: 10.34, perplexity: 10.78, deepseek: 10.91 },
  { brand: "Cheil", chatgpt: 10.84, gemini: 10.91, claude: 11, perplexity: 10.97, deepseek: 10.84 },
  { brand: "Talented", chatgpt: 10.78, gemini: 10.94, claude: 9.62, perplexity: 11, deepseek: 10.88 },
  { brand: "White Rivers Media", chatgpt: 10.5, gemini: 11, claude: 10.69, perplexity: 10.75, deepseek: 9.94 },
  { brand: "Gozoop Group", chatgpt: 10.56, gemini: 11, claude: 10.53, perplexity: 10.75, deepseek: 11 },
  { brand: "SoCheers", chatgpt: 10.75, gemini: 11, claude: 10.72, perplexity: 11, deepseek: 9.59 },
  { brand: "Publicis Groupe", chatgpt: 10.91, gemini: 11, claude: 10.72, perplexity: 11, deepseek: 11 },
  { brand: "BBH India", chatgpt: 11, gemini: 11, claude: 11, perplexity: 10.59, deepseek: 10.91 },
  { brand: "Sociowash", chatgpt: 11, gemini: 11, claude: 11, perplexity: 11, deepseek: 10.47 },
  { brand: "The Rabbit Hole", chatgpt: 11, gemini: 11, claude: 11, perplexity: 11, deepseek: 10.41 },
  { brand: "Tonic Worldwide", chatgpt: 11, gemini: 11, claude: 9.84, perplexity: 10.78, deepseek: 11 },
  { brand: "Digitas", chatgpt: 11, gemini: 11, claude: 11, perplexity: 10.72, deepseek: 11 },
  { brand: "WPP", chatgpt: 11, gemini: 11, claude: 10.69, perplexity: 11, deepseek: 10.72 },
  { brand: "Interpublic Group", chatgpt: 11, gemini: 11, claude: 10.75, perplexity: 11, deepseek: 11 },
];

const VISIBILITY_DATA = [
  { brand: "Dentsu", chatgpt: 34.38, claude: 71.88, deepseek: 21.88, gemini: 37.5, perplexity: 25, overall: 34.95 },
  { brand: "FCB Group India", chatgpt: 40.62, claude: 56.25, deepseek: 25, gemini: 43.75, perplexity: 25, overall: 40.53 },
  { brand: "Schbang", chatgpt: 37.5, claude: 65.62, deepseek: 18.75, gemini: 25, perplexity: 12.5, overall: 31.03 },
  { brand: "Ogilvy", chatgpt: 12.5, claude: 31.25, deepseek: 21.88, gemini: 28.12, perplexity: 12.5, overall: 18.97 },
  { brand: "Social Beat", chatgpt: 18.75, claude: 21.88, deepseek: 9.38, gemini: 21.88, perplexity: 18.75, overall: 19.58 },
  { brand: "FoxyMoron", chatgpt: 28.12, claude: 18.75, deepseek: 6.25, gemini: 15.62, perplexity: 9.38, overall: 21.46 },
  { brand: "Leo Burnett India", chatgpt: 12.5, claude: 28.12, deepseek: 15.62, gemini: 9.38, perplexity: 6.25, overall: 11.29 },
  { brand: "McCann Worldgroup India", chatgpt: 9.38, claude: 21.88, deepseek: 12.5, gemini: 15.62, perplexity: 9.38, overall: 11.99 },
  { brand: "Social Panga", chatgpt: 9.38, claude: 12.5, deepseek: 12.5, gemini: 21.88, perplexity: 9.38, overall: 14.26 },
  { brand: "DDB Mudra Group", chatgpt: 6.25, claude: 15.62, deepseek: 9.38, gemini: 15.62, perplexity: 3.12, overall: 9.85 },
  { brand: "Havas", chatgpt: 3.12, claude: 6.25, deepseek: 6.25, gemini: 9.38, perplexity: 15.62, overall: 6.28 },
  { brand: "DigiChefs", chatgpt: 3.12, claude: 12.5, deepseek: 3.12, gemini: 9.38, perplexity: 9.38, overall: 5.9 },
  { brand: "Interactive Avenues", chatgpt: 6.25, claude: 6.25, deepseek: 6.25, gemini: 9.38, perplexity: 6.25, overall: 7.43 },
  { brand: "Blink Digital", chatgpt: 6.25, claude: 12.5, deepseek: 6.25, gemini: 6.25, perplexity: 3.12, overall: 6.15 },
  { brand: "Admatazz", chatgpt: 6.25, claude: 12.5, deepseek: 0, gemini: 9.38, perplexity: 3.12, overall: 7.08 },
  { brand: "Confluencr", chatgpt: 9.38, claude: 6.25, deepseek: 3.12, gemini: 6.25, perplexity: 3.12, overall: 7.59 },
  { brand: "Talented", chatgpt: 3.12, claude: 18.75, deepseek: 3.12, gemini: 3.12, perplexity: 0, overall: 3.12 },
  { brand: "White Rivers Media", chatgpt: 6.25, claude: 3.12, deepseek: 12.5, gemini: 0, perplexity: 6.25, overall: 4.11 },
  { brand: "The Glitch", chatgpt: 6.25, claude: 12.5, deepseek: 3.12, gemini: 6.25, perplexity: 0, overall: 5.87 },
  { brand: "VML", chatgpt: 0, claude: 12.5, deepseek: 3.12, gemini: 3.12, perplexity: 6.25, overall: 1.75 },
  { brand: "Supari Studios", chatgpt: 3.12, claude: 6.25, deepseek: 9.38, gemini: 3.12, perplexity: 3.12, overall: 3.41 },
  { brand: "Tonic Worldwide", chatgpt: 0, claude: 21.88, deepseek: 0, gemini: 0, perplexity: 3.12, overall: 0.38 },
  { brand: "BBDO India", chatgpt: 6.25, claude: 6.25, deepseek: 6.25, gemini: 3.12, perplexity: 0, overall: 4.75 },
  { brand: "MullenLowe Lintas Group", chatgpt: 3.12, claude: 9.38, deepseek: 3.12, gemini: 3.12, perplexity: 3.12, overall: 3.18 },
  { brand: "SoCheers", chatgpt: 3.12, claude: 3.12, deepseek: 15.62, gemini: 0, perplexity: 0, overall: 2.29 },
  { brand: "Creativeland Asia", chatgpt: 0, claude: 15.62, deepseek: 0, gemini: 3.12, perplexity: 0, overall: 1.34 },
  { brand: "Grapes", chatgpt: 3.12, claude: 12.5, deepseek: 0, gemini: 3.12, perplexity: 0, overall: 2.93 },
  { brand: "TBWA", chatgpt: 6.25, claude: 3.12, deepseek: 6.25, gemini: 3.12, perplexity: 0, overall: 4.72 },
  { brand: "Gozoop Group", chatgpt: 6.25, claude: 6.25, deepseek: 0, gemini: 0, perplexity: 3.12, overall: 3.48 },
  { brand: "Cheil", chatgpt: 3.12, claude: 0, deepseek: 3.12, gemini: 3.12, perplexity: 3.12, overall: 3.09 },
  { brand: "BBH India", chatgpt: 0, claude: 0, deepseek: 3.12, gemini: 0, perplexity: 6.25, overall: 0.45 },
  { brand: "Grey Group India", chatgpt: 0, claude: 0, deepseek: 0, gemini: 3.12, perplexity: 6.25, overall: 1.5 },
  { brand: "The Rabbit Hole", chatgpt: 0, claude: 0, deepseek: 6.25, gemini: 0, perplexity: 0, overall: 0.26 },
  { brand: "Sociowash", chatgpt: 0, claude: 0, deepseek: 6.25, gemini: 0, perplexity: 0, overall: 0.26 },
  { brand: "Publicis Groupe", chatgpt: 3.12, claude: 3.12, deepseek: 0, gemini: 0, perplexity: 0, overall: 1.66 },
  { brand: "Ting", chatgpt: 3.12, claude: 0, deepseek: 0, gemini: 3.12, perplexity: 0, overall: 2.8 },
  { brand: "WPP", chatgpt: 0, claude: 3.12, deepseek: 3.12, gemini: 0, perplexity: 0, overall: 0.16 },
  { brand: "Interpublic Group", chatgpt: 0, claude: 3.12, deepseek: 0, gemini: 0, perplexity: 0, overall: 0.03 },
  { brand: "Digitas", chatgpt: 0, claude: 0, deepseek: 0, gemini: 0, perplexity: 3.12, overall: 0.16 },
];

const SENTIMENT_DATA = [
  { brand: "Dentsu", chatgpt: 0.602, gemini: 0.623, claude: 0.737, perplexity: 0.686, deepseek: 0.703, overall: 0.62 },
  { brand: "Schbang", chatgpt: 0.748, gemini: 0.802, claude: 0.748, perplexity: 0.707, deepseek: 0.674, overall: 0.763 },
  { brand: "FCB Group India", chatgpt: 0.789, gemini: 0.816, claude: 0.816, perplexity: 0.779, deepseek: 0.818, overall: 0.8 },
  { brand: "Ogilvy", chatgpt: 0.777, gemini: 0.816, claude: 0.85, perplexity: 0.939, deepseek: 0.908, overall: 0.806 },
  { brand: "Social Beat", chatgpt: 0.577, gemini: 0.666, claude: 0.812, perplexity: 0.775, deepseek: 0.812, overall: 0.633 },
  { brand: "FoxyMoron", chatgpt: 0.554, gemini: 0.63, claude: 0.733, perplexity: 0.676, deepseek: 0.746, overall: 0.599 },
  { brand: "Social Panga", chatgpt: 0.767, gemini: 0.867, claude: 0.851, perplexity: 0.893, deepseek: 0.765, overall: 0.812 },
  { brand: "White Rivers Media", chatgpt: 0.748, gemini: 0.725, claude: 0.789, perplexity: 0.934, deepseek: 0.805, overall: 0.752 },
  { brand: "SoCheers", chatgpt: 0.948, gemini: 0.915, claude: 0.738, perplexity: 0.94, deepseek: 0.905, overall: 0.931 },
  { brand: "Leo Burnett India", chatgpt: 0.849, gemini: 0.553, claude: 0.813, perplexity: 0.626, deepseek: 0.759, overall: 0.722 },
  { brand: "McCann Worldgroup India", chatgpt: 0.923, gemini: 0.652, claude: 0.857, perplexity: 0.928, deepseek: 0.756, overall: 0.813 },
  { brand: "Talented", chatgpt: 0.965, gemini: 0.929, claude: 0.773, perplexity: null, deepseek: 0.847, overall: 0.944 },
  { brand: "DDB Mudra Group", chatgpt: 0.81, gemini: 0.752, claude: 0.681, perplexity: 0.749, deepseek: 0.906, overall: 0.788 },
  { brand: "Publicis Groupe", chatgpt: 0.494, gemini: 0.025, claude: 0.581, perplexity: 0.572, deepseek: 0.811, overall: 0.335 },
  { brand: "Gozoop Group", chatgpt: 0.43, gemini: null, claude: 0.724, perplexity: 0.778, deepseek: 0.5, overall: 0.468 },
  { brand: "WPP", chatgpt: 0.324, gemini: 0.125, claude: 0.699, perplexity: null, deepseek: 0.728, overall: 0.266 },
  { brand: "MullenLowe Lintas Group", chatgpt: 0.346, gemini: 0.754, claude: 0.947, perplexity: 0.84, deepseek: 0.688, overall: 0.545 },
  { brand: "Interactive Avenues", chatgpt: 0.675, gemini: 0.905, claude: 0.527, perplexity: 0.616, deepseek: 0.943, overall: 0.768 },
  { brand: "Havas", chatgpt: 0.734, gemini: 0.831, claude: 0.951, perplexity: 0.887, deepseek: 0.845, overall: 0.785 },
  { brand: "The Glitch", chatgpt: 0.624, gemini: 0.591, claude: 0.897, perplexity: null, deepseek: 0.655, overall: 0.615 },
  { brand: "VML", chatgpt: 0.595, gemini: 0.453, claude: 0.782, perplexity: 0.833, deepseek: 0.828, overall: 0.565 },
  { brand: "Admatazz", chatgpt: 0.785, gemini: 0.858, claude: 0.739, perplexity: 0.956, deepseek: null, overall: 0.822 },
  { brand: "DigiChefs", chatgpt: 0.856, gemini: 0.896, claude: 0.754, perplexity: 0.244, deepseek: 0.874, overall: 0.84 },
  { brand: "Blink Digital", chatgpt: 0.78, gemini: 0.918, claude: 0.955, perplexity: 0.99, deepseek: 0.865, overall: 0.848 },
  { brand: "BBDO India", chatgpt: 0.966, gemini: 0.586, claude: 0.798, perplexity: 0.718, deepseek: 0.785, overall: 0.801 },
  { brand: "Interpublic Group", chatgpt: 0.303, gemini: 0, claude: 0.376, perplexity: null, deepseek: 0.587, overall: 0.195 },
  { brand: "Grapes", chatgpt: 0.84, gemini: 0.404, claude: 0.699, perplexity: null, deepseek: 0.68, overall: 0.658 },
  { brand: "Confluencr", chatgpt: 0.259, gemini: 0.671, claude: 0.722, perplexity: 0.923, deepseek: 0.844, overall: 0.477 },
  { brand: "Tonic Worldwide", chatgpt: null, gemini: 0, claude: 0.782, perplexity: 0.765, deepseek: null, overall: 0.107 },
  { brand: "TBWA", chatgpt: 0.893, gemini: 0.379, claude: 0.966, perplexity: 0.772, deepseek: 0.917, overall: 0.694 },
  { brand: "Supari Studios", chatgpt: 0.985, gemini: 0.994, claude: 0.928, perplexity: 0.96, deepseek: 0.977, overall: 0.986 },
  { brand: "Creativeland Asia", chatgpt: null, gemini: 0.972, claude: 0.918, perplexity: null, deepseek: null, overall: 0.971 },
  { brand: "BBH India", chatgpt: null, gemini: null, claude: null, perplexity: 0.867, deepseek: 0.774, overall: 0.826 },
  { brand: "Grey Group India", chatgpt: null, gemini: 0.708, claude: null, perplexity: 0.872, deepseek: 0.807, overall: 0.734 },
  { brand: "Cheil", chatgpt: 0.908, gemini: 0.44, claude: null, perplexity: 0.7, deepseek: 0.967, overall: 0.721 },
  { brand: "Ting", chatgpt: 0.859, gemini: 0.85, claude: null, perplexity: null, deepseek: 0.958, overall: 0.86 },
  { brand: "Sociowash", chatgpt: null, gemini: null, claude: null, perplexity: null, deepseek: 0.958, overall: 0.958 },
  { brand: "The Rabbit Hole", chatgpt: null, gemini: null, claude: null, perplexity: null, deepseek: 0.925, overall: 0.925 },
];

const CATEGORY_VISIBILITY_DATA: CategoryVisibilityData[] = [
  { brand_name: "Dentsu", advertising: 1.25, award_winning: 3.12, creative: 2.5, digital: 8.75, ecommerce: 0, entertainment: 1.25, general: 21.25, influencer_meme: 1.25, integrated: 2.5, other: 0, performance: 3.75, production: 1.25 },
  { brand_name: "FCB Group India", advertising: 0.62, award_winning: 3.12, creative: 5, digital: 8.75, ecommerce: 0, entertainment: 0, general: 21.88, influencer_meme: 0.62, integrated: 3.12, other: 0.62, performance: 1.25, production: 0.62 },
  { brand_name: "Schbang", advertising: 1.25, award_winning: 0.62, creative: 2.5, digital: 5, ecommerce: 0, entertainment: 0.62, general: 19.38, influencer_meme: 1.25, integrated: 2.5, other: 0.62, performance: 1.25, production: 0.62 },
  { brand_name: "Ogilvy", advertising: 1.88, award_winning: 4.38, creative: 5, digital: 1.88, ecommerce: 0, entertainment: 0.62, general: 8.12, influencer_meme: 0, integrated: 3.12, other: 0, performance: 0, production: 0 },
  { brand_name: "Social Beat", advertising: 0.62, award_winning: 0.62, creative: 0.62, digital: 3.75, ecommerce: 0, entertainment: 1.25, general: 10, influencer_meme: 0.62, integrated: 1.25, other: 0, performance: 1.88, production: 0.62 },
  { brand_name: "FoxyMoron", advertising: 0, award_winning: 0, creative: 1.88, digital: 1.88, ecommerce: 0, entertainment: 1.25, general: 10, influencer_meme: 0, integrated: 0.62, other: 0.62, performance: 1.25, production: 0 },
  { brand_name: "Leo Burnett India", advertising: 1.88, award_winning: 2.5, creative: 3.75, digital: 0.62, ecommerce: 0, entertainment: 0, general: 5.62, influencer_meme: 0, integrated: 1.88, other: 0, performance: 0, production: 0.62 },
  { brand_name: "McCann Worldgroup India", advertising: 1.88, award_winning: 2.5, creative: 3.75, digital: 0.62, ecommerce: 0, entertainment: 0, general: 5, influencer_meme: 0, integrated: 1.88, other: 0, performance: 0, production: 0 },
  { brand_name: "Social Panga", advertising: 0, award_winning: 0.62, creative: 1.88, digital: 5, ecommerce: 0, entertainment: 0, general: 4.38, influencer_meme: 1.25, integrated: 1.25, other: 0, performance: 1.25, production: 0.62 },
  { brand_name: "DDB Mudra Group", advertising: 1.25, award_winning: 1.88, creative: 3.12, digital: 0.62, ecommerce: 0, entertainment: 0.62, general: 1.88, influencer_meme: 0.62, integrated: 1.25, other: 0, performance: 0, production: 0 },
  { brand_name: "Havas", advertising: 0, award_winning: 1.25, creative: 2.5, digital: 0.62, ecommerce: 0, entertainment: 0, general: 4.38, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "DigiChefs", advertising: 0, award_winning: 0, creative: 0, digital: 2.5, ecommerce: 0.62, entertainment: 0, general: 5, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0.62 },
  { brand_name: "Interactive Avenues", advertising: 0, award_winning: 0.62, creative: 0, digital: 2.5, ecommerce: 0, entertainment: 0, general: 3.75, influencer_meme: 0, integrated: 0, other: 0, performance: 0.62, production: 0 },
  { brand_name: "Blink Digital", advertising: 0.62, award_winning: 0.62, creative: 0, digital: 1.25, ecommerce: 0, entertainment: 0, general: 4.38, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Admatazz", advertising: 0, award_winning: 0, creative: 0, digital: 2.5, ecommerce: 0.62, entertainment: 0, general: 3.75, influencer_meme: 0, integrated: 0, other: 0, performance: 0.62, production: 0 },
  { brand_name: "Confluencr", advertising: 0, award_winning: 0, creative: 0, digital: 0.62, ecommerce: 0, entertainment: 0, general: 1.88, influencer_meme: 2.5, integrated: 0.62, other: 0, performance: 0, production: 0 },
  { brand_name: "Talented", advertising: 0.62, award_winning: 1.25, creative: 1.25, digital: 0.62, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 1.25, other: 0, performance: 0, production: 0.62 },
  { brand_name: "White Rivers Media", advertising: 0, award_winning: 0.62, creative: 0, digital: 0.62, ecommerce: 0, entertainment: 0.62, general: 2.5, influencer_meme: 0, integrated: 0, other: 0, performance: 0.62, production: 0.62 },
  { brand_name: "The Glitch", advertising: 0, award_winning: 0.62, creative: 0.62, digital: 0, ecommerce: 0, entertainment: 0.62, general: 3.12, influencer_meme: 0, integrated: 0.62, other: 0, performance: 0, production: 0 },
  { brand_name: "VML", advertising: 0, award_winning: 1.25, creative: 1.88, digital: 0, ecommerce: 0, entertainment: 0, general: 1.88, influencer_meme: 0, integrated: 1.25, other: 0, performance: 0, production: 0 },
  { brand_name: "Supari Studios", advertising: 0.62, award_winning: 0, creative: 0.62, digital: 0.62, ecommerce: 0, entertainment: 0, general: 3.12, influencer_meme: 0, integrated: 0.62, other: 0.62, performance: 0, production: 0 },
  { brand_name: "Tonic Worldwide", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 4.38, influencer_meme: 0, integrated: 0.62, other: 0, performance: 0, production: 0 },
  { brand_name: "BBDO India", advertising: 0, award_winning: 0.62, creative: 1.25, digital: 1.25, ecommerce: 0, entertainment: 0, general: 1.88, influencer_meme: 0, integrated: 1.25, other: 0, performance: 0, production: 0 },
  { brand_name: "MullenLowe Lintas Group", advertising: 0, award_winning: 1.88, creative: 0.62, digital: 0, ecommerce: 0, entertainment: 0.62, general: 1.25, influencer_meme: 0, integrated: 0.62, other: 0, performance: 0, production: 0.62 },
  { brand_name: "SoCheers", advertising: 0.62, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0.62, general: 3.12, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Creativeland Asia", advertising: 0.62, award_winning: 0, creative: 0.62, digital: 0, ecommerce: 0, entertainment: 0, general: 1.88, influencer_meme: 0, integrated: 0.62, other: 0, performance: 0, production: 0.62 },
  { brand_name: "Grapes", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 3.12, influencer_meme: 0, integrated: 0, other: 0, performance: 0.62, production: 0 },
  { brand_name: "TBWA", advertising: 0, award_winning: 1.25, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 2.5, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Gozoop Group", advertising: 0, award_winning: 0, creative: 0, digital: 0.62, ecommerce: 0.62, entertainment: 0, general: 2.5, influencer_meme: 0, integrated: 0, other: 0.62, performance: 0, production: 0 },
  { brand_name: "Cheil", advertising: 0, award_winning: 0, creative: 0.62, digital: 0, ecommerce: 0, entertainment: 0, general: 1.88, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "BBH India", advertising: 0, award_winning: 0.62, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Grey Group India", advertising: 0.62, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "The Rabbit Hole", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 0.62, influencer_meme: 0, integrated: 0, other: 0, performance: 0.62, production: 0 },
  { brand_name: "Sociowash", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Publicis Groupe", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Ting", advertising: 0.62, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 0.62, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "WPP", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 1.25, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Interpublic Group", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 0.62, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
  { brand_name: "Digitas", advertising: 0, award_winning: 0, creative: 0, digital: 0, ecommerce: 0, entertainment: 0, general: 0.62, influencer_meme: 0, integrated: 0, other: 0, performance: 0, production: 0 },
];

const CATEGORY_POSITIONING_DATA: CategoryPositioningData[] = [
  { brand_name: "FCB Group India", performance: 3, digital: 1, influencer_meme: 7, creative: 3, general: 1, ecommerce: 1, integrated: 2, advertising: 7, production: 4, entertainment: 10, award_winning: 8, other: 3 },
  { brand_name: "Dentsu", performance: 1, digital: 2, influencer_meme: 5, creative: 14, general: 2, ecommerce: 2, integrated: 6, advertising: 11, production: 3, entertainment: 1, award_winning: 6, other: 9 },
  { brand_name: "Schbang", performance: 6, digital: 6, influencer_meme: 2, creative: 5, general: 3, ecommerce: 3, integrated: 5, advertising: 10, production: 14, entertainment: 3, award_winning: 17, other: 1 },
  { brand_name: "FoxyMoron", performance: 4, digital: 14, influencer_meme: 15, creative: 8, general: 4, ecommerce: 4, integrated: 10, advertising: 17, production: 20, entertainment: 2, award_winning: 16, other: 2 },
  { brand_name: "Social Beat", performance: 2, digital: 5, influencer_meme: 6, creative: 17, general: 5, ecommerce: 5, integrated: 11, advertising: 8, production: 1, entertainment: 5, award_winning: 3, other: 6 },
  { brand_name: "Ogilvy", performance: 8, digital: 8, influencer_meme: 10, creative: 1, general: 6, ecommerce: 6, integrated: 1, advertising: 1, production: 7, entertainment: 11, award_winning: 1, other: 4 },
  { brand_name: "Leo Burnett India", performance: 10, digital: 20, influencer_meme: 20, creative: 6, general: 7, ecommerce: 7, integrated: 7, advertising: 4, production: 10, entertainment: 14, award_winning: 11, other: 13 },
  { brand_name: "McCann Worldgroup India", performance: 9, digital: 16, influencer_meme: 17, creative: 7, general: 8, ecommerce: 8, integrated: 8, advertising: 2, production: 8, entertainment: 12, award_winning: 4, other: 7 },
  { brand_name: "Confluencr", performance: 12, digital: 12, influencer_meme: 3, creative: 16, general: 9, ecommerce: 9, integrated: 13, advertising: 19, production: 22, entertainment: 23, award_winning: 27, other: 27 },
  { brand_name: "The Glitch", performance: 16, digital: 21, influencer_meme: 21, creative: 25, general: 10, ecommerce: 10, integrated: 14, advertising: 20, production: 23, entertainment: 4, award_winning: 10, other: 12 },
  { brand_name: "Social Panga", performance: 5, digital: 3, influencer_meme: 4, creative: 9, general: 11, ecommerce: 11, integrated: 9, advertising: 16, production: 19, entertainment: 21, award_winning: 9, other: 11 },
  { brand_name: "Blink Digital", performance: 17, digital: 10, influencer_meme: 12, creative: 21, general: 12, ecommerce: 12, integrated: 15, advertising: 12, production: 15, entertainment: 18, award_winning: 24, other: 24 },
  { brand_name: "White Rivers Media", performance: 7, digital: 19, influencer_meme: 19, creative: 24, general: 13, ecommerce: 13, integrated: 16, advertising: 21, production: 5, entertainment: 6, award_winning: 12, other: 14 },
  { brand_name: "Interactive Avenues", performance: 13, digital: 9, influencer_meme: 11, creative: 20, general: 14, ecommerce: 14, integrated: 17, advertising: 22, production: 24, entertainment: 24, award_winning: 5, other: 8 },
  { brand_name: "Gozoop Group", performance: 25, digital: 25, influencer_meme: 25, creative: 28, general: 15, ecommerce: 15, integrated: 18, advertising: 23, production: 25, entertainment: 25, award_winning: 28, other: 28 },
  { brand_name: "BBDO India", performance: 19, digital: 13, influencer_meme: 14, creative: 15, general: 16, ecommerce: 16, integrated: 12, advertising: 18, production: 21, entertainment: 22, award_winning: 26, other: 26 },
  { brand_name: "Admatazz", performance: 14, digital: 4, influencer_meme: 8, creative: 18, general: 17, ecommerce: 17, integrated: 19, advertising: 24, production: 26, entertainment: 26, award_winning: 29, other: 29 },
  { brand_name: "Havas", performance: 15, digital: 15, influencer_meme: 16, creative: 4, general: 18, ecommerce: 18, integrated: 20, advertising: 25, production: 27, entertainment: 27, award_winning: 14, other: 16 },
  { brand_name: "Supari Studios", performance: 20, digital: 11, influencer_meme: 13, creative: 22, general: 19, ecommerce: 19, integrated: 21, advertising: 13, production: 16, entertainment: 19, award_winning: 25, other: 25 },
  { brand_name: "MullenLowe Lintas Group", performance: 22, digital: 23, influencer_meme: 23, creative: 10, general: 20, ecommerce: 20, integrated: 4, advertising: 15, production: 18, entertainment: 20, award_winning: 13, other: 15 },
  { brand_name: "Grapes", performance: 21, digital: 22, influencer_meme: 22, creative: 26, general: 21, ecommerce: 21, integrated: 22, advertising: 26, production: 2, entertainment: 9, award_winning: 20, other: 20 },
  { brand_name: "SoCheers", performance: 26, digital: 26, influencer_meme: 26, creative: 29, general: 22, ecommerce: 22, integrated: 23, advertising: 14, production: 17, entertainment: 8, award_winning: 19, other: 19 },
  { brand_name: "DigiChefs", performance: 18, digital: 7, influencer_meme: 9, creative: 19, general: 23, ecommerce: 23, integrated: 24, advertising: 27, production: 28, entertainment: 28, award_winning: 30, other: 30 },
  { brand_name: "Ting", performance: 23, digital: 17, influencer_meme: 18, creative: 23, general: 24, ecommerce: 24, integrated: 25, advertising: 6, production: 12, entertainment: 16, award_winning: 22, other: 22 },
  { brand_name: "TBWA", performance: 24, digital: 24, influencer_meme: 24, creative: 27, general: 25, ecommerce: 25, integrated: 26, advertising: 28, production: 29, entertainment: 29, award_winning: 2, other: 5 },
  { brand_name: "Talented", performance: 27, digital: 27, influencer_meme: 27, creative: 13, general: 26, ecommerce: 26, integrated: 27, advertising: 29, production: 30, entertainment: 30, award_winning: 15, other: 17 },
  { brand_name: "Cheil", performance: 28, digital: 28, influencer_meme: 28, creative: 12, general: 27, ecommerce: 27, integrated: 28, advertising: 30, production: 31, entertainment: 31, award_winning: 31, other: 31 },
  { brand_name: "DDB Mudra Group", performance: 11, digital: 18, influencer_meme: 1, creative: 2, general: 28, ecommerce: 28, integrated: 3, advertising: 3, production: 9, entertainment: 13, award_winning: 7, other: 10 },
  { brand_name: "Publicis Groupe", performance: 32, digital: 32, influencer_meme: 32, creative: 32, general: 29, ecommerce: 29, integrated: 29, advertising: 31, production: 32, entertainment: 32, award_winning: 32, other: 32 },
  { brand_name: "Grey Group India", performance: 30, digital: 30, influencer_meme: 30, creative: 31, general: 30, ecommerce: 30, integrated: 30, advertising: 9, production: 13, entertainment: 17, award_winning: 23, other: 23 },
  { brand_name: "BBH India", performance: 33, digital: 33, influencer_meme: 33, creative: 33, general: 31, ecommerce: 31, integrated: 31, advertising: 32, production: 33, entertainment: 33, award_winning: 33, other: 33 },
  { brand_name: "Sociowash", performance: 34, digital: 34, influencer_meme: 34, creative: 34, general: 32, ecommerce: 32, integrated: 32, advertising: 33, production: 34, entertainment: 34, award_winning: 34, other: 34 },
  { brand_name: "Tonic Worldwide", performance: 36, digital: 36, influencer_meme: 36, creative: 36, general: 33, ecommerce: 33, integrated: 33, advertising: 34, production: 35, entertainment: 35, award_winning: 35, other: 35 },
  { brand_name: "VML", performance: 31, digital: 31, influencer_meme: 31, creative: 11, general: 34, ecommerce: 34, integrated: 34, advertising: 35, production: 36, entertainment: 36, award_winning: 36, other: 36 },
  { brand_name: "Digitas", performance: 37, digital: 37, influencer_meme: 37, creative: 37, general: 35, ecommerce: 35, integrated: 35, advertising: 36, production: 37, entertainment: 37, award_winning: 37, other: 37 },
  { brand_name: "WPP", performance: 38, digital: 38, influencer_meme: 38, creative: 38, general: 36, ecommerce: 36, integrated: 36, advertising: 37, production: 38, entertainment: 38, award_winning: 38, other: 38 },
  { brand_name: "Creativeland Asia", performance: 29, digital: 29, influencer_meme: 29, creative: 30, general: 37, ecommerce: 37, integrated: 37, advertising: 5, production: 11, entertainment: 15, award_winning: 21, other: 21 },
  { brand_name: "The Rabbit Hole", performance: 35, digital: 35, influencer_meme: 35, creative: 35, general: 38, ecommerce: 38, integrated: 38, advertising: 38, production: 6, entertainment: 7, award_winning: 18, other: 18 },
  { brand_name: "Interpublic Group", performance: 39, digital: 39, influencer_meme: 39, creative: 39, general: 39, ecommerce: 39, integrated: 39, advertising: 39, production: 39, entertainment: 39, award_winning: 39, other: 39 },
];

const OVERALL_TOTALITY_DATA = [
  { name: 'clutch.co', value: 2.67 },
  { name: 'noirandblanco.com', value: 2.55 },
  { name: 'linkedin.com', value: 2.09 },
  { name: 'agencies.semrush.com', value: 1.97 },
  { name: 'designrush.com', value: 1.97 },
  { name: 'en.wikipedia.org', value: 1.74 },
  { name: 'campaignindia.in', value: 1.51 },
  { name: 'indiantelevision.com', value: 1.39 },
  { name: 'aninews.in', value: 1.39 },
  { name: 'brandequity.economictimes...', value: 1.28 }
];

const OVERALL_WEIGHTED_DATA = [
  { name: 'en.wikipedia.org', value: 28.4 },
  { name: 'noirandblanco.com', value: 28.31 },
  { name: 'clutch.co', value: 15.8 },
  { name: 'linkedin.com', value: 9.03 },
  { name: 'brandequity.economictimes...', value: 6.68 },
  { name: 'campaignindia.in', value: 4.85 },
  { name: 'designrush.com', value: 3.72 },
  { name: 'agencies.semrush.com', value: 1.54 },
  { name: 'indiantelevision.com', value: 0.86 },
  { name: 'aninews.in', value: 0.81 }
];

const OVERALL_LLM_GROUPED = [
  { name: 'clutch.co', ChatGPT: 0, Gemini: 37.5, Claude: 0, Perplexity: 26.32, DeepSeek: 3.28 },
  { name: 'noirandblanco.com', ChatGPT: 11.54, Gemini: 56.25, Claude: 0, Perplexity: 8.77, DeepSeek: 8.2 },
  { name: 'linkedin.com', ChatGPT: 15.38, Gemini: 0, Claude: 0, Perplexity: 0, DeepSeek: 22.95 },
  { name: 'agencies.semrush.com', ChatGPT: 0, Gemini: 0, Claude: 0, Perplexity: 29.82, DeepSeek: 0 },
  { name: 'designrush.com', ChatGPT: 0, Gemini: 6.25, Claude: 0, Perplexity: 19.3, DeepSeek: 8.2 },
  { name: 'en.wikipedia.org', ChatGPT: 53.85, Gemini: 0, Claude: 0, Perplexity: 1.75, DeepSeek: 0 },
  { name: 'campaignindia.in', ChatGPT: 7.69, Gemini: 0, Claude: 0, Perplexity: 5.26, DeepSeek: 13.11 },
  { name: 'indiantelevision.com', ChatGPT: 0, Gemini: 0, Claude: 0, Perplexity: 3.51, DeepSeek: 16.39 },
  { name: 'aninews.in', ChatGPT: 0, Gemini: 0, Claude: 0, Perplexity: 0, DeepSeek: 19.67 },
  { name: 'brandequity.economictimes...', ChatGPT: 11.54, Gemini: 0, Claude: 0, Perplexity: 5.26, DeepSeek: 8.2 }
];

const SOCHEERS_TOTALITY_DATA = [
  { name: 'socheers.net', value: 5.13 },
  { name: 'linkedin.com', value: 3.9 },
  { name: 'cbinsights.com', value: 3.9 },
  { name: 'careers.socheers.net', value: 3.7 },
  { name: 'socialsamosa.com', value: 3.7 },
  { name: 'afaqs.com', value: 3.49 },
  { name: 'ambitionbox.com', value: 3.29 },
  { name: 'bestmediainfo.com', value: 3.29 },
  { name: 'tracxn.com', value: 2.87 },
  { name: 'adgully.com', value: 2.67 }
];

const SOCHEERS_WEIGHTED_DATA = [
  { name: 'careers.socheers.net', value: 33.23 },
  { name: 'socheers.net', value: 28.85 },
  { name: 'socialsamosa.com', value: 16.7 },
  { name: 'bestmediainfo.com', value: 11.81 },
  { name: 'adgully.com', value: 3.32 },
  { name: 'afaqs.com', value: 2.54 },
  { name: 'cbinsights.com', value: 1.21 },
  { name: 'linkedin.com', value: 0.99 },
  { name: 'ambitionbox.com', value: 0.84 },
  { name: 'tracxn.com', value: 0.51 }
];

const SOCHEERS_LLM_GROUPED = [
  { name: 'socheers.net', ChatGPT: 10, Gemini: 60.71, Claude: 11.9, Perplexity: 11.76, DeepSeek: 0 },
  { name: 'linkedin.com', ChatGPT: 0, Gemini: 0, Claude: 0, Perplexity: 0, DeepSeek: 24.36 },
  { name: 'cbinsights.com', ChatGPT: 0, Gemini: 0, Claude: 2.38, Perplexity: 5.88, DeepSeek: 21.79 },
  { name: 'careers.socheers.net', ChatGPT: 60, Gemini: 0, Claude: 9.52, Perplexity: 35.29, DeepSeek: 2.56 },
  { name: 'socialsamosa.com', ChatGPT: 20, Gemini: 14.29, Claude: 19.05, Perplexity: 11.76, DeepSeek: 2.56 },
  { name: 'afaqs.com', ChatGPT: 0, Gemini: 3.57, Claude: 11.9, Perplexity: 11.76, DeepSeek: 11.54 },
  { name: 'ambitionbox.com', ChatGPT: 0, Gemini: 0, Claude: 0, Perplexity: 0, DeepSeek: 20.51 },
  { name: 'bestmediainfo.com', ChatGPT: 10, Gemini: 14.29, Claude: 9.52, Perplexity: 17.65, DeepSeek: 5.13 },
  { name: 'tracxn.com', ChatGPT: 0, Gemini: 0, Claude: 19.05, Perplexity: 0, DeepSeek: 7.69 },
  { name: 'adgully.com', ChatGPT: 0, Gemini: 7.14, Claude: 16.67, Perplexity: 5.88, DeepSeek: 3.85 }
];

const SOURCES_COLORS = {
  bg: '#fff3c1',
  lightGreen: '#cce3b2',
  darkGreen: '#7ba67e',
  lightOrange: '#ffe4bd',
  lightRed: '#ffbdbd',
  darkBlue: '#1800ad'
};

// ==========================================
// 2. HELPER FUNCTIONS & SHARED COMPONENTS
// ==========================================

const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const getValue = (item: any, activeModel: string, pageType: string): string => {
  if (!item) return "N/A";
  const key = activeModel.toLowerCase();
  if (pageType === 'positioning') {
    if (activeModel === 'OVERALL') {
      const avg = ((item.chatgpt || 0) + (item.gemini || 0) + (item.claude || 0) + (item.perplexity || 0) + (item.deepseek || 0)) / 5;
      return avg.toFixed(2);
    }
    return item[key] ? (item[key] as number).toFixed(2) : "N/A";
  } else if (pageType === 'visibility') {
    if (activeModel === 'OVERALL') return item.overall ? (item.overall as number).toFixed(2) : "0.00";
    return item[key] !== undefined && item[key] !== null ? (item[key] as number).toFixed(2) : "0.00";
  } else if (pageType === 'sentiment') {
    const val = activeModel === 'OVERALL' ? item.overall : item[key];
    return val !== undefined && val !== null ? (val as number).toFixed(3) : "N/A";
  }
  return "N/A";
};

const calculateRank = (dataset: any[], brandName: string, modelKey: string, pageId: string): number => {
  if (!dataset || dataset.length === 0) return 0;
  const sorted = [...dataset].sort((a, b) => {
    if (pageId === 'positioning') {
      const valA = modelKey === 'overall' 
        ? ((a.chatgpt || 0) + (a.gemini || 0) + (a.claude || 0) + (a.perplexity || 0) + (a.deepseek || 0)) / 5
        : a[modelKey];
      const valB = modelKey === 'overall' 
        ? ((b.chatgpt || 0) + (b.gemini || 0) + (b.claude || 0) + (b.perplexity || 0) + (b.deepseek || 0)) / 5
        : b[modelKey];
      return (valA || 99) - (valB || 99);
    } else {
      const valA = modelKey === 'overall' ? a.overall : a[modelKey];
      const valB = modelKey === 'overall' ? b.overall : b[modelKey];
      return (valB || 0) - (valA || 0);
    }
  });
  return sorted.findIndex(d => (d.brand || d.brand_name) === brandName) + 1;
};

const InfoTooltip: FC<{ text?: string }> = ({ text = "some description describing the metric" }) => (
  <div className="group relative flex items-center ml-2">
    <Info size={16} className="text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
    <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-2 rounded-lg text-center z-50 shadow-xl font-normal normal-case tracking-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
);

interface BrandRowProps {
  data: any;
  rank: number;
  activeModel: string;
  isOurBrand: boolean;
  pageType: string;
}

const BrandRow: FC<BrandRowProps> = ({ data, rank, activeModel, isOurBrand, pageType }) => {
  if (!data) return null;
  const valStr = getValue(data, activeModel, pageType);
  const isTop3 = rank <= 3;
  const accent = MODELS[activeModel]?.accentColor || 'blue';
  
  let progress = 0;
  if (valStr !== "N/A") {
    const numericVal = parseFloat(valStr);
    if (pageType === 'positioning') progress = Math.max(0, Math.min(100, ((12 - numericVal) / (12 - 4)) * 100));
    else if (pageType === 'visibility') progress = Math.max(0, Math.min(100, (numericVal / 80) * 100));
    else if (pageType === 'sentiment') progress = Math.max(0, Math.min(100, numericVal * 100));
  }

  return (
    <tr className={`group transition-all duration-300 ${isOurBrand ? `bg-${accent}-50/60` : 'hover:bg-slate-50/70'} ${isOurBrand ? `ring-2 ring-${accent}-500/20 ring-inset relative z-10` : ''}`}>
      <td className="px-8 py-5"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shadow-sm ${isTop3 ? 'bg-amber-100 text-amber-600 ring-1 ring-amber-200' : isOurBrand ? `bg-${accent}-600 text-white` : 'bg-white text-slate-400 ring-1 ring-slate-200'}`}>{String(rank)}</span></td>
      <td className="px-8 py-5"><div className="flex items-center gap-3"><span className={`font-bold tracking-tight transition-colors ${isOurBrand ? `text-${accent}-900 text-lg` : 'text-slate-700'}`}>{String(data.brand || data.brand_name)}</span>{isOurBrand && <span className={`px-2 py-0.5 bg-${accent}-100 text-${accent}-600 text-[10px] font-black uppercase rounded animate-pulse`}>Target Brand</span>}</div></td>
      <td className="px-8 py-5 text-right">
        <div className="flex flex-col items-end">
          <span className={`font-mono font-black text-sm ${isOurBrand ? `text-${accent}-600` : 'text-slate-500'}`}>{String(valStr)}{pageType === 'visibility' && valStr !== "N/A" && '%'}</span>
          <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${isOurBrand ? `bg-${accent}-500` : `bg-${accent}-400/40`}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </td>
    </tr>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300 border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

const CustomYAxisTick: FC<any> = (props) => {
  const { x, y, payload } = props;
  const isTarget = payload.value === "SoCheers";
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-12} y={0} dy={4} textAnchor="end" fill={isTarget ? "#2563eb" : "#475569"} fontSize={isTarget ? 13 : 11} fontWeight={isTarget ? "900" : "bold"}>
        {isTarget ? "★ " : ""}{payload.value}
      </text>
    </g>
  );
};

// ==========================================
// 3. MAIN PAGE CONTENT COMPONENTS
// ==========================================

interface LeaderboardContentProps {
  currentPage: string;
  currentDataset: any[];
  activeModel: string;
  setActiveModel: (model: string) => void;
  sortedData: any[];
  filteredData: any[];
  top5: any[];
  remainingData: any[];
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ourBrand: string;
  ourCurrentIndex: number;
  getMetricLabel: () => string;
}

const LeaderboardContent: FC<LeaderboardContentProps> = ({ 
  currentPage, currentDataset, activeModel, setActiveModel, sortedData, filteredData,
  top5, remainingData, isExpanded, setIsExpanded, searchQuery, setSearchQuery,
  ourBrand, ourCurrentIndex, getMetricLabel
}) => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isNicheModalOpen, setIsNicheModalOpen] = useState(false);

  const CATEGORY_DATA_SOURCE = currentPage === 'positioning' ? CATEGORY_POSITIONING_DATA : CATEGORY_VISIBILITY_DATA;

  const categorySortedData = useMemo(() => {
    const key = selectedCategory.replace('/', '_').replace('-', '_');
    const data = [...CATEGORY_DATA_SOURCE] as (CategoryPositioningData | CategoryVisibilityData)[];
    if (currentPage === 'positioning') {
      return data.sort((a, b) => ((a[key] as number) || 99) - ((b[key] as number) || 99));
    } else {
      return data.sort((a, b) => ((b[key] as number) || 0) - ((a[key] as number) || 0));
    }
  }, [selectedCategory, CATEGORY_DATA_SOURCE, currentPage]);

  const nicheTop5 = useMemo(() => categorySortedData.slice(0, 5), [categorySortedData]);
  const socheersNicheIndex = useMemo(() => categorySortedData.findIndex(d => d.brand_name === ourBrand), [categorySortedData]);
  const isSoCheersInNicheTop5 = socheersNicheIndex >= 0 && socheersNicheIndex < 5;

  const mainMarketShareData = useMemo(() => {
    if (currentPage !== 'visibility') return []; // Only calculate for visibility page to avoid unnecessary compute
    const key = selectedCategory.replace('/', '_').replace('-', '_');
    const sorted = [...CATEGORY_VISIBILITY_DATA].sort((a, b) => ((b[key] as number) || 0) - ((a[key] as number) || 0));
    const top7 = sorted.slice(0, 7);
    const socheers = CATEGORY_VISIBILITY_DATA.find(d => d.brand_name === "SoCheers");
    if (top7.find(d => d.brand_name === "SoCheers")) return top7;
    return [...top7, socheers].filter(Boolean);
  }, [selectedCategory, currentPage]);

  const formatSnapshotVal = (val: number | null | undefined, pageId: string, modelKey: string) => {
    if (val === undefined || val === null) return 'N/A';
    if (pageId === 'positioning') {
      const rank = calculateRank(POSITIONING_DATA, ourBrand, modelKey.toLowerCase(), 'positioning');
      return `${rank}${getOrdinal(rank)}`;
    }
    if (pageId === 'sentiment') return val.toFixed(3);
    if (pageId === 'visibility') return `${val.toFixed(1)}%`;
    return val.toFixed(2);
  };

  const getSnapshotProgress = (val: number | null | undefined, pageId: string) => {
    if (val === undefined || val === null) return 0;
    if (pageId === 'positioning') return Math.max(0, Math.min(100, ((12 - val) / (12 - 4)) * 100));
    if (pageId === 'visibility') return Math.max(0, Math.min(100, (val / 80) * 100));
    return (val || 0) * 100;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Visibility Only: Market Modal */}
      {currentPage === 'visibility' && (
        <Modal isOpen={isMarketModalOpen} onClose={() => setIsMarketModalOpen(false)} title={`Market Breakdown (${currentPage})`}>
          <div className="h-[2000px] w-full">
             <ResponsiveContainer>
                <BarChart layout="vertical" data={CATEGORY_VISIBILITY_DATA} margin={{ left: 120, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="brand_name" width={110} tick={<CustomYAxisTick />} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                          const sortedPayload = [...payload].sort((a,b) => (b.value as number) - (a.value as number));
                          return (
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-2xl">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1">{label}</p>
                              {sortedPayload.filter(p => (p.value as number) > 0).slice(0,5).map((entry, index) => (
                                <p key={index} className="text-[10px] font-bold" style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}%
                                </p>
                              ))}
                            </div>
                          );
                      }
                      return null;
                  }} />
                  {CATEGORY_NAMES.map((cat) => (
                    <Bar key={cat} dataKey={cat.replace('/', '_').replace('-', '_')} stackId="v" fill={CATEGORY_COLORS[cat]} barSize={28} />
                  ))}
                </BarChart>
             </ResponsiveContainer>
          </div>
        </Modal>
      )}

      {/* Niche Modal */}
      <Modal isOpen={isNicheModalOpen} onClose={() => setIsNicheModalOpen(false)} title={`${selectedCategory.toUpperCase()} Leaderboard`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categorySortedData.map((item, i) => {
            const key = selectedCategory.replace('/', '_').replace('-', '_');
            const isTarget = item.brand_name === ourBrand;
            return (
              <div key={item.brand_name} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isTarget ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200 scale-105' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="flex items-center gap-4"><span className="text-sm font-black text-slate-400">#{i + 1}</span><span className={`font-bold ${isTarget ? 'text-indigo-900' : 'text-slate-800'}`}>{item.brand_name}</span></div>
                <span className={`font-black font-mono ${isTarget ? 'text-indigo-600' : 'text-slate-500'}`}>{item[key]}{currentPage === 'visibility' ? '%' : getOrdinal(item[key] as number)}</span>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Snapshot Cards */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white"><Star size={18} fill="currentColor" /></div>
          <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase flex items-center">
            SoCheers {currentPage} Snapshot
            <InfoTooltip />
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(MODELS).map(([key, model]) => {
            const brandData = currentDataset.find(d => (d.brand || d.brand_name) === ourBrand);
            if (!brandData) return null;
            let val = currentPage === 'positioning' 
              ? (key === 'OVERALL' ? ((brandData.chatgpt || 0) + (brandData.gemini || 0) + (brandData.claude || 0) + (brandData.perplexity || 0) + (brandData.deepseek || 0)) / 5 : brandData[key.toLowerCase()])
              : (key === 'OVERALL' ? brandData.overall : brandData[key.toLowerCase()]);
            return (
              <div key={key} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                <div className={`p-2 rounded-xl ${model.bgColor} ${model.color} mb-2`}>{React.createElement(model.icon, { size: 16 })}</div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{model.name}</p>
                <p className={`text-xl font-mono font-black ${model.color}`}>{formatSnapshotVal(val, currentPage, key)}</p>
                <div className="w-full h-1 bg-slate-50 rounded-full mt-3 overflow-hidden"><div className={`h-full rounded-full ${model.color.replace('text-', 'bg-')}`} style={{ width: `${getSnapshotProgress(val, currentPage)}%` }} /></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Dominance Section */}
      {(currentPage === 'visibility' || currentPage === 'positioning') && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white"><Layers size={18} /></div>
            <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase leading-none flex items-center">
              Category Dominance
              <InfoTooltip />
            </h2>
          </div>
          <div className={`grid grid-cols-1 ${currentPage === 'visibility' ? 'lg:grid-cols-3' : 'max-w-2xl mx-auto'} gap-6`}>
            
            {/* Conditional Rendering: Service Line Breakdown Chart only for Visibility page */}
            {currentPage === 'visibility' && (
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                    Service Line Breakdown
                    <InfoTooltip />
                  </h3>
                  <button onClick={() => setIsMarketModalOpen(true)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"><Maximize2 size={18} /></button>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <BarChart layout="vertical" data={mainMarketShareData} margin={{ left: 100, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <YAxis type="category" dataKey="brand_name" width={110} tick={<CustomYAxisTick />} />
                      <XAxis type="number" hide />
                      <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const sortedPayload = [...payload].sort((a,b) => (b.value as number) - (a.value as number));
                            return (
                              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-2xl">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1">{label}</p>
                                {sortedPayload.filter(p => (p.value as number) > 0).slice(0,5).map((entry, index) => (
                                  <p key={index} className="text-[10px] font-bold" style={{ color: entry.color }}>{entry.name}: {entry.value}%</p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                      }} />
                      {CATEGORY_NAMES.map((cat) => (
                        <Bar key={cat} dataKey={cat.replace('/', '_').replace('-', '_')} name={cat} stackId="v" fill={CATEGORY_COLORS[cat]} barSize={28}>
                          {mainMarketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} stroke={entry?.brand_name === "SoCheers" ? "#2563eb" : "none"} strokeWidth={entry?.brand_name === "SoCheers" ? 1 : 0} />
                          ))}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                  Niche Leaders
                  <InfoTooltip />
                </h3>
                <button onClick={() => setIsNicheModalOpen(true)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"><Maximize2 size={18} /></button>
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none mb-6">{CATEGORY_NAMES.map(cat => (<option key={cat} value={cat}>{cat.toUpperCase()}</option>))}</select>
              <div className="space-y-2">
                {nicheTop5.map((item, i) => {
                   const key = selectedCategory.replace('/', '_').replace('-', '_');
                   const isTarget = item.brand_name === ourBrand;
                   return (
                     <div key={item.brand_name} className={`flex items-center justify-between p-3 rounded-2xl border ${isTarget ? 'border-indigo-200 bg-indigo-50 shadow-sm ring-1 ring-indigo-100' : 'border-slate-50 bg-slate-50/30'}`}>
                        <div className="flex items-center gap-3 overflow-hidden"><span className="text-[10px] font-black text-slate-400 shrink-0">#{i+1}</span><span className={`text-xs font-bold truncate ${isTarget ? 'text-indigo-900' : 'text-slate-700'}`}>{item.brand_name}</span></div>
                        <span className={`text-xs font-black font-mono shrink-0 ${isTarget ? 'text-indigo-600' : 'text-slate-500'}`}>{item[key]}{currentPage === 'visibility' ? '%' : getOrdinal(item[key] as number)}</span>
                     </div>
                   );
                })}
                {!isSoCheersInNicheTop5 && socheersNicheIndex >= 0 && (
                   <>
                     <button onClick={() => setIsNicheModalOpen(true)} className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors"><ChevronDown size={14} /> Reveal niche details <ChevronDown size={14} /></button>
                     <div className={`flex items-center justify-between p-3 rounded-2xl border border-indigo-200 bg-indigo-50 shadow-md ring-1 ring-indigo-100`}><div className="flex items-center gap-3"><span className="text-[10px] font-black text-indigo-400 shrink-0">#{socheersNicheIndex+1}</span><span className={`text-xs font-black text-indigo-900 truncate`}>SoCheers</span></div><span className={`text-xs font-black font-mono text-indigo-600 shrink-0`}>{categorySortedData[socheersNicheIndex][selectedCategory.replace('/', '_').replace('-', '_')]}{currentPage === 'visibility' ? '%' : getOrdinal(categorySortedData[socheersNicheIndex][selectedCategory.replace('/', '_').replace('-', '_')] as number)}</span></div>
                   </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Leaderboard Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none flex items-center">
            Competitor Ranking
            <InfoTooltip />
          </h2>
          <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="Search agencies..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        </div>
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-200/50 rounded-2xl mb-8 no-scrollbar">
          {Object.entries(MODELS).map(([key, model]) => (
            <button key={key} onClick={() => { setActiveModel(key); setIsExpanded(false); }} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 min-w-max ${activeModel === key ? `bg-white text-slate-900 shadow-md ring-1 ring-slate-200` : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}>
              {React.createElement(model.icon, { size: 16, className: activeModel === key ? model.color : 'text-slate-400' })}
              <span className="font-bold text-xs">{model.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50/50"><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Rank</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Agency</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{activeModel === 'OVERALL' ? 'Authority Index' : getMetricLabel()}</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {searchQuery ? filteredData.map(item => <BrandRow key={item.brand || item.brand_name} data={item} rank={sortedData.indexOf(item) + 1} activeModel={activeModel} isOurBrand={(item.brand || item.brand_name) === ourBrand} pageType={currentPage} />) : (
                  <>
                    {top5.map((item, i) => <BrandRow key={item.brand || item.brand_name} data={item} rank={i + 1} activeModel={activeModel} isOurBrand={(item.brand || item.brand_name) === ourBrand} pageType={currentPage} />)}
                    {!isExpanded && (<><tr className="relative cursor-pointer group" onClick={() => setIsExpanded(true)}><td colSpan={3} className="p-0"><div className="h-28 w-full flex items-center justify-center relative overflow-hidden bg-slate-50/20"><div className="z-10 flex flex-col items-center gap-2 group-hover:scale-105 transition-transform"><div className="px-6 py-2.5 rounded-2xl bg-white shadow-lg border border-slate-100 text-slate-800 flex items-center gap-3 font-bold text-xs uppercase tracking-tight"><LayoutGrid size={16} className={MODELS[activeModel]?.color} /><span>Reveal Full Ranking</span><ChevronDown size={16} /></div></div></div></td></tr>{ourCurrentIndex >= 5 && <BrandRow data={sortedData[ourCurrentIndex]} rank={ourCurrentIndex + 1} activeModel={activeModel} isOurBrand={true} pageType={currentPage} />}</>)}
                    {isExpanded && remainingData.map((item, i) => <BrandRow key={item.brand || item.brand_name} data={item} rank={i + 6} activeModel={activeModel} isOurBrand={(item.brand || item.brand_name) === ourBrand} pageType={currentPage} />)}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const SourcesContent: FC = () => {
  const ChartWrapper: FC<{ title: string; children: React.ReactNode; height?: number }> = ({ title, children, height = 350 }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        {title}
        <InfoTooltip />
      </h3>
      <div style={{ width: '100%', height }}><ResponsiveContainer>{children}</ResponsiveContainer></div>
    </div>
  );
  
  const CustomTooltip: FC<any> = ({ active, payload, label, suffix = '%' }) => {
    if (active && payload && payload.length) {
      return (<div className="bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-2xl"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p><div className="space-y-1">{payload.map((entry: any, index: number) => (<p key={index} className="text-[10px] font-black" style={{ color: entry.color || entry.fill }}>{entry.name}: {entry.value}{suffix}</p>))}</div></div>);
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <Globe2 className="text-slate-400" size={24} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center">
            1. Overall Market Domains
            <InfoTooltip />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartWrapper title="Totality % (Unweighted)"><BarChart layout="vertical" data={OVERALL_TOTALITY_DATA} margin={{ left: 60, right: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" name="Share" fill={SOURCES_COLORS.darkGreen} radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartWrapper>
          <ChartWrapper title="Weighted LLM-wise %"><BarChart layout="vertical" data={OVERALL_WEIGHTED_DATA} margin={{ left: 60, right: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" name="Weighted Share" fill={SOURCES_COLORS.darkBlue} radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartWrapper>
        </div>
        <ChartWrapper title="Overall Per LLM % (Domain Share per AI)" height={500}><BarChart layout="vertical" data={OVERALL_LLM_GROUPED} margin={{ left: 60, right: 30, top: 20 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '20px' }} /><Bar dataKey="ChatGPT" stackId="a" fill={SOURCES_COLORS.lightGreen} barSize={32} /><Bar dataKey="Gemini" stackId="a" fill={SOURCES_COLORS.darkGreen} /><Bar dataKey="Claude" stackId="a" fill={SOURCES_COLORS.lightOrange} /><Bar dataKey="Perplexity" stackId="a" fill={SOURCES_COLORS.lightRed} /><Bar dataKey="DeepSeek" stackId="a" fill={SOURCES_COLORS.darkBlue} radius={[0, 4, 4, 0]} /></BarChart></ChartWrapper>
      </section>
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <Database className="text-slate-400" size={24} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center">
            2. SoCheers Specific Domains
            <InfoTooltip />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartWrapper title="SoCheers Totality % (Unweighted)"><BarChart layout="vertical" data={SOCHEERS_TOTALITY_DATA} margin={{ left: 60, right: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" name="Share" fill={SOURCES_COLORS.darkGreen} radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartWrapper>
          <ChartWrapper title="SoCheers Weighted LLM-wise %"><BarChart layout="vertical" data={SOCHEERS_WEIGHTED_DATA} margin={{ left: 60, right: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" name="Weighted Share" fill={SOURCES_COLORS.darkBlue} radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartWrapper>
        </div>
        <ChartWrapper title="SoCheers Per LLM % (Domain Share per AI)" height={500}><BarChart layout="vertical" data={SOCHEERS_LLM_GROUPED} margin={{ left: 60, right: 30, top: 20 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} /><Tooltip content={<CustomTooltip />} /><Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '20px' }} /><Bar dataKey="ChatGPT" stackId="a" fill={SOURCES_COLORS.lightGreen} barSize={32} /><Bar dataKey="Gemini" stackId="a" fill={SOURCES_COLORS.darkGreen} /><Bar dataKey="Claude" stackId="a" fill={SOURCES_COLORS.lightOrange} /><Bar dataKey="Perplexity" stackId="a" fill={SOURCES_COLORS.lightRed} /><Bar dataKey="DeepSeek" stackId="a" fill={SOURCES_COLORS.darkBlue} radius={[0, 4, 4, 0]} /></BarChart></ChartWrapper>
      </section>
    </div>
  );
};

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================

const Dashboard: FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('positioning');
  const [activeModel, setActiveModel] = useState<string>('OVERALL');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const ourBrand = "SoCheers";

  const currentDataset = useMemo(() => {
    switch (currentPage) {
      case 'positioning': return POSITIONING_DATA;
      case 'visibility': return VISIBILITY_DATA;
      case 'sentiment': return SENTIMENT_DATA;
      default: return POSITIONING_DATA;
    }
  }, [currentPage]);
  
  const sortedData = useMemo(() => {
    let data = [...currentDataset] as GenericBrandData[];
    const modelKey = activeModel.toLowerCase();
    if (currentPage === 'positioning') {
      return data.sort((a, b) => {
        if (activeModel === 'OVERALL') {
          const avgA = ((a.chatgpt || 0) + (a.gemini || 0) + (a.claude || 0) + (a.perplexity || 0) + (a.deepseek || 0)) / 5;
          const avgB = ((b.chatgpt || 0) + (b.gemini || 0) + (b.claude || 0) + (b.perplexity || 0) + (b.deepseek || 0)) / 5;
          return avgA - avgB;
        }
        return (a[modelKey] || 99) - (b[modelKey] || 99);
      });
    } else {
      return data.sort((a, b) => {
        const valA = (activeModel === 'OVERALL' ? a.overall : a[modelKey]) || 0;
        const valB = (activeModel === 'OVERALL' ? b.overall : b[modelKey]) || 0;
        return valB - valA;
      });
    }
  }, [activeModel, currentPage, currentDataset]);

  const filteredData = useMemo(() => {
    return sortedData.filter(item => (item.brand || item.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sortedData, searchQuery]);

  const ourCurrentIndex = sortedData.findIndex(item => (item.brand || item.brand_name) === ourBrand);
  const top5 = sortedData.slice(0, 5);
  const remainingData = sortedData.slice(5);

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    setActiveModel('OVERALL');
    setIsExpanded(false);
    setSearchQuery('');
  };

  const getMetricLabel = () => {
    if (currentPage === 'positioning') return 'WAR Score';
    if (currentPage === 'sentiment') return 'Sentiment';
    return 'Recall %';
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">S</div>
            <div><h2 className="font-black text-lg tracking-tight text-slate-900 leading-none">SoCheers</h2><p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1 text-nowrap">Intelligence Beta</p></div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {PAGES.map(page => (
              <button key={page.id} onClick={() => handlePageChange(page.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentPage === page.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                {React.createElement(page.icon, { size: 20 })}
                {page.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">{sidebarOpen ? <X /> : <Menu />}</button>
            <h1 className="font-bold uppercase tracking-widest text-xs text-slate-500">{currentPage}</h1>
            <div className="w-8" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{currentPage} <span className="text-blue-600">Insights</span></h1>
                <p className="text-slate-500 mt-2 max-w-xl text-sm leading-relaxed">{currentPage === 'positioning' ? "Evaluating brand authority and ranking across LLM service categories." : currentPage === 'visibility' ? "Measuring recall percentages and domain share." : currentPage === 'sentiment' ? "Analyzing perception levels across response streams." : "LLM Citation Analysis: Mapping domain visibility across market sources."}</p>
              </div>
              {currentPage !== 'sources' && (
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-center px-4 border-r border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Global Pos</p><p className="text-xl font-bold text-slate-800">#{calculateRank(currentDataset, ourBrand, 'overall', currentPage)}</p></div>
                    <div className="text-center px-4"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Current Model</p><p className={`text-xl font-bold ${MODELS[activeModel]?.color || 'text-blue-600'}`}>{ourCurrentIndex >= 0 ? `#${ourCurrentIndex + 1}` : 'N/A'}</p></div>
                </div>
              )}
            </div>
            {currentPage === 'sources' ? <SourcesContent /> : <LeaderboardContent currentPage={currentPage} currentDataset={currentDataset} activeModel={activeModel} setActiveModel={setActiveModel} sortedData={sortedData} filteredData={filteredData} top5={top5} remainingData={remainingData} isExpanded={isExpanded} setIsExpanded={setIsExpanded} searchQuery={searchQuery} setSearchQuery={setSearchQuery} ourBrand={ourBrand} ourCurrentIndex={ourCurrentIndex} getMetricLabel={getMetricLabel} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;