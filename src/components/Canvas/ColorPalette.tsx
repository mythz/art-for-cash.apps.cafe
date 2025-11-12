import { useGame } from '../../context/GameContext';

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onOpenShop: () => void;
}

export function ColorPalette({
  selectedColor,
  onColorSelect,
  onOpenShop,
}: ColorPaletteProps) {
  const { gameState, shopItems } = useGame();

  const lockedColors = shopItems
    .filter((item) => item.type === 'color' && !item.unlocked)
    .slice(0, 4);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Colors</h3>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {gameState.unlockedColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-12 h-12 rounded-lg transition-all ${
              selectedColor === color
                ? 'ring-4 ring-blue-500 scale-110'
                : 'ring-2 ring-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {lockedColors.length > 0 && (
        <>
          <div className="border-t border-gray-200 pt-3 mt-3">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Locked Colors
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {lockedColors.map((item) => (
                <button
                  key={item.id}
                  onClick={onOpenShop}
                  className="relative w-12 h-12 rounded-lg ring-2 ring-gray-300 hover:ring-gray-400 transition"
                  style={{
                    backgroundColor: item.value as string,
                    opacity: 0.5,
                  }}
                  title={`${item.name} - ${item.price} coins`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={onOpenShop}
              className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              View All in Shop
            </button>
          </div>
        </>
      )}
    </div>
  );
}
