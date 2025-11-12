# Comprehensive Game Development Plan: AI Art Shop

## 1. Project Overview

### 1.1 Game Concept
A creative painting game where players:
- Create paintings using a digital canvas
- Sell paintings to an AI art critic for coins
- Purchase upgrades (colors, brushes, canvas sizes) from a shop
- Progress through unlocking new tools and expanding creative capabilities

### 1.2 Core Gameplay Loop
1. Player paints on canvas with available tools
2. Player submits painting to AI for evaluation
3. AI analyzes painting and offers payment
4. Player accepts/rejects offer
5. Player uses coins to buy upgrades
6. Player creates better paintings with new tools
7. Loop continues with increasing complexity

### 1.3 Technical Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Canvas Rendering**: HTML5 Canvas API
- **AI Integration**: Claude API (via fetch - available in artifacts)
- **Storage**: IndexedDB (primary) + localStorage (settings)
- **Styling**: Tailwind CSS (available in React artifacts)
- **State Management**: React Context + hooks

---

## 2. Architecture Design

### 2.1 Project Structure
```
src/
├── components/
│   ├── Canvas/
│   │   ├── DrawingCanvas.tsx
│   │   ├── ColorPalette.tsx
│   │   ├── BrushSelector.tsx
│   │   └── CanvasToolbar.tsx
│   ├── Shop/
│   │   ├── Shop.tsx
│   │   ├── ShopItem.tsx
│   │   └── ShopCategory.tsx
│   ├── Gallery/
│   │   ├── PaintingGallery.tsx
│   │   ├── PaintingCard.tsx
│   │   └── PaintingModal.tsx
│   ├── AI/
│   │   ├── AISaleDialog.tsx
│   │   └── AIFeedback.tsx
│   ├── UI/
│   │   ├── Header.tsx
│   │   ├── CoinDisplay.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── Tutorial/
│       └── TutorialOverlay.tsx
├── services/
│   ├── aiService.ts
│   ├── storageService.ts
│   └── gameService.ts
├── hooks/
│   ├── useCanvas.ts
│   ├── useGameState.ts
│   └── useIndexedDB.ts
├── context/
│   └── GameContext.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── canvasUtils.ts
│   └── constants.ts
└── App.tsx
```

### 2.2 Data Models

#### TypeScript Interfaces

```typescript
// Core Types
interface GameState {
  coins: number;
  unlockedColors: string[];
  unlockedBrushSizes: number[];
  unlockedCanvasSizes: CanvasSize[];
  currentCanvasSize: CanvasSize;
  paintingCount: number;
  totalEarnings: number;
  tutorialCompleted: boolean;
}

interface CanvasSize {
  id: string;
  width: number;
  height: number;
  name: string;
  price: number;
}

interface Painting {
  id: string;
  imageData: string; // base64 encoded
  thumbnail: string; // smaller version for gallery
  createdAt: number;
  soldFor: number | null;
  soldAt: number | null;
  canvasSize: CanvasSize;
  aiReview?: AIReview;
}

interface AIReview {
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

interface ShopItem {
  id: string;
  type: 'color' | 'brush' | 'canvas';
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  value: string | number | CanvasSize; // color hex, brush size, or canvas dimensions
  icon?: string;
}

interface DrawingTool {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
}
```

---

## 3. Storage Implementation

### 3.1 IndexedDB Schema

**Database Name**: `aiArtShopDB`
**Version**: 1

**Object Stores**:

1. **gameState** (key: 'current')
   - Stores single GameState object
   - Updated on every significant game action

2. **paintings** (key: id, indexed by: createdAt, soldAt)
   - Stores all Painting objects
   - Allows retrieval by date or sale status

3. **shopInventory** (key: id)
   - Stores all ShopItem objects
   - Updated when items are purchased

### 3.2 Storage Service Implementation

