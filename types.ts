// FIX: Changed type-only import of React to a full import to make the JSX namespace available.
import React from 'react';

export type ProductType =
  | 'aircraft-exterior'
  | 'seat-headrest'
  | 'airport-trolley'
  | 'unipole-billboard'
  | 'street-hoarding'
  | 'bus-wrap'
  | 'metro-ad'
  | 'led-billboard'
  | 'terminal-ad'
  | 'bus-interior'
  | 'metro-exterior'
  | 'boarding-pass'
  | 'shopping-mall'
  | 'overhead-bin'
  | 'step-ladder'
  | 'baggage-cart'
  | 'meal-tray'
  | 'skyline-panel'
  | 'road-median'
  | 'auto-canopy'
  | 'car-wrap'
  | 'unipole-media'
  | 'facade-bridge';

export interface Product {
  id: ProductType;
  name: string;
  prompt: string;
  // FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve the "Cannot find namespace 'JSX'" error.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export interface ProductCategory {
  name: string;
  products: Product[];
}

export interface Base64Image {
  base64: string;
  mimeType: string;
}

export interface GenerationResult {
    status: 'idle' | 'loading' | 'success' | 'error';
    imageUrl: string | null;
    error: string | null;
}

export interface GenerationHistoryItem {
  id: string;
  logo: Base64Image;
  logoName: string;
  results: Record<ProductType, GenerationResult>;
  timestamp: number;
}