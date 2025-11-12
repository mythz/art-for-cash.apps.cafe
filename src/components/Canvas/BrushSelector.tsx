import { useGame } from '../../context/GameContext';

interface BrushSelectorProps {
  selectedSize: number;
  onSizeSelect: (size: number) => void;
  isEraseMode: boolean;
  onToggleEraseMode: () => void;
  onOpenShop: () => void;
}

export function BrushSelector({
  selectedSize,
  onSizeSelect,
  isEraseMode,
  onToggleEraseMode,
  onOpenShop,
}: BrushSelectorProps) {
  const { gameState, shopItems } = useGame();

  const lockedBrushes = shopItems
    .filter((item) => item.type === 'brush' && !item.unlocked)
    .slice(0, 2);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Brush Size</h3>

      <div className="space-y-3 mb-4">
        {gameState.unlockedBrushSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition ${
              selectedSize === size && !isEraseMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <span className="font-semibold">{size}px</span>
            <div
              className={`rounded-full ${
                selectedSize === size && !isEraseMode
                  ? 'bg-white'
                  : 'bg-gray-800'
              }`}
              style={{
                width: Math.min(size * 2, 30),
                height: Math.min(size * 2, 30),
              }}
            />
          </button>
        ))}
      </div>

      {lockedBrushes.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3 mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Locked Brushes
          </h4>
          <div className="space-y-2">
            {lockedBrushes.map((item) => (
              <button
                key={item.id}
                onClick={onOpenShop}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 opacity-60"
              >
                <span className="text-sm">{String(item.value)}px</span>
                <span className="text-xs">🔒 {item.price} coins</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onToggleEraseMode}
        className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
          isEraseMode
            ? 'bg-orange-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        🧹 Eraser {isEraseMode ? '(Active)' : ''}
      </button>
    </div>
  );
}