```typescript
// services/storageService.ts structure

class StorageService {
  private db: IDBDatabase | null;
  
  // Initialize IndexedDB
  async initDB(): Promise<void>
  
  // Game State Operations
  async saveGameState(state: GameState): Promise<void>
  async loadGameState(): Promise<GameState | null>
  
  // Painting Operations
  async savePainting(painting: Painting): Promise<void>
  async getPainting(id: string): Promise<Painting | null>
  async getAllPaintings(): Promise<Painting[]>
  async getSoldPaintings(): Promise<Painting[]>
  async getUnsoldPaintings(): Promise<Painting[]>
  async updatePainting(id: string, updates: Partial<Painting>): Promise<void>
  async deletePainting(id: string): Promise<void>
  
  // Shop Operations
  async saveShopInventory(items: ShopItem[]): Promise<void>
  async loadShopInventory(): Promise<ShopItem[]>
  async updateShopItem(id: string, updates: Partial<ShopItem>): Promise<void>
  
  // Utility
  async clearAllData(): Promise<void>
}
```

### 3.3 localStorage Usage

Store only UI preferences and settings:
- `theme`: 'light' | 'dark'
- `soundEnabled`: boolean
- `lastPlayedDate`: timestamp
- `tutorialStep`: number

---

## 4. Game Logic Implementation

### 4.1 Initial Game State

```typescript
const INITIAL_GAME_STATE: GameState = {
  coins: 50, // Starting coins for first purchase
  unlockedColors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  unlockedBrushSizes: [2, 5, 10],
  unlockedCanvasSizes: [
    { id: 'small', width: 400, height: 300, name: 'Small', price: 0 }
  ],
  currentCanvasSize: { id: 'small', width: 400, height: 300, name: 'Small', price: 0 },
  paintingCount: 0,
  totalEarnings: 0,
  tutorialCompleted: false
};
```

### 4.2 Shop Items Configuration

```typescript
const SHOP_CATALOG: ShopItem[] = [
  // Basic Colors (10 coins each)
  { id: 'color-yellow', type: 'color', name: 'Yellow', price: 10, value: '#FFFF00' },
  { id: 'color-orange', type: 'color', name: 'Orange', price: 10, value: '#FFA500' },
  { id: 'color-purple', type: 'color', name: 'Purple', price: 10, value: '#800080' },
  { id: 'color-pink', type: 'color', name: 'Pink', price: 10, value: '#FFC0CB' },
  
  // Advanced Colors (25 coins each)
  { id: 'color-cyan', type: 'color', name: 'Cyan', price: 25, value: '#00FFFF' },
  { id: 'color-magenta', type: 'color', name: 'Magenta', price: 25, value: '#FF00FF' },
  { id: 'color-lime', type: 'color', name: 'Lime', price: 25, value: '#00FF00' },
  
  // Special Colors (50 coins each)
  { id: 'color-gold', type: 'color', name: 'Gold', price: 50, value: '#FFD700' },
  { id: 'color-silver', type: 'color', name: 'Silver', price: 50, value: '#C0C0C0' },
  
  // Brush Sizes
  { id: 'brush-15', type: 'brush', name: 'Medium Brush', price: 30, value: 15 },
  { id: 'brush-20', type: 'brush', name: 'Large Brush', price: 50, value: 20 },
  { id: 'brush-30', type: 'brush', name: 'Huge Brush', price: 100, value: 30 },
  { id: 'brush-1', type: 'brush', name: 'Fine Brush', price: 40, value: 1 },
  
  // Canvas Sizes
  { id: 'canvas-medium', type: 'canvas', name: 'Medium Canvas', price: 100, 
    value: { id: 'medium', width: 600, height: 450, name: 'Medium', price: 100 } },
  { id: 'canvas-large', type: 'canvas', name: 'Large Canvas', price: 250,
    value: { id: 'large', width: 800, height: 600, name: 'Large', price: 250 } },
  { id: 'canvas-xl', type: 'canvas', name: 'XL Canvas', price: 500,
    value: { id: 'xl', width: 1000, height: 750, name: 'XL', price: 500 } },
];
```

### 4.3 Game Service

