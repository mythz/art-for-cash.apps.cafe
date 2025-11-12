import { useGame } from '../../context/GameContext';

interface HeaderProps {
  onOpenShop: () => void;
  onOpenGallery: () => void;
  onOpenHelp?: () => void;
}

export function Header({ onOpenShop, onOpenGallery, onOpenHelp }: HeaderProps) {
  const { gameState } = useGame();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎨</div>
            <div>
              <h1 className="text-2xl font-bold">AI Art Shop</h1>
              <p className="text-sm text-purple-200">Paint, Sell, Upgrade!</p>
            </div>
          </div>

          {/* Coin Display */}
          <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-2xl mr-2">💰</span>
            <div>
              <div className="text-2xl font-bold">{gameState.coins}</div>
              <div className="text-xs text-purple-200">Coins</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <button
              onClick={onOpenShop}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition"
            >
              🛍️ Shop
            </button>
            <button
              onClick={onOpenGallery}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition"
            >
              🖼️ Gallery
            </button>
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg font-semibold transition"
              >
                ❓
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
