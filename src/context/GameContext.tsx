import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { GameState, Painting, ShopItem, CanvasSize } from '../types';
import { INITIAL_GAME_STATE, SHOP_CATALOG } from '../utils/constants';
import { storageService } from '../services/storageService';
import { gameService } from '../services/gameService';

interface GameContextType {
  gameState: GameState;
  paintings: Painting[];
  shopItems: ShopItem[];
  isLoading: boolean;
  updateGameState: (updates: Partial<GameState>) => Promise<void>;
  savePainting: (painting: Painting) => Promise<void>;
  deletePainting: (id: string) => Promise<void>;
  purchaseShopItem: (item: ShopItem) => Promise<boolean>;
  sellPainting: (paintingId: string, price: number) => Promise<void>;
  setCurrentCanvasSize: (size: CanvasSize) => Promise<void>;
  refreshPaintings: () => Promise<void>;
  resetGame: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and load game state
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setIsLoading(true);

      // Initialize IndexedDB
      await storageService.initDB();

      // Load game state
      const savedState = await storageService.loadGameState();
      if (savedState) {
        setGameState(savedState);
      } else {
        // First time - save initial state
        await storageService.saveGameState(INITIAL_GAME_STATE);
      }

      // Load paintings
      const loadedPaintings = await storageService.getAllPaintings();
      setPaintings(loadedPaintings.sort((a, b) => b.createdAt - a.createdAt));

      // Initialize shop inventory
      let loadedShop = await storageService.loadShopInventory();

      if (loadedShop.length === 0) {
        // First time - initialize shop
        const initialShop = SHOP_CATALOG.map((item) => ({
          ...item,
          unlocked: false,
        }));
        await storageService.saveShopInventory(initialShop);
        loadedShop = initialShop;
      }

      // Update shop items based on current game state
      const updatedShop = loadedShop.map((item) => {
        let unlocked = false;

        if (item.type === 'color' && typeof item.value === 'string') {
          unlocked = (savedState || INITIAL_GAME_STATE).unlockedColors.includes(
            item.value
          );
        } else if (item.type === 'brush' && typeof item.value === 'number') {
          unlocked = (
            savedState || INITIAL_GAME_STATE
          ).unlockedBrushSizes.includes(item.value);
        } else if (item.type === 'canvas' && typeof item.value === 'object') {
          const canvasSize = item.value as CanvasSize;
          unlocked = (
            savedState || INITIAL_GAME_STATE
          ).unlockedCanvasSizes.some((cs) => cs.id === canvasSize.id);
        }

        return { ...item, unlocked };
      });

      setShopItems(updatedShop);
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    const newState = { ...gameState, ...updates };
    setGameState(newState);
    await storageService.saveGameState(newState);
  };

  const savePainting = async (painting: Painting) => {
    await storageService.savePainting(painting);
    setPaintings((prev) =>
      [painting, ...prev].sort((a, b) => b.createdAt - a.createdAt)
    );
  };

  const deletePainting = async (id: string) => {
    await storageService.deletePainting(id);
    setPaintings((prev) => prev.filter((p) => p.id !== id));
  };

  const purchaseShopItem = async (item: ShopItem): Promise<boolean> => {
    if (!gameService.canPurchase(item, gameState.coins)) {
      return false;
    }

    const newState = gameService.purchaseItem(item, gameState);
    await updateGameState(newState);

    // Update shop item as unlocked
    const updatedShopItems = shopItems.map((si) =>
      si.id === item.id ? { ...si, unlocked: true } : si
    );
    setShopItems(updatedShopItems);
    await storageService.saveShopInventory(updatedShopItems);

    return true;
  };

  const sellPainting = async (paintingId: string, price: number) => {
    // Update painting
    await storageService.updatePainting(paintingId, {
      soldFor: price,
      soldAt: Date.now(),
    });

    // Update game state
    const newState = gameService.sellPainting(price, gameState);
    await updateGameState(newState);

    // Refresh paintings list
    await refreshPaintings();
  };

  const setCurrentCanvasSize = async (size: CanvasSize) => {
    await updateGameState({ currentCanvasSize: size });
  };

  const refreshPaintings = async () => {
    const loadedPaintings = await storageService.getAllPaintings();
    setPaintings(loadedPaintings.sort((a, b) => b.createdAt - a.createdAt));
  };

  const resetGame = async () => {
    await storageService.clearAllData();
    await initializeGame();
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        paintings,
        shopItems,
        isLoading,
        updateGameState,
        savePainting,
        deletePainting,
        purchaseShopItem,
        sellPainting,
        setCurrentCanvasSize,
        refreshPaintings,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