```typescript
// services/gameService.ts

class GameService {
  // Purchase Logic
  canPurchase(item: ShopItem, currentCoins: number): boolean {
    return currentCoins >= item.price && !item.unlocked;
  }
  
  purchaseItem(item: ShopItem, gameState: GameState): GameState {
    // Deduct coins, unlock item, update state
  }
  
  // Painting Sale Logic
  async sellPainting(painting: Painting, acceptedPrice: number): Promise<GameState> {
    // Add coins, mark painting as sold, update stats
  }
  
  // Progression Helpers
  calculateNextUnlock(gameState: GameState): ShopItem | null {
    // Suggest next affordable/interesting item
  }
}
```

---

## 5. Canvas Implementation

### 5.1 Drawing Canvas Component

**Features Required**:
- Mouse/touch drawing support
- Brush size and color application
- Eraser mode
- Clear canvas
- Undo/redo (store states in memory array)
- Export to base64 PNG
- Responsive canvas sizing

**Implementation Details**:

```typescript
// hooks/useCanvas.ts structure

interface CanvasState {
  isDrawing: boolean;
  context: CanvasRenderingContext2D | null;
  history: ImageData[];
  historyStep: number;
}

function useCanvas(canvasRef: RefObject<HTMLCanvasElement>, tool: DrawingTool) {
  // Drawing handlers
  const startDrawing = (e: MouseEvent | TouchEvent) => {};
  const draw = (e: MouseEvent | TouchEvent) => {};
  const stopDrawing = () => {};
  
  // History management
  const saveState = () => {};
  const undo = () => {};
  const redo = () => {};
  
  // Export
  const exportCanvas = (): string => {}; // Returns base64
  const clearCanvas = () => {};
  
  return { startDrawing, draw, stopDrawing, undo, redo, exportCanvas, clearCanvas };
}
```

**Canvas Drawing Algorithm**:
1. On mouse/touch down: Start path, record position
2. On mouse/touch move: Draw line from last position to current
3. Apply brush size and color/erase mode
4. On mouse/touch up: Save state to history
5. Limit history to 20 states to manage memory

### 5.2 Color Palette Component

- Display all unlocked colors in a grid
- Highlight currently selected color
- Show locked colors with lock icon and price
- Click to select color
- Click locked color to open shop

### 5.3 Brush Selector Component

- Display unlocked brush sizes as circles
- Show size number
- Highlight current selection
- Show locked sizes with lock icon
- Include eraser toggle button

### 5.4 Canvas Toolbar

- Undo button (↶)
- Redo button (↷)
- Clear canvas button (🗑️)
- Export/Submit to AI button
- Canvas size indicator

---

## 6. AI Integration

### 6.1 AI Service Implementation

```typescript
// services/aiService.ts

class AIService {
  async evaluatePainting(imageDataUrl: string, gameContext: {
    paintingCount: number;
    averageSalePrice: number;
    canvasSize: CanvasSize;
  }): Promise<AIReview> {
    
    // Convert base64 to appropriate format for Claude API
    const base64Data = imageDataUrl.split(',')[1];
    
    const prompt = `You are an AI art critic in a game where players paint and sell their artwork. 
    
Analyze this painting and provide:
1. A fair price in coins (10-500 range, scaled by canvas size and quality)
2. Encouraging, specific feedback (2-3 sentences)
3. Ratings for composition, color use, creativity, and technical skill (1-10 each)

Context:
- Canvas size: ${gameContext.canvasSize.name} (${gameContext.canvasSize.width}x${gameContext.canvasSize.height})
- This is painting #${gameContext.paintingCount}
- Average sale price: ${gameContext.averageSalePrice} coins

