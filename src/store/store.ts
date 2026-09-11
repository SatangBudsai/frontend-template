import { configureStore } from '@reduxjs/toolkit'

const initialState = {}

function rootReducer(state: Record<string, never> = initialState) {
  return state
}

export function makeStore() {
  return configureStore({ reducer: rootReducer })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
