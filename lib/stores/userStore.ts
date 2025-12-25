'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserStore {
  // State
  currentUser: User | null
  isLoading: boolean
  error: string | null
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void

  // Actions
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Initial state
      currentUser: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Actions
      setUser: (user) => set({ currentUser: user, error: null }),
      
      updateUser: (updates) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        })),

      clearUser: () => set({ currentUser: null, error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({ currentUser: state.currentUser }), // Only persist user
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

// Selectors
export const selectIsAuthenticated = (state: UserStore) => !!state.currentUser
export const selectIsEmailVerified = (state: UserStore) => state.currentUser?.emailVerified ?? false
export const selectOnboardingComplete = (state: UserStore) => state.currentUser?.onboardingComplete ?? false
export const selectAccountType = (state: UserStore) => state.currentUser?.accountType
export const selectMembershipStatus = (state: UserStore) => state.currentUser?.membershipStatus