Be generous for early paintings, more discerning as the player progresses. Consider:
- Effort and detail visible
- Color harmony
- Composition and balance
- Use of canvas space
- Originality

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "price": <number between 10-500>,
  "feedback": "<encouraging feedback string>",
  "composition": <number 1-10>,
  "colorUse": <number 1-10>,
  "creativity": <number 1-10>,
  "technicalSkill": <number 1-10>
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/png",
                    data: base64Data,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // Strip markdown formatting if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const aiResponse = JSON.parse(responseText);
      
      return {
        price: aiResponse.price,
        feedback: aiResponse.feedback,
        analysisPoints: {
          composition: aiResponse.composition,
          colorUse: aiResponse.colorUse,
          creativity: aiResponse.creativity,
          technicalSkill: aiResponse.technicalSkill,
        },
        timestamp: Date.now(),
      };
      
    } catch (error) {
      console.error("AI evaluation error:", error);
      // Fallback pricing algorithm
      return this.generateFallbackReview(gameContext);
    }
  }
  
  private generateFallbackReview(gameContext: any): AIReview {
    // Simple fallback based on canvas size
    const basePrice = 20;
    const sizeMultiplier = (gameContext.canvasSize.width * gameContext.canvasSize.height) / (400 * 300);
    const price = Math.floor(basePrice * sizeMultiplier);
    
    return {
      price: Math.max(10, Math.min(500, price)),
      feedback: "I appreciate your creative effort! Keep painting to improve your skills.",
      analysisPoints: {
        composition: 5,
        colorUse: 5,
        creativity: 6,
        technicalSkill: 5,
      },
      timestamp: Date.now(),
    };
  }
}
```

### 6.2 AI Sale Dialog Component

**Flow**:
1. Player clicks "Submit to AI" button
2. Loading state: "The AI critic is reviewing your painting..."
3. Display AI review with:
   - Offered price (large, prominent)
   - Feedback text
   - Rating bars for each category
   - Accept/Reject buttons
4. On accept: Add coins, save painting as sold, show celebration
5. On reject: Close dialog, painting stays in gallery unsold

---

## 7. UI Components

### 7.1 App Layout

```
┌─────────────────────────────────────────┐
│ Header [Coins: 💰 125] [Shop] [Gallery] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │                 │  │ Color Palette│ │
│  │                 │  │  🎨 🎨 🎨 🎨 │ │
│  │     Canvas      │  │  🎨 🎨 🔒 🔒 │ │
│  │                 │  ├──────────────┤ │
│  │                 │  │ Brush Sizes  │ │
│  │                 │  │  ● ●● ●●● 🔒 │ │
│  └─────────────────┘  ├──────────────┤ │
│  [↶] [↷] [Clear] [AI] │   Eraser 🧹  │ │
│                       └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 Shop Component

**Layout**:
- Tabs: [Colors] [Brushes] [Canvas Sizes]
- Grid of shop items
- Each item shows:
  - Visual representation (color swatch/brush circle/canvas icon)
  - Name
  - Price (💰)
  - Purchase button or "Owned" badge
  - Lock icon if can't afford

**Interaction**:
- Filter items by category
- Sort by price/name
- Visual feedback on purchase
- Confirmation for expensive items (>100 coins)

### 7.3 Painting Gallery

**Features**:
- Grid of painting thumbnails
- Filter: All / Sold / Unsold
- Sort: Newest / Oldest / Highest Price
- Click painting to view full size
- Show sale price if sold
- Show "Submit to AI" button if unsold
- Delete painting option

### 7.4 Header Component

- Game title/logo
- Coin display with icon (💰)
- Navigation: [Shop] [Gallery] [?Help]
- Hamburger menu on mobile

---

## 8. Game Progression & Balancing

### 8.1 Pricing Strategy

**AI Pricing Factors**:
- Canvas size: Larger = higher base price
- Detail level: More strokes/complexity = higher price
- Color variety: More colors used = bonus
- Progression: Early paintings get bonus encouragement
- Randomness: ±20% variation for replayability

**Price Ranges**:
- Small canvas (400x300): 10-100 coins
- Medium canvas (600x450): 20-200 coins
- Large canvas (800x600): 50-350 coins
- XL canvas (1000x750): 75-500 coins

### 8.2 Unlock Progression

