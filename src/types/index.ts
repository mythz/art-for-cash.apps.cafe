// Core Types
export interface GameState {
  coins: number;
  unlockedColors: string[];
  unlockedBrushSizes: number[];
  unlockedCanvasSizes: CanvasSize[];
  currentCanvasSize: CanvasSize;
  paintingCount: number;
  totalEarnings: number;
  tutorialCompleted: boolean;
}

export interface CanvasSize {
  id: string;
  width: number;
  height: number;
  name: string;
  price: number;
}

export interface Painting {
  id: string;
  imageData: string; // base64 encoded
  thumbnail: string; // smaller version for gallery
  createdAt: number;
  soldFor: number | null;
  soldAt: number | null;
  canvasSize: CanvasSize;
  aiReview?: AIReview;
}

export interface AIReview {
  price: number;
  feedback: string;
  analysisPoints: {
    composition: number; // 1-10
    colorUse: number; // 1-10
    creativity: number; // 1-10
    technicalSkill: number; // 1-10
  };
  timestamp: number;
}

export interface ShopItem {
  id: string;
  type: 'color' | 'brush' | 'canvas';
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  value: string | number | CanvasSize; // color hex, brush size, or canvas dimensions
  icon?: string;
}

export interface DrawingTool {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
}

export interface UISettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  lastPlayedDate: number;
  tutorialStep: number;
}
