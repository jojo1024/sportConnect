import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Clés de stockage
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    IS_AUTHENTICATED: 'is_authenticated',
} as const;

// Configuration pour redux-persist
export const reduxStorage = {
    getItem: (key: string) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    setItem: (key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve();
    },
    removeItem: (key: string) => {
        storage.delete(key);
        return Promise.resolve();
    },
};

export const mmkvStorage = {
    // Tokens
    setAccessToken: (token: string) => {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    getAccessToken: (): string | null => {
        return storage.getString(STORAGE_KEYS.ACCESS_TOKEN) || null;
    },

    setRefreshToken: (token: string) => {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    getRefreshToken: (): string | null => {
        return storage.getString(STORAGE_KEYS.REFRESH_TOKEN) || null;
    },

    // Données utilisateur
    setUserData: (userData: any) => {
        storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    },

    getUserData: (): any | null => {
        const data = storage.getString(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    },

    // État d'authentification
    setIsAuthenticated: (isAuthenticated: boolean) => {
        storage.set(STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated);
    },

    getIsAuthenticated: (): boolean => {
        return storage.getBoolean(STORAGE_KEYS.IS_AUTHENTICATED) || false;
    },

    // Nettoyage complet
    clearAll: () => {
        storage.clearAll();
    },

    // Nettoyage des données d'authentification
    clearAuthData: () => {
        storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
        storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
        storage.delete(STORAGE_KEYS.USER_DATA);
        storage.delete(STORAGE_KEYS.IS_AUTHENTICATED);
    },
};

export default mmkvStorage;