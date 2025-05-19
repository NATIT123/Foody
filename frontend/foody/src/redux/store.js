import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import orderReducer from "../redux/order/orderSlice";
import themeReducer from "./theme/theme.slice";
import resourceReducer from "./resource/resourceDataSlice";
import resourceFilterReducer from "./resource/resourceFilterSlice";
import notificationReducer from "./notification/notificationSlice";
import userReducer from "./user/userSlice";
import restaurantReducer from "./restaurant/restaurantSlice";
import foodReducer from "./food/foodSlice";
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
  blacklist: ["account", "user", "resourceFilter", "food", "restaurant"],
  whilelist: ["app", "resource"],
};

const rootReducer = combineReducers({
  account: accountReducer,
  app: themeReducer,
  order: orderReducer,
  resource: resourceReducer,
  resourceFilter: resourceFilterReducer,
  notification: notificationReducer,
  user: userReducer,
  restaurant: restaurantReducer,
  food: foodReducer,
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
