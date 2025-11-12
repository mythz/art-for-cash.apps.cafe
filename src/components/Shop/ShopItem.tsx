import { ShopItem as ShopItemType, CanvasSize } from '../../types';
import { Button } from '../UI/Button';

interface ShopItemProps {
  item: ShopItemType;
  currentCoins: number;
  onPurchase: (item: ShopItemType) => void;
}

export function ShopItem({ item, currentCoins, onPurchase }: ShopItemProps) {
  const canAfford = currentCoins >= item.price;
  const isUnlocked = item.unlocked;

  const renderPreview = () => {
    if (item.type === 'color') {
      return (
        <div
          className="w-full h-24 rounded-lg"
          style={{ backgroundColor: item.value as string }}
        />
      );
    }

    if (item.type === 'brush') {
      return (
        <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-lg">
          <div
            className="rounded-full bg-gray-800"
            style={{
              width: Math.min((item.value as number) * 2, 50),
              height: Math.min((item.value as number) * 2, 50),
            }}
          />
        </div>
      );
    }

    if (item.type === 'canvas') {
      const canvas = item.value as CanvasSize;
      return (
        <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-3xl mb-1">🖼️</div>
            <div className="text-xs text-gray-600">
              {canvas.width}x{canvas.height}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`border-2 rounded-lg p-3 transition ${
        isUnlocked
          ? 'border-green-400 bg-green-50'
          : canAfford
          ? 'border-blue-400 hover:border-blue-600'
          : 'border-gray-300 opacity-60'
      }`}
    >
      {renderPreview()}

      <div className="mt-3">
        <h4 className="font-bold text-gray-800">{item.name}</h4>
        <p className="text-xs text-gray-600 mb-2">{item.description}</p>

        {isUnlocked ? (
          <div className="bg-green-600 text-white text-center py-2 rounded font-semibold">
            ✓ Owned
          </div>
        ) : (
          <Button
            onClick={() => onPurchase(item)}
            disabled={!canAfford}
            variant={canAfford ? 'primary' : 'secondary'}
            size="sm"
            className="w-full"
          >
            {canAfford ? (
              <>💰 {item.price}</>
            ) : (
              <>🔒 {item.price}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
