import {create} from 'zustand';
import {Session} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../lib/supabase';

interface AuthState {
  session: Session | null;
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  setSession: (session: Session | null) => void;
  completeOnboarding: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const ONBOARDING_KEY = '@PureDNS_onboarding_completed';

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isInitialized: false,
  isOnboardingCompleted: false,

  setSession: (session) => set({session}),

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      set({isOnboardingCompleted: true});
    } catch (e) {
      console.error('Error saving onboarding state:', e);
    }
  },

  initializeAuth: async () => {
    try {
      // Check onboarding state
      const onboardingState = await AsyncStorage.getItem(ONBOARDING_KEY);
      const isOnboardingCompleted = onboardingState === 'true';

      // Get initial session
      const {data: {session}} = await supabase.auth.getSession();

      set({
        session,
        isOnboardingCompleted,
        isInitialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, newSession) => {
        set({session: newSession});
      });
    } catch (e) {
      console.error('Error initializing auth:', e);
      set({isInitialized: true}); // Initialize anyway to prevent blank screen
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({session: null});
  },

  deleteAccount: async () => {
    // Ruft die sichere Datenbank-Funktion auf, um den Nutzer serverseitig zu löschen
    const {error} = await supabase.rpc('delete_user_account');
    
    if (error) {
      throw error;
    }
    
    // Nach erfolgreicher Löschung ausloggen und Session zurücksetzen
    await supabase.auth.signOut();
    set({session: null});
  },
}));
