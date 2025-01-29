import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import connectionReducer from './connectionSlice'
import requestReducer from './requestSlice'

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['user'] // Persist only 'user' slice to avoid unnecessary re-renders
};


// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  connection:connectionReducer,
  requests:requestReducer
});

// Persist the combined reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for non-serializable values
    }),
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Export the store
export default store;
