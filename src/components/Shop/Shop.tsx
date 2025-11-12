import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { ShopItem as ShopItemComponent } from './ShopItem';
import { ShopItem as ShopItemType } from '../../types';
import { useGame } from '../../context/GameContext';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShopTab = 'colors' | 'brushes' | 'canvas';

export function Shop({ isOpen, onClose }: ShopProps) {
  const { shopItems, gameState, purchaseShopItem } = useGame();
  const [activeTab, setActiveTab] = useState<ShopTab>('colors');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const handlePurchase = async (item: ShopItemType) => {
    const success = await purchaseShopItem(item);

    if (success) {
      setPurchaseMessage(`✓ Purchased ${item.name}!`);
      setTimeout(() => setPurchaseMessage(null), 2000);
    } else {
      setPurchaseMessage(`✗ Not enough coins for ${item.name}`);
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const filteredItems = shopItems.filter((item) => {
    if (activeTab === 'colors') return item.type === 'color';
    if (activeTab === 'brushes') return item.type === 'brush';
    if (activeTab === 'canvas') return item.type === 'canvas';
    return false;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🛍️ Art Supply Shop" maxWidth="xl">
      <div className="space-y-4">
        {/* Coin Display */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg text-center">
          <p className="text-gray-700">Your Balance</p>
          <p className="text-3xl font-bold text-yellow-700">💰 {gameState.coins}</p>
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div
            className={`p-3 rounded-lg text-center font-semibold ${
              purchaseMessage.startsWith('✓')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {purchaseMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === 'colors'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🎨 Colors
          </button>
          <button
            onClick={() => setActiveTab('brushes')}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === 'brushes'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🖌️ Brushes
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === 'canvas'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🖼️ Canvas Sizes
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <ShopItemComponent
              key={item.id}
              item={item}
              currentCoins={gameState.coins}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items available in this category
          </div>
        )}
      </div>
    </Modal>
  );
}
