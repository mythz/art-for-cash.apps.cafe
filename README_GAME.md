# AI Art Shop - Paint, Sell, Upgrade!

A creative painting game where you create digital artwork, sell it to an AI art critic, and use your earnings to unlock new tools and expand your creative capabilities.

## Features

### Core Gameplay
- **Digital Canvas**: Paint with your mouse or touch screen
- **AI Art Critic**: Get your paintings evaluated by Claude AI
- **Progressive Unlocks**: Earn coins to buy new colors, brushes, and canvas sizes
- **Gallery System**: View all your creations and track your progress
- **Tutorial**: Interactive tutorial for first-time players

### Game Mechanics
- Start with 50 coins and 5 basic colors
- Paint on a canvas with customizable brush sizes
- Submit paintings to AI for evaluation (10-500 coins per painting)
- Use coins to unlock:
  - 12 different colors (10-50 coins each)
  - 4 brush sizes (30-100 coins each)
  - 4 canvas sizes (0-500 coins each)

### Technical Features
- **Persistent Storage**: All game data stored in IndexedDB
- **Undo/Redo**: Up to 20 steps of painting history
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch Support**: Full touch screen support for mobile devices

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure AI Integration (Optional):
   - The game works with a fallback AI evaluation system by default
   - To use real Claude AI evaluation, add your API key in `src/services/aiService.ts`
   - Replace `'YOUR_API_KEY_HERE'` with your Anthropic API key

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (typically http://localhost:5173)

## Building for Production

```bash
npm run build
npm run preview
```

## How to Play

1. **Start Painting**: Select a color and brush size, then click and drag on the canvas
2. **Use Tools**:
   - Choose from your unlocked colors
   - Select different brush sizes
   - Toggle eraser mode
   - Undo/Redo your strokes
3. **Submit to AI**: Click "Submit to AI" when your painting is complete
4. **Get Evaluation**: The AI critic will review your work and make an offer
5. **Accept or Decline**: Accept to earn coins, or decline to keep painting unsold
6. **Visit the Shop**: Spend coins on new colors, brushes, and larger canvases
7. **View Gallery**: Check out all your paintings and track your progress

## Game Progression

- **Early Game** (0-100 coins): Focus on unlocking basic colors and brush sizes
- **Mid Game** (100-500 coins): Unlock medium canvas and special colors
- **Late Game** (500+ coins): Unlock large canvases and all premium tools

## Tips for Success

- Experiment with different color combinations for higher ratings
- Use the full canvas space for better composition scores
- Larger canvases can sell for more coins
- The AI is generous with early paintings to help you get started
- Keep creating - practice improves your earning potential!

## Project Structure

```
src/
├── components/        # React components
│   ├── Canvas/       # Drawing canvas and tools
│   ├── Shop/         # Shop system
│   ├── Gallery/      # Painting gallery
│   ├── AI/           # AI evaluation dialog
│   ├── UI/           # Reusable UI components
│   └── Tutorial/     # Tutorial overlay
├── context/          # React context (GameContext)
├── hooks/            # Custom hooks (useCanvas)
├── services/         # Business logic services
│   ├── aiService     # AI evaluation
│   ├── gameService   # Game logic
│   └── storageService # IndexedDB operations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **IndexedDB** - Client-side database
- **HTML5 Canvas** - Drawing functionality
- **Claude API** - AI art evaluation (optional)

## Storage

The game uses:
- **IndexedDB** for game state, paintings, and shop inventory
- **localStorage** for UI preferences and tutorial progress

All data is stored locally in your browser.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires IndexedDB support.

## License

MIT License - See LICENSE file for details

## Credits

Game concept and implementation based on the AI Art Shop design specification.
AI evaluation powered by Anthropic's Claude.
