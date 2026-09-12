import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuthAccountDto } from '@/api/api-template'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'unavailable'

export interface AuthState {
  status: AuthStatus
  account: AuthAccountDto | null
}

const initialState: AuthState = {
  status: 'loading',
  account: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStarted(state) {
      state.status = 'loading'
    },
    sessionReceived(state, action: PayloadAction<AuthAccountDto>) {
      state.status = 'authenticated'
      state.account = action.payload
    },
    sessionCleared(state) {
      state.status = 'anonymous'
      state.account = null
    },
    authUnavailable(state) {
      state.status = 'unavailable'
      state.account = null
    }
  }
})

export const { authStarted, authUnavailable, sessionCleared, sessionReceived } = authSlice.actions
export const authReducer = authSlice.reducer