**Suggested Path**:
1. Start: 5 basic colors, 3 brush sizes, small canvas
2. First paintings: Earn ~20-50 coins each
3. First purchase: New color (10 coins)
4. After 3-4 paintings: Can afford brush size (30-50 coins)
5. After 10 paintings: Medium canvas (100 coins)
6. Mid-game: Collecting special colors (50 coins)
7. Late game: Large canvases, all tools unlocked

### 8.3 Engagement Features

**Achievements** (optional, stored in gameState):
- "First Sale": Sell first painting
- "Collector": Own 10 colors
- "Master Artist": Sell painting for 300+ coins
- "Prolific": Create 50 paintings
- "Canvas King": Unlock all canvas sizes

**Daily Bonus** (check lastPlayedDate in localStorage):
- Different day: +10 coins bonus
- Encourages return players

---

## 9. Tutorial System

### 9.1 First-Time Experience

**Step-by-step tutorial overlay**:

1. **Welcome**: "Welcome to AI Art Shop! Create paintings and sell them to earn coins."
2. **Canvas**: "This is your canvas. Click and drag to paint!"
3. **Colors**: "Choose colors from your palette. Start with these 5 basic colors."
4. **Brush**: "Select different brush sizes for detail or broad strokes."
5. **Create**: "Try painting something! Anything you create has value."
6. **Submit**: "When you're done, click 'Submit to AI' to get your painting evaluated."
7. **Shop**: "Use your coins in the Shop to unlock new colors, brushes, and larger canvases!"

**Implementation**:
- Modal overlay with spotlight on relevant UI
- Progress indicator (step 1/7)
- Skip tutorial option
- Store completion in localStorage and gameState

---

## 10. Polish & User Experience

### 10.1 Animations

- Coin gain: Number flies from AI dialog to header
- Purchase: Item unlocks with scale/fade animation
- Painting save: Flash/checkmark feedback
- Brush preview: Show size on hover

### 10.2 Visual Feedback

- Hover effects on all interactive elements
- Active state for selected color/brush
- Loading spinners for AI evaluation
- Success/error toast messages
- Disabled state for unaffordable items

### 10.3 Responsive Design

**Breakpoints**:
- Mobile (<640px): Stack canvas and tools vertically
- Tablet (640-1024px): Side-by-side with smaller canvas
- Desktop (>1024px): Optimal layout as shown

### 10.4 Accessibility

- ARIA labels on all buttons
- Keyboard navigation support
- Color contrast compliance
- Screen reader announcements for coin changes
- Focus indicators

### 10.5 Performance

- Debounce canvas history saves
- Lazy load painting thumbnails
- Limit gallery to 50 most recent paintings
- Compress stored images (reduce quality to 0.8)
- Clear old undo/redo states

---

## 11. Error Handling

### 11.1 Storage Errors

- IndexedDB unavailable: Fallback to localStorage (limited)
- Quota exceeded: Prompt user to delete old paintings
- Corruption: Clear data option in settings

### 11.2 AI Errors

- API failure: Use fallback pricing algorithm
- Timeout: Show retry option
- Invalid response: Graceful fallback with message

### 11.3 User Errors

- Submitting blank canvas: "Add some paint first!"
- Insufficient coins: "You need X more coins for this item"
- Canvas full message: (if implementing size limits)

---

## 12. Testing Scenarios

### 12.1 Core Functionality

- Create and save painting
- Evaluate painting with AI
- Accept/reject AI offer
- Purchase shop items
- Unlock progression
- Delete paintings
- Clear canvas and undo/redo

### 12.2 Edge Cases

- Empty canvas submission
- Purchasing with exact coin amount
- Filling storage quota
- Rapid successive actions
- Browser refresh mid-action
- Multiple tabs open

### 12.3 Data Persistence

- Close and reopen app
- Clear cache (keep IndexedDB)
- Different browsers
- Incognito mode handling

---

## 13. Future Enhancements (Optional)

### 13.1 Phase 2 Features

