export interface RodEntry {
  id: string;
  length: number;
}

export interface RodResult {
  id: string;
  length: number;
  ears: number;
  brackets: number;
  rodCost: number;
  earsCost: number;
  bracketsCost: number;
  total: number;
}

export interface Pricing {
  rodPerMeter: number;
  earPrice: number;
  bracketPrice: number;
}
