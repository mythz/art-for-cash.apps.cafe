import { GameState, CanvasSize, ShopItem } from '../types';

// Initial Game State
export const INITIAL_CANVAS_SIZE: CanvasSize = {
  id: 'small',
  width: 400,
  height: 300,
  name: 'Small',
  price: 0,
};

export const INITIAL_GAME_STATE: GameState = {
  coins: 50,
  unlockedColors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  unlockedBrushSizes: [2, 5, 10],
  unlockedCanvasSizes: [INITIAL_CANVAS_SIZE],
  currentCanvasSize: INITIAL_CANVAS_SIZE,
  paintingCount: 0,
  totalEarnings: 0,
  tutorialCompleted: false,
};

// Shop Catalog
export const SHOP_CATALOG: Omit<ShopItem, 'unlocked'>[] = [
  // Basic Colors (10 coins each)
  {
    id: 'color-yellow',
    type: 'color',
    name: 'Yellow',
    description: 'Bright and cheerful',
    price: 10,
    value: '#FFFF00',
  },
  {
    id: 'color-orange',
    type: 'color',
    name: 'Orange',
    description: 'Warm and vibrant',
    price: 10,
    value: '#FFA500',
  },
  {
    id: 'color-purple',
    type: 'color',
    name: 'Purple',
    description: 'Royal and mysterious',
    price: 10,
    value: '#800080',
  },
  {
    id: 'color-pink',
    type: 'color',
    name: 'Pink',
    description: 'Soft and sweet',
    price: 10,
    value: '#FFC0CB',
  },

  // Advanced Colors (25 coins each)
  {
    id: 'color-cyan',
    type: 'color',
    name: 'Cyan',
    description: 'Cool aqua tone',
    price: 25,
    value: '#00FFFF',
  },
  {
    id: 'color-magenta',
    type: 'color',
    name: 'Magenta',
    description: 'Bold pink-purple',
    price: 25,
    value: '#FF00FF',
  },
  {
    id: 'color-lime',
    type: 'color',
    name: 'Lime',
    description: 'Electric green',
    price: 25,
    value: '#00FF00',
  },
  {
    id: 'color-navy',
    type: 'color',
    name: 'Navy',
    description: 'Deep ocean blue',
    price: 25,
    value: '#000080',
  },
  {
    id: 'color-maroon',
    type: 'color',
    name: 'Maroon',
    description: 'Rich deep red',
    price: 25,
    value: '#800000',
  },

  // Special Colors (50 coins each)
  {
    id: 'color-gold',
    type: 'color',
    name: 'Gold',
    description: 'Luxurious metallic',
    price: 50,
    value: '#FFD700',
  },
  {
    id: 'color-silver',
    type: 'color',
    name: 'Silver',
    description: 'Sleek and modern',
    price: 50,
    value: '#C0C0C0',
  },
  {
    id: 'color-bronze',
    type: 'color',
    name: 'Bronze',
    description: 'Warm metallic',
    price: 50,
    value: '#CD7F32',
  },

  // Brush Sizes
  {
    id: 'brush-1',
    type: 'brush',
    name: 'Fine Brush',
    description: 'Perfect for details',
    price: 40,
    value: 1,
  },
  {
    id: 'brush-15',
    type: 'brush',
    name: 'Medium Brush',
    description: 'Versatile size',
    price: 30,
    value: 15,
  },
  {
    id: 'brush-20',
    type: 'brush',
    name: 'Large Brush',
    description: 'Cover more area',
    price: 50,
    value: 20,
  },
  {
    id: 'brush-30',
    type: 'brush',
    name: 'Huge Brush',
    description: 'Bold strokes',
    price: 100,
    value: 30,
  },

  // Canvas Sizes
  {
    id: 'canvas-medium',
    type: 'canvas',
    name: 'Medium Canvas',
    description: 'More space to create',
    price: 100,
    value: { id: 'medium', width: 600, height: 450, name: 'Medium', price: 100 },
  },
  {
    id: 'canvas-large',
    type: 'canvas',
    name: 'Large Canvas',
    description: 'Expansive workspace',
    price: 250,
    value: { id: 'large', width: 800, height: 600, name: 'Large', price: 250 },
  },
  {
    id: 'canvas-xl',
    type: 'canvas',
    name: 'XL Canvas',
    description: 'Maximum creative space',
    price: 500,
    value: { id: 'xl', width: 1000, height: 750, name: 'XL', price: 500 },
  },
];

// Canvas Settings
export const MAX_HISTORY_STATES = 20;
export const THUMBNAIL_MAX_WIDTH = 200;
export const IMAGE_QUALITY = 0.8;

// Storage Keys
export const DB_NAME = 'aiArtShopDB';
export const DB_VERSION = 1;
export const STORE_GAME_STATE = 'gameState';
export const STORE_PAINTINGS = 'paintings';
export const STORE_SHOP_INVENTORY = 'shopInventory';

export const STORAGE_KEYS = {
  THEME: 'aiArtShop_theme',
  SOUND: 'aiArtShop_soundEnabled',
  LAST_PLAYED: 'aiArtShop_lastPlayedDate',
  TUTORIAL_STEP: 'aiArtShop_tutorialStep',
};
