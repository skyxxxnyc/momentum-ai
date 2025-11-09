import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
interface UserProfile {
  name: string;
  email: string;
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
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      preferences: {
        emailNotifications: true,
        dashboardLayout: [
          'kpi-pipeline',
          'kpi-deals-won',
          'kpi-conversion',
          'kpi-activities',
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
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);