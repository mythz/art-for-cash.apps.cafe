import { GameState, ShopItem, CanvasSize } from '../types';

class GameService {
  canPurchase(item: ShopItem, currentCoins: number): boolean {
    return currentCoins >= item.price && !item.unlocked;
  }

  purchaseItem(item: ShopItem, gameState: GameState): GameState {
    if (!this.canPurchase(item, gameState.coins)) {
      return gameState;
    }

    const newState = { ...gameState };
    newState.coins -= item.price;

    // Update unlocked items based on type
    if (item.type === 'color' && typeof item.value === 'string') {
      newState.unlockedColors = [...newState.unlockedColors, item.value];
    } else if (item.type === 'brush' && typeof item.value === 'number') {
      newState.unlockedBrushSizes = [
        ...newState.unlockedBrushSizes,
        item.value,
      ].sort((a, b) => a - b);
    } else if (item.type === 'canvas' && typeof item.value === 'object') {
      const canvasSize = item.value as CanvasSize;
      newState.unlockedCanvasSizes = [...newState.unlockedCanvasSizes, canvasSize];
    }

    return newState;
  }

  sellPainting(acceptedPrice: number, gameState: GameState): GameState {
    return {
      ...gameState,
      coins: gameState.coins + acceptedPrice,
      paintingCount: gameState.paintingCount + 1,
      totalEarnings: gameState.totalEarnings + acceptedPrice,
    };
  }

  calculateAverageSalePrice(totalEarnings: number, paintingCount: number): number {
    if (paintingCount === 0) return 0;
    return Math.floor(totalEarnings / paintingCount);
  }

  calculateNextUnlock(gameState: GameState, allItems: ShopItem[]): ShopItem | null {
    const affordableItems = allItems
      .filter((item) => !item.unlocked && item.price <= gameState.coins)
      .sort((a, b) => a.price - b.price);

    return affordableItems[0] || null;
  }

  applyDailyBonus(gameState: GameState, lastPlayedDate: number): { newState: GameState; bonusApplied: boolean } {
    const today = new Date().toDateString();
    const lastPlayed = new Date(lastPlayedDate).toDateString();

    if (today !== lastPlayed) {
      return {
        newState: {
          ...gameState,
          coins: gameState.coins + 10,
        },
        bonusApplied: true,
      };
    }

    return {
      newState: gameState,
      bonusApplied: false,
    };
  }
}

export const gameService = new GameService();
