import { api } from "../../api/api";
import { configureStore } from "@reduxjs/toolkit";
import selectedItemsReducer from '../../store/selectedItemsSlice'

export const createTestStore = () =>
  configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });