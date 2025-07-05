import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import { reduxStorage } from './hooks/mmkvStorage';

// Configuration de la persistance
const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    version: 2,
    whitelist: ['app','user'], // Seulement persister le reducer user
    // blacklist: ['app'], // Ne pas persister le reducer app
    // Configuration pour éviter les problèmes de persistance
    serialize: true,
    deserialize: true,
    // Timeout pour éviter les blocages
    timeout: 10000,
};

const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Configuration des listeners pour RTK Query
setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 