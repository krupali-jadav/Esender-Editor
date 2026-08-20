import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/Reducer/Reducer.user';
import appReducer from '../Redux/Reducer/reducer.app';
import { persistStore, persistReducer, } from 'redux-persist';

// redux-persist 6 ships CommonJS; under Vite the default import of
// `redux-persist/lib/storage` can resolve to the module namespace instead of
// the storage object, causing "storage.setItem is not a function".
// Building storage explicitly from createWebStorage avoids that interop issue.
import createWebStorageModule from 'redux-persist/lib/storage/createWebStorage';

const createWebStorage =
    createWebStorageModule.default || createWebStorageModule;

const storage = createWebStorage('local');

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const persistedAppReducer = persistReducer(
    {
        key: 'app',
        storage,
    },
    appReducer
);

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        app: persistedAppReducer,
        // domain: domainReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
