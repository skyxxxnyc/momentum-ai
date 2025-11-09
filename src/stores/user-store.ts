import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
interface UserProfile {
  name: string;
  email: string;
}
interface UserPreferences {
  emailNotifications: boolean;
}
interface UserState {
  user: UserProfile;
  preferences: UserPreferences;
  setUser: (profile: Partial<UserProfile>) => void;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
}
export const useUserStore = create<UserState>()(
  immer((set) => ({
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    preferences: {
      emailNotifications: true,
    },
    setUser: (profile) =>
      set((state) => {
        state.user = { ...state.user, ...profile };
      }),
    setPreference: (key, value) =>
      set((state) => {
        state.preferences[key] = value;
      }),
  }))
);