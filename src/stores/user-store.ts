import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}
interface UserPreferences {
  emailNotifications: boolean;
  dashboardLayout: string[];
}
interface UserState {
  user: UserProfile;
  preferences: UserPreferences;
  setUser: (profile: Partial<UserProfile>) => void;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  setDashboardLayout: (layout: string[]) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: {
        id: 'user-1',
        name: 'Alex Johnson',
        email: 'alex.johnson@momentum.ai',
        avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=alex',
      },
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
      setUser: (profile) =>
        set((state) => {
          state.user = { ...state.user, ...profile };
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
      partialize: (state) => ({ preferences: state.preferences, user: state.user }),
    }
  )
);