- Painting themes/challenges
- Color mixing (combine owned colors)
- Gradient tool
- Shape tools (circle, square, line)
- Texture brushes
- Background patterns

### 13.2 Phase 3 Features

- Gallery sharing (export paintings)
- Multiple save slots
- Custom color picker (unlock feature)
- Animation tools (frame-by-frame)
- AI art style suggestions
- Leaderboard (highest single sale)

---

## 14. Implementation Checklist

### Phase 1: Core Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up Tailwind CSS
- [ ] Create type definitions
- [ ] Implement IndexedDB storage service
- [ ] Create game context and hooks

### Phase 2: Canvas
- [ ] Build drawing canvas component
- [ ] Implement brush rendering
- [ ] Add undo/redo functionality
- [ ] Create color palette component
- [ ] Build brush selector
- [ ] Add export to base64

### Phase 3: AI Integration
- [ ] Implement AI service with Claude API
- [ ] Build AI sale dialog
- [ ] Add loading states
- [ ] Implement fallback pricing

### Phase 4: Shop System
- [ ] Create shop component
- [ ] Implement purchase logic
- [ ] Build shop item cards
- [ ] Add unlock animations
- [ ] Connect to game state

### Phase 5: Gallery
- [ ] Build painting gallery
- [ ] Create thumbnail system
- [ ] Add filter/sort options
- [ ] Implement painting modal
- [ ] Add delete functionality

### Phase 6: UI Polish
- [ ] Design header and navigation
- [ ] Add coin display with animations
- [ ] Implement responsive layouts
- [ ] Add toast notifications
- [ ] Create tutorial overlay

### Phase 7: Testing & Refinement
- [ ] Test all game loops
- [ ] Balance pricing and progression
- [ ] Fix bugs and edge cases
- [ ] Optimize performance
- [ ] Add accessibility features

---

## 15. Key Implementation Notes for LLM

### 15.1 Critical Requirements

1. **No Server Dependency**: All data must persist in IndexedDB/localStorage
2. **AI API Integration**: Use fetch with Claude API as shown in `<claude_completions_in_artifacts>` section
3. **Canvas Export**: Always export as PNG base64 for storage and AI evaluation
4. **State Management**: Use React Context to avoid prop drilling
5. **Responsive Canvas**: Canvas must scale appropriately on different screens

### 15.2 Code Organization

- Use functional components with hooks
- Implement custom hooks for complex logic (useCanvas, useGameState)
- Separate concerns: UI components, business logic services, storage layer
- Use TypeScript strictly - no `any` types

### 15.3 Performance Considerations

- Limit undo history to prevent memory issues
- Compress images before storage
- Use React.memo for expensive components
- Debounce frequent operations (autosave)

### 15.4 User Experience Priorities

1. Immediate feedback on all actions
2. Clear visual hierarchy
3. Encouraging, positive AI feedback
4. Satisfying progression curve
5. No loss of work (autosave)

---

## 16. Sample Prompts for AI Critic

### Beginner Friendly
- "I can see you're exploring the canvas! This painting shows creativity..."
- "Great start! The colors work well together..."
- "I love your bold use of [color]. Keep experimenting!"

### Progressive Feedback
- "Your composition is improving! Consider balancing the elements..."
- "Excellent color harmony in this piece..."
- "The detail in this section really stands out..."

### Advanced
- "This demonstrates strong technical skill..."
- "The spatial awareness in this composition is impressive..."
- "Your use of negative space creates great tension..."

---

This plan provides a complete blueprint for building the AI Art Shop game. An LLM implementing this should:

1. Start with the foundational types and storage layer
2. Build the canvas system with drawing capabilities
3. Integrate AI evaluation with proper error handling
4. Implement the shop and progression mechanics
5. Polish the UI with animations and responsive design
6. Test thoroughly across different scenarios

The game loop is simple but engaging: paint → sell → earn → buy → paint better. The AI evaluation adds unpredictability and personality, while the unlock system provides clear goals and progression.