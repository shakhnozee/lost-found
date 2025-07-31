import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ItemsState, Item } from "@/types"

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
}

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload)
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { setItems, setLoading, setError, addItem, updateItem, removeItem } = itemsSlice.actions

export const store = configureStore({
  reducer: {
    items: itemsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
