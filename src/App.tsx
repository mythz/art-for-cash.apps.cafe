import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/UI/Header';
import { DrawingCanvas } from './components/Canvas/DrawingCanvas';
import { ColorPalette } from './components/Canvas/ColorPalette';
import { BrushSelector } from './components/Canvas/BrushSelector';
import { Shop } from './components/Shop/Shop';
import { PaintingGallery } from './components/Gallery/PaintingGallery';
import { AISaleDialog } from './components/AI/AISaleDialog';
import { TutorialOverlay } from './components/Tutorial/TutorialOverlay';
import { DrawingTool, AIReview, Painting } from './types';
import { generateId, createThumbnail, isCanvasEmpty } from './utils/canvasUtils';

function AppContent() {
  const { gameState, savePainting, sellPainting, updateGameState } = useGame();

  // UI State
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(!gameState.tutorialCompleted);

  // Drawing Tool State
  const [tool, setTool] = useState<DrawingTool>({
    color: gameState.unlockedColors[0],
    brushSize: gameState.unlockedBrushSizes[0],
    mode: 'draw',
  });

  const handleColorSelect = (color: string) => {
    setTool((prev) => ({ ...prev, color, mode: 'draw' }));
  };

  const handleBrushSizeSelect = (size: number) => {
    setTool((prev) => ({ ...prev, brushSize: size, mode: 'draw' }));
  };

  const handleToggleEraseMode = () => {
    setTool((prev) => ({
      ...prev,
      mode: prev.mode === 'erase' ? 'draw' : 'erase',
    }));
  };

  const handleExportCanvas = (imageData: string) => {
    // Check if canvas is empty
    const canvas = document.querySelector('canvas');
    if (canvas && isCanvasEmpty(canvas)) {
      alert('Please add some paint to your canvas first!');
      return;
    }

    setCurrentImageData(imageData);
    setIsAIDialogOpen(true);
  };

  const handleAIAccept = async (review: AIReview) => {
    // Create thumbnail
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const thumbnail = createThumbnail(canvas as HTMLCanvasElement);

    // Create painting object
    const painting: Painting = {
      id: generateId(),
      imageData: currentImageData,
      thumbnail,
      createdAt: Date.now(),
      soldFor: review.price,
      soldAt: Date.now(),
      canvasSize: gameState.currentCanvasSize,
      aiReview: review,
    };

    // Save painting
    await savePainting(painting);

    // Update game state with earnings
    await sellPainting(painting.id, review.price);

    // Clear canvas
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Show success message
    alert(`Congratulations! You earned ${review.price} coins! 💰`);
  };

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    await updateGameState({ tutorialCompleted: true });
  };

  const handleSubmitPaintingFromGallery = (painting: Painting) => {
    setCurrentImageData(painting.imageData);
    setIsAIDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Tutorial Overlay */}
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}

      {/* Header */}
      <Header
        onOpenShop={() => setIsShopOpen(true)}
        onOpenGallery={() => setIsGalleryOpen(true)}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <DrawingCanvas tool={tool} onExport={handleExportCanvas} />
          </div>

          {/* Tools Sidebar */}
          <div className="space-y-6">
            <ColorPalette
              selectedColor={tool.color}
              onColorSelect={handleColorSelect}
              onOpenShop={() => setIsShopOpen(true)}
            />

            <BrushSelector
              selectedSize={tool.brushSize}
              onSizeSelect={handleBrushSizeSelect}
              isEraseMode={tool.mode === 'erase'}
              onToggleEraseMode={handleToggleEraseMode}
              onOpenShop={() => setIsShopOpen(true)}
            />

            {/* Stats Card */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Your Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paintings Created:</span>
                  <span className="font-semibold">
                    {gameState.paintingCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings:</span>
                  <span className="font-semibold">
                    💰 {gameState.totalEarnings}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colors Unlocked:</span>
                  <span className="font-semibold">
                    {gameState.unlockedColors.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brushes Unlocked:</span>
                  <span className="font-semibold">
                    {gameState.unlockedBrushSizes.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Shop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

      <PaintingGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSubmitToAI={handleSubmitPaintingFromGallery}
      />

      <AISaleDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        imageData={currentImageData}
        onAccept={handleAIAccept}
      />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
