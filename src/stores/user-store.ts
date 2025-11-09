import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/types';
export type UserProfile = User;
interface UserPreferences {
  emailNotifications: boolean;
  dashboardLayout: string[];
}
interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  login: (user: UserProfile) => void;
  logout: () => void;
  setUser: (profile: Partial<UserProfile>) => void;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  setDashboardLayout: (layout: string[]) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      preferences: {
        emailNotifications: true,
        dashboardLayout: [
          'kpi-pipeline',
          'kpi-deals-won',
          'kpi-conversion',
          'kpi-activities',
          'chart-forecast',
          'chart-pipeline',
          'chart-activity',
        ],
      },
      login: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
        }),
      logout: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        }),
      setUser: (profile) =>
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...profile };
          }
        }),
      setPreference: (key, value) =>
        set((state) => {
          state.preferences[key] = value;
        }),
      setDashboardLayout: (layout) =>
        set((state) => {
          state.preferences.dashboardLayout = layout;
        }),
    })),
    {
      name: 'momentum-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);