import { webhatcheryGameApi, type WebHatcheryGameState } from '../api/webhatcheryGameApi';
import { useAutomapStore } from './useAutomapStore';
import { useCharacterCreationStore } from './useCharacterCreationStore';
import { useCombatStore } from './useCombatStore';
import { useDungeonContextStore } from './useDungeonContextStore';
import { useDungeonStore } from './useDungeonStore';
import { useGameStateStore } from './useGameStateStore';
import { useGoldStore } from './useGoldStore';
import { useInventoryStore } from './useInventoryStore';
import { usePartyStore } from './usePartyStore';
import { useUIStore } from './uiStore';
import { useWebHatcherySessionStore } from './webhatcherySessionStore';
import { useWorldStore } from './useWorldStore';

type StoreSnapshot = Record<string, unknown>;

interface StoreApiLike {
  getState: () => StoreSnapshot;
  setState: (state: StoreSnapshot) => void;
  subscribe: (listener: (state: StoreSnapshot, previousState: StoreSnapshot) => void) => () => void;
}

const storeRegistry: Record<string, StoreApiLike> = {
  automap: useAutomapStore as unknown as StoreApiLike,
  characterCreation: useCharacterCreationStore as unknown as StoreApiLike,
  combat: useCombatStore as unknown as StoreApiLike,
  dungeon: useDungeonStore as unknown as StoreApiLike,
  dungeonContext: useDungeonContextStore as unknown as StoreApiLike,
  gameState: useGameStateStore as unknown as StoreApiLike,
  gold: useGoldStore as unknown as StoreApiLike,
  inventory: useInventoryStore as unknown as StoreApiLike,
  party: usePartyStore as unknown as StoreApiLike,
  ui: useUIStore as unknown as StoreApiLike,
  world: useWorldStore as unknown as StoreApiLike,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const loadOrCreateBackendGame = async (): Promise<WebHatcheryGameState> => {
  const sessionStore = useWebHatcherySessionStore.getState();
  try {
    return await sessionStore.loadGame();
  } catch {
    return sessionStore.continueAsGuest();
  }
};

const syncSessionState = (gameState: WebHatcheryGameState): void => {
  useWebHatcherySessionStore.setState({
    gameState,
    user: gameState.user,
    isLoading: false,
    error: null,
  });
};

const toPlainValue = (value: unknown): unknown => {
  if (value instanceof Set) {
    return [...value];
  }

  if (Array.isArray(value)) {
    return value.map(toPlainValue);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>((plain, [key, entry]) => {
    if (typeof entry !== 'function') {
      plain[key] = toPlainValue(entry);
    }
    return plain;
  }, {});
};

const toPlainRecord = (state: StoreSnapshot): StoreSnapshot =>
  toPlainValue(state) as StoreSnapshot;

const snapshotAllStores = (): StoreSnapshot =>
  Object.entries(storeRegistry).reduce<StoreSnapshot>((snapshot, [key, store]) => {
    snapshot[key] = toPlainRecord(store.getState());
    return snapshot;
  }, {});

const restoreStoreSnapshot = (key: string, value: unknown): void => {
  if (!isRecord(value)) {
    return;
  }

  const restored = { ...value };
  if ((key === 'dungeon' || key === 'legacyGame') && Array.isArray(restored.exploredMap)) {
    restored.exploredMap = new Set(restored.exploredMap as string[]);
  }

  storeRegistry[key]?.setState(restored);
};

let backendSyncTimer: ReturnType<typeof setTimeout> | null = null;
let isRestoring = false;
let syncStarted = false;
let unsubscribeAll: Array<() => void> = [];

const syncBackendSnapshot = (): void => {
  if (isRestoring) {
    return;
  }

  if (backendSyncTimer) {
    clearTimeout(backendSyncTimer);
  }

  backendSyncTimer = setTimeout(() => {
    void webhatcheryGameApi
      .applyIntent('state_updated', { state: snapshotAllStores() })
      .then(syncSessionState)
      .catch(error => {
        console.error('Failed to sync Dungeon Crawler backend state:', error);
      });
  }, 500);
};

export const loadDungeonCrawlerBackendState = async (): Promise<void> => {
  const gameState = await loadOrCreateBackendGame();
  syncSessionState(gameState);
  const backendState = gameState.save.state;
  if (!isRecord(backendState) || !isRecord(backendState.gameState)) {
    return;
  }

  const savedStores = backendState.gameState;
  isRestoring = true;
  try {
    Object.entries(storeRegistry).forEach(([key]) => {
      restoreStoreSnapshot(key, savedStores[key]);
    });
  } finally {
    isRestoring = false;
  }
};

export const startDungeonCrawlerBackendSync = (): (() => void) => {
  if (syncStarted) {
    return () => undefined;
  }

  syncStarted = true;
  unsubscribeAll = Object.values(storeRegistry).map(store => store.subscribe(syncBackendSnapshot));

  return () => {
    unsubscribeAll.forEach(unsubscribe => unsubscribe());
    unsubscribeAll = [];
    syncStarted = false;
    if (backendSyncTimer) {
      clearTimeout(backendSyncTimer);
      backendSyncTimer = null;
    }
  };
};
