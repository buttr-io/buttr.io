/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface AnalyticsModule {
  id: string;
  name: string;
  category: string;
  image: string;
  version: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  SOLUTIONS = 'solutions',
  PERFORMANCE = 'performance',
  PRICING = 'pricing',
}