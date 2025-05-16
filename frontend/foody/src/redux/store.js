import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/counter/counterSlice";
import accountReducer from "../redux/account/accountSlice";
import orderReducer from "../redux/order/orderSlice";
import themeReducer from "./theme/theme.slice";
import resourceReducer from "./resource/resourceDataSlice";
import resourceFilterReducer from "./resource/resourceFilterSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["account"],
  whilelist: ["app", "resource"],
};

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  app: themeReducer,
  order: orderReducer,
  resource: resourceReducer,
  resourceFilter: resourceFilterReducer,
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

export const getAppState = () => store.getState();
export const appDispatch = store.dispatch;
