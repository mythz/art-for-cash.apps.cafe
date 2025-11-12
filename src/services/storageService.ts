import { GameState, Painting, ShopItem } from '../types';
import {
  DB_NAME,
  DB_VERSION,
  STORE_GAME_STATE,
  STORE_PAINTINGS,
  STORE_SHOP_INVENTORY,
} from '../utils/constants';

class StorageService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create gameState store
        if (!db.objectStoreNames.contains(STORE_GAME_STATE)) {
          db.createObjectStore(STORE_GAME_STATE);
        }

        // Create paintings store with indices
        if (!db.objectStoreNames.contains(STORE_PAINTINGS)) {
          const paintingStore = db.createObjectStore(STORE_PAINTINGS, {
            keyPath: 'id',
          });
          paintingStore.createIndex('createdAt', 'createdAt', { unique: false });
          paintingStore.createIndex('soldAt', 'soldAt', { unique: false });
        }

        // Create shop inventory store
        if (!db.objectStoreNames.contains(STORE_SHOP_INVENTORY)) {
          db.createObjectStore(STORE_SHOP_INVENTORY, { keyPath: 'id' });
        }
      };
    });
  }

  // Game State Operations
  async saveGameState(state: GameState): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_GAME_STATE], 'readwrite');
      const store = transaction.objectStore(STORE_GAME_STATE);
      const request = store.put(state, 'current');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadGameState(): Promise<GameState | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_GAME_STATE], 'readonly');
      const store = transaction.objectStore(STORE_GAME_STATE);
      const request = store.get('current');

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Painting Operations
  async savePainting(painting: Painting): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PAINTINGS], 'readwrite');
      const store = transaction.objectStore(STORE_PAINTINGS);
      const request = store.put(painting);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPainting(id: string): Promise<Painting | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PAINTINGS], 'readonly');
      const store = transaction.objectStore(STORE_PAINTINGS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPaintings(): Promise<Painting[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PAINTINGS], 'readonly');
      const store = transaction.objectStore(STORE_PAINTINGS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getSoldPaintings(): Promise<Painting[]> {
    const paintings = await this.getAllPaintings();
    return paintings.filter((p) => p.soldFor !== null);
  }

  async getUnsoldPaintings(): Promise<Painting[]> {
    const paintings = await this.getAllPaintings();
    return paintings.filter((p) => p.soldFor === null);
  }

  async updatePainting(
    id: string,
    updates: Partial<Painting>
  ): Promise<void> {
    const painting = await this.getPainting(id);
    if (!painting) throw new Error('Painting not found');

    const updatedPainting = { ...painting, ...updates };
    await this.savePainting(updatedPainting);
  }

  async deletePainting(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PAINTINGS], 'readwrite');
      const store = transaction.objectStore(STORE_PAINTINGS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Shop Operations
  async saveShopInventory(items: ShopItem[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORE_SHOP_INVENTORY],
        'readwrite'
      );
      const store = transaction.objectStore(STORE_SHOP_INVENTORY);

      // Clear existing items
      store.clear();

      // Add all items
      items.forEach((item) => store.put(item));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async loadShopInventory(): Promise<ShopItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORE_SHOP_INVENTORY],
        'readonly'
      );
      const store = transaction.objectStore(STORE_SHOP_INVENTORY);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async updateShopItem(
    id: string,
    updates: Partial<ShopItem>
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORE_SHOP_INVENTORY],
        'readwrite'
      );
      const store = transaction.objectStore(STORE_SHOP_INVENTORY);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (!item) {
          reject(new Error('Item not found'));
          return;
        }

        const updatedItem = { ...item, ...updates };
        const putRequest = store.put(updatedItem);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Utility
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORE_GAME_STATE, STORE_PAINTINGS, STORE_SHOP_INVENTORY],
        'readwrite'
      );

      transaction.objectStore(STORE_GAME_STATE).clear();
      transaction.objectStore(STORE_PAINTINGS).clear();
      transaction.objectStore(STORE_SHOP_INVENTORY).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const storageService = new StorageService();
