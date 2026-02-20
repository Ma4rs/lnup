import { create } from "zustand";
import type { Profile } from "@/types";
import { MOCK_PROFILES } from "@/lib/mockData";

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  setUser: (user: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_PROFILES[1], // mock: logged in as Sarah for demo
  isAuthenticated: true,
  isLoading: false,

  login: async (_email, _password) => {
    set({ isLoading: true });
    // TODO: Replace with Supabase auth
    await new Promise((r) => setTimeout(r, 500));
    set({ user: MOCK_PROFILES[1], isAuthenticated: true, isLoading: false });
  },

  register: async (_email, _password, _username) => {
    set({ isLoading: true });
    // TODO: Replace with Supabase auth
    await new Promise((r) => setTimeout(r, 500));
    set({ user: MOCK_PROFILES[1], isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